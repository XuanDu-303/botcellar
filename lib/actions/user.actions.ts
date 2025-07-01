'use server'
import bcrypt from 'bcryptjs'
import { IUserName, IUserSignIn, IUserSignUp, IForgotPassword, IResetPassword } from '@/types'
import { UserSignUpSchema, UserUpdateSchema, ForgotPasswordSchema, ResetPasswordSchema } from '../validator'
import { z } from 'zod'
import { connectToDatabase } from '../db'
import User, { IUser } from '../db/models/user.model'
import { revalidatePath } from 'next/cache'
import { getSetting } from './setting.actions'
import { formatError } from '../utils'
import { redirect } from 'next/navigation'
import { auth, signIn, signOut } from '../auth'
import PasswordResetToken from '../db/models/password-reset-token.model'
import { randomBytes } from 'crypto'
import { sendResetPasswordEmail } from '@/emails'
import { SERVER_URL } from '../constants'

export async function signInWithCredentials(user: IUserSignIn) {
  return await signIn('credentials', { ...user, redirect: false })
}

export const SignOut = async () => {
  const redirectTo = await signOut({ redirect: false })
  redirect(redirectTo.redirect)
}

export async function registerUser(userSignUp: IUserSignUp) {
  try {
    const user = await UserSignUpSchema.parseAsync({
      name: userSignUp.name,
      email: userSignUp.email,
      password: userSignUp.password,
      confirmPassword: userSignUp.confirmPassword,
    })

    await connectToDatabase()
    await User.create({
      ...user,
      password: await bcrypt.hash(user.password, bcrypt.genSaltSync(10)),
    })
    return { success: true, message: 'User created successfully' }
  } catch (error) {
    return { success: false, error: formatError(error) }
  }
}

export async function updateUserName(user: IUserName) {
  try {
    await connectToDatabase()
    const session = await auth()
    const currentUser = await User.findById(session?.user?.id)
    if (!currentUser) throw new Error('User not found')
    currentUser.name = user.name
    const updatedUser = await currentUser.save()
    return {
      success: true,
      message: 'User updated successfully',
      data: JSON.parse(JSON.stringify(updatedUser)),
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

export async function deleteUser(id: string) {
  try {
    await connectToDatabase()
    const res = await User.findByIdAndDelete(id)
    if (!res) throw new Error('Use not found')
    revalidatePath('/admin/users')
    return {
      success: true,
      message: 'User deleted successfully',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

// GET
export async function getAllUsers({
  limit,
  page,
}: {
  limit?: number
  page: number
}) {
  const {
    common: { pageSize },
  } = await getSetting()
  limit = limit || pageSize
  await connectToDatabase()

  const skipAmount = (Number(page) - 1) * limit
  const users = await User.find()
    .sort({ createdAt: 'desc' })
    .skip(skipAmount)
    .limit(limit)
  const usersCount = await User.countDocuments()
  return {
    data: JSON.parse(JSON.stringify(users)) as IUser[],
    totalPages: Math.ceil(usersCount / limit),
  }
}

export async function updateUser(user: z.infer<typeof UserUpdateSchema>) {
  try {
    await connectToDatabase()
    const dbUser = await User.findById(user._id)
    if (!dbUser) throw new Error('User not found')
    dbUser.name = user.name
    dbUser.email = user.email
    dbUser.role = user.role
    const updatedUser = await dbUser.save()
    revalidatePath('/admin/users')
    return {
      success: true,
      message: 'User updated successfully',
      data: JSON.parse(JSON.stringify(updatedUser)),
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

export async function getUserById(userId: string) {
  await connectToDatabase()
  const user = await User.findById(userId)
  if (!user) throw new Error('User not found')
  return JSON.parse(JSON.stringify(user)) as IUser
}

export async function requestPasswordReset(data: IForgotPassword) {
  try {
    const { email } = await ForgotPasswordSchema.parseAsync(data)
    await connectToDatabase()

    const user = await User.findOne({ email })
    if (!user) throw new Error('User not found')

    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60) // 1 hour

    await PasswordResetToken.findOneAndUpdate(
      { userId: user._id },
      { token, expiresAt },
      { upsert: true, new: true }
    )

    const resetUrl = `${SERVER_URL}/reset-password/${token}`
    await sendResetPasswordEmail({ to: email, url: resetUrl })

    return { success: true }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

export async function resetPassword(data: IResetPassword & { token: string }) {
  try {
    const { password } = await ResetPasswordSchema.parseAsync(data)
    await connectToDatabase()

    const record = await PasswordResetToken.findOne({ token: data.token })
    if (!record || record.expiresAt < new Date()) {
      throw new Error('Invalid or expired token')
    }

    const user = await User.findById(record.userId)
    if (!user) throw new Error('User not found')

    user.password = await bcrypt.hash(password, bcrypt.genSaltSync(10))
    await user.save()
    await record.deleteOne()

    return { success: true }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}