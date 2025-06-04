import { Cart } from '@/types'
import { Document, Model, model, models, Schema } from 'mongoose'

export interface ICart extends Document, Cart {
  _id: string
  user: string
  createdAt: Date
  updatedAt: Date
}

const cartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId as unknown as typeof String,
      ref: 'User',
      required: true,
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        cartItemId: { type: String, required: true },
        name: { type: String, required: true },
        slug: { type: String, required: true },
        image: { type: String, required: true },
        category: { type: String, required: true },
        price: { type: Number, required: true },
        countInStock: { type: Number, required: true },
        quantity: { type: Number, required: true },
        size: { type: String },
        color: { type: String },
      },
    ],
    itemsPrice: { type: Number, required: true },
    taxPrice: { type: Number },
    shippingPrice: { type: Number },
    totalPrice: { type: Number, required: true },
    paymentMethod: { type: String },
    deliveryDateIndex: { type: Number },
    expectedDeliveryDate: { type: Date },
    shippingAddress: {
      fullName: { type: String },
      street: { type: String },
      city: { type: String },
      postalCode: { type: String },
      country: { type: String },
      province: { type: String },
      phone: { type: String },
    },
  },
  {
    timestamps: true,
  }
)

const CartModel =
  (models.Cart as Model<ICart>) || model<ICart>('Cart', cartSchema)

export default CartModel