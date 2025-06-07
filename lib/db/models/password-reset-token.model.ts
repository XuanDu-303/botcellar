import { Schema, model, models, Types, Document, Model } from 'mongoose'

export interface IPasswordResetToken extends Document {
  userId: Types.ObjectId
  token: string
  expiresAt: Date
}

const PasswordResetTokenSchema = new Schema<IPasswordResetToken>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true, // Optional: useful for auditing (createdAt, updatedAt)
  }
)

const PasswordResetToken: Model<IPasswordResetToken> =
  models.PasswordResetToken ||
  model<IPasswordResetToken>('PasswordResetToken', PasswordResetTokenSchema)

export default PasswordResetToken
