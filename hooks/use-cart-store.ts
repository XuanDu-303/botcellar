import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Cart, OrderItem } from '@/types'
import { calcDeliveryDateAndPrice } from '@/lib/actions/order.actions'

const initialState: Cart = {
  items: [],
  itemsPrice: 0,
  taxPrice: undefined,
  shippingPrice: undefined,
  totalPrice: 0,
  paymentMethod: undefined,
  deliveryDateIndex: undefined,
}

interface CartState {
  cart: Cart
  addItem: (item: OrderItem, quantity: number) => Promise<string>
  init: () => void
}

const useCartStore = create(
  persist<CartState>(
    (set, get) => ({
      cart: initialState,

      addItem: async (item: OrderItem, quantity: number) => {
        const { cart } = get()
        const items = cart.items

        const existItem = items.find(
          (x) =>
            x.product === item.product &&
            x.color === item.color &&
            x.size === item.size
        )

        // Kiểm tra tồn kho
        const newQuantity = existItem
          ? existItem.quantity + quantity
          : quantity

        if (item.countInStock < newQuantity) {
          throw new Error('Not enough items in stock')
        }

        const updatedItems = existItem
          ? items.map((x) =>
              x.product === item.product &&
              x.color === item.color &&
              x.size === item.size
                ? { ...x, quantity: newQuantity }
                : x
            )
          : [...items, { ...item, quantity}]

        const priceInfo = await calcDeliveryDateAndPrice({ items: updatedItems })

        set({
          cart: {
            ...cart,
            items: updatedItems,
            ...priceInfo,
          },
        })

        const addedItem = updatedItems.find(
          (x) =>
            x.product === item.product &&
            x.color === item.color &&
            x.size === item.size
        )

        return addedItem?.cartItemId ?? ''
      },

      init: () => set({ cart: initialState }),
    }),
    {
      name: 'cart-store',
    }
  )
)

export default useCartStore
