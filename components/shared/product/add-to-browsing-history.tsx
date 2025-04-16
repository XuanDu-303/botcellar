'use client'
import useBrowsingHistory from '@/hooks/use-browsing-history'
import { useEffect, useRef } from 'react'

export default function AddToBrowsingHistory({
  product
}: {
  product: {_id: string, category: string}
}) {
  const { addItem } = useBrowsingHistory()
  const hasAdded = useRef(false)

  useEffect(() => {
    if (!hasAdded.current && product._id && product.category) {
      addItem({ id: product._id, category: product.category })
      hasAdded.current = true
    }
  }, [addItem, product._id, product.category])
  return null
}