import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Cart, OrderItem, ShippingAddress} from "@/types";
import { calcDeliveryDateAndPrice } from "@/lib/actions/order.actions";

const initialState: Cart = {
  items: [],
  itemsPrice: 0,
  totalPrice: 0,
  taxPrice: undefined,
  paymentMethod: undefined,
  shippingPrice: undefined,
  shippingAddress: undefined,
  deliveryDateIndex: undefined,
};

interface CartState {
  cart: Cart;
  isLoading: boolean,
  setIsLoading: (value: boolean) => void
  setCart: (cart: Cart) => void
  addItem: (item: OrderItem, quantity: number) => Promise<string>;
  updateItem: (item: OrderItem, quantity: number) => Promise<void>;
  removeItem: (item: OrderItem) => void;
  clearCart: () => void
  setShippingAddress: (shippingAddress: ShippingAddress) => Promise<void>
  setPaymentMethod: (paymentMethod: string) => void 
  setDeliveryDateIndex: (index: number) => Promise<void>
  init: () => void;
}

const matchItem = (a: OrderItem, b: OrderItem) =>
  a.product === b.product && a.color === b.color && a.size === b.size;

const useCartStore = create(
  persist<CartState>(
    (set, get) => ({
      cart: initialState,

      isLoading: true,

      setIsLoading: (value) => set({ isLoading: value }),

      setCart: (cartData) => set({ cart: { ...cartData } }),

      addItem: async (item, quantity) => {
        set({ isLoading: true });
        try {
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
          const priceInfo = await calcDeliveryDateAndPrice({ items: updatedItems, shippingAddress: cart.shippingAddress});
          const updatedCart = { items: updatedItems, ...priceInfo };

          set({ cart: { ...cart, ...updatedCart } });

          const added = updatedItems.find((x) => matchItem(x, item));
          return added?.cartItemId ?? "";
        } finally {
          set({ isLoading: false });
        }
      },

      updateItem: async (item, quantity) => {
        set({ isLoading: true });
        try {
          const { cart } = get();
          const items = get().cart.items;
          const exist = items.find((x) => matchItem(x, item));
          if (!exist) return;

          const updatedItems = items.map((x) =>
            matchItem(x, item) ? { ...x, quantity } : x
          );

          const priceInfo = await calcDeliveryDateAndPrice({ items: updatedItems, shippingAddress: cart.shippingAddress});
          const updatedCart = { items: updatedItems, ...priceInfo };

          set({ cart: { ...cart, ...updatedCart } });
        } finally {
          set({ isLoading: false });
        }
      },

      removeItem: async (item) => {
        set({ isLoading: true });
        try {
          const { cart } = get();
          const items = get().cart.items;
          const updatedItems = items.filter((x) => !matchItem(x, item));
          const priceInfo = await calcDeliveryDateAndPrice({ items: updatedItems, shippingAddress: cart.shippingAddress});
          const updatedCart = { items: updatedItems, ...priceInfo };
          set({ cart: { ...cart, ...updatedCart } });
        } finally {
          set({ isLoading: false });
        }
      },

      init: () => set({ cart: initialState }),
      setShippingAddress: async (shippingAddress: ShippingAddress) => {
        const { items } = get().cart
        set({
          cart: {
            ...get().cart,
            shippingAddress,
            ...(await calcDeliveryDateAndPrice({
              items,
              shippingAddress,
            })),
          },
        })
      },
      setPaymentMethod: (paymentMethod: string) => {
        set({
          cart: {
            ...get().cart,
            paymentMethod,
          },
        })
      },
      setDeliveryDateIndex: async (index: number) => {
        const { items, shippingAddress } = get().cart
  
        set({
          cart: {
            ...get().cart,
            ...(await calcDeliveryDateAndPrice({
              items,
              shippingAddress,
              deliveryDateIndex: index,
            })),
          },
        })
      },
      clearCart: () => {
        set({
          cart: {
            ...get().cart,
            items: [],
          },
        })
      },
    }),
    {
      name: "cart-store",
      onRehydrateStorage: () => (state) => {
        state?.setIsLoading(false);
      },
    }
  )
);

export default useCartStore;
