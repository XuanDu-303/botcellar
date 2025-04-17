import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useCallback } from 'react'

type Product = { id: string; category: string }

type BrowsingHistory = {
  products: Product[]
  addItem: (product: Product) => void
  clear: () => void
}

const initialState: Pick<BrowsingHistory, 'products'> = {
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
      // optional: chỉ lưu trường products
      partialize: (state) => ({ products: state.products }),
    }
  )
)

export default function useBrowsingHistory() {
  const { products, addItem, clear } = browsingHistoryStore()

  // memo hóa để dùng trong useEffect không lỗi
  const stableAddItem = useCallback((product: Product) => {
    addItem(product)
  }, [addItem])

  return {
    products,
    addItem: stableAddItem,
    clear,
  }
}
