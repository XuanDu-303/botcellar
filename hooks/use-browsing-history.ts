import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type BrowsingHistory = {
  products: { id: string; category: string }[]
  addItem: (product: { id: string; category: string }) => void
  clear: () => void
}

const initialState: Omit<BrowsingHistory, 'addItem' | 'clear'> = {
  products: [],
}

export const browsingHistoryStore = create<BrowsingHistory>()(
  persist(
    (set, get) => ({
      ...initialState,
      addItem: (product) => {
        const current = get().products.filter(p => p.id !== product.id)
        const updated = [product, ...current].slice(0, 10) // giữ tối đa 10 item
        set({ products: updated })
      },
      clear: () => set({ products: [] }),
    }),
    {
      name: 'browsingHistoryStore',
    }
  )
)

export default function useBrowsingHistory() {
  const { products, addItem, clear } = browsingHistoryStore()
  return { products, addItem, clear }
}
