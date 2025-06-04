'use server'

import { auth } from '../auth'
import { connectToDatabase } from '../db'
import CartModel, { ICart } from '../db/models/cart.model'
import { Cart } from '@/types'
import { CartSchema } from '../validator'
import { formatError } from '../utils'

/**
 * Helper to ensure user is authenticated and DB is connected.
 */
const getSessionAndInit = async () => {
  const session = await auth()
  if (!session) throw new Error('User is not authenticated')
  await connectToDatabase()
  return session
}

/**
 * Get the authenticated user's cart.
 */
export const getCart = async (): Promise<ICart | null> => {
  const session = await getSessionAndInit()
  const cart = await CartModel.findOne({ user: session.user.id })
  return cart ? JSON.parse(JSON.stringify(cart)) as ICart : null
}

/**
 * Create or update the user's cart.
 */
export const setCart = async (clientCart: Cart) => {
  try {
    const session = await getSessionAndInit()
    const validated = CartSchema.parse(clientCart)

    const updated = await CartModel.findOneAndUpdate(
      { user: session.user.id },
      { ...validated, user: session.user.id },
      { new: true, upsert: true }
    )

    return {
      success: true,
      message: 'Cart saved successfully',
      data: JSON.parse(JSON.stringify(updated)) as ICart,
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

/**
 * Remove the user's cart.
 */
export const clearCartServer = async () => {
  try {
    const session = await getSessionAndInit()
    await CartModel.findOneAndDelete({ user: session.user.id })
    return { success: true, message: 'Cart cleared successfully' }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}
