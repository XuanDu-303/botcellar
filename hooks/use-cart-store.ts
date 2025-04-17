import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Cart, OrderItem } from "@/types";
import { calcDeliveryDateAndPrice } from "@/lib/actions/order.actions";

const initialState: Cart = {
  items: [],
  itemsPrice: 0,
  taxPrice: undefined,
  shippingPrice: undefined,
  totalPrice: 0,
  paymentMethod: undefined,
  deliveryDateIndex: undefined,
};

interface CartState {
  cart: Cart;
  addItem: (item: OrderItem, quantity: number) => Promise<string>;
  updateItem: (item: OrderItem, quantity: number) => Promise<void>;
  removeItem: (item: OrderItem) => void;
  init: () => void;
}

const matchItem = (a: OrderItem, b: OrderItem) =>
  a.product === b.product && a.color === b.color && a.size === b.size;

const recalculateCart = async (items: OrderItem[]) => {
  const priceInfo = await calcDeliveryDateAndPrice({ items });
  return {
    ...priceInfo,
    items,
  };
};

const useCartStore = create(
  persist<CartState>(
    (set, get) => ({
      cart: initialState,

      addItem: async (item, quantity) => {
        const { cart } = get();
        const items = cart.items;

        const existItem = items.find((x) => matchItem(x, item));
        const newQuantity = existItem
          ? existItem.quantity + quantity
          : quantity;

        if (item.countInStock < newQuantity) {
          throw new Error("Not enough items in stock");
        }

        const updatedItems = existItem
          ? items.map((x) =>
              matchItem(x, item) ? { ...x, quantity: newQuantity } : x
            )
          : [...items, { ...item, quantity }];

        const updatedCart = await recalculateCart(updatedItems);

        set({ cart: { ...cart, ...updatedCart } });

        const added = updatedItems.find((x) => matchItem(x, item));
        return added?.cartItemId ?? "";
      },

      updateItem: async (item, quantity) => {
        const items = get().cart.items;
        const exist = items.find((x) => matchItem(x, item));
        if (!exist) return;

        const updatedItems = items.map((x) =>
          matchItem(x, item) ? { ...x, quantity } : x
        );

        const updatedCart = await recalculateCart(updatedItems);
        set({ cart: { ...get().cart, ...updatedCart } });
      },

      removeItem: async (item) => {
        const items = get().cart.items;
        const updatedItems = items.filter((x) => !matchItem(x, item));
        const updatedCart = await recalculateCart(updatedItems);
        set({ cart: { ...get().cart, ...updatedCart } });
      },

      init: () => set({ cart: initialState }),
    }),
    {
      name: "cart-store",
    }
  )
);

export default useCartStore;
