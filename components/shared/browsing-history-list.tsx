'use client'

import React, { useEffect, useState, useMemo } from 'react'
import useBrowsingHistory from '@/hooks/use-browsing-history'
import { Separator } from '../ui/separator'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import dynamic from 'next/dynamic'

const ProductSlider = dynamic(
  () => import('./product/product-slider'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center">
        <div className="border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-primary" />
      </div>
    ),
  }
)

export default function BrowsingHistoryList({ className, excludeId = '' }: { className?: string, excludeId?: string }) {
  const { products } = useBrowsingHistory()
  
  const t = useTranslations('Home')
  if (products.length === 0) return null

  return (
    <div className="bg-background">
      <Separator className={cn('mb-4', className)} />

      <ProductList
        title={t("Related to items that you've viewed")}
        type="related"
        excludeId={excludeId}
      />

      <Separator className="mb-4" />

      <ProductList
        title={t('Your browsing history')}
        type="history"
        hideDetails
        excludeId={excludeId}
      />
    </div>
  )
}

function ProductList({
  title,
  type = 'history',
  hideDetails = false,
  excludeId = '',
}: {
  title: string
  type?: 'history' | 'related'
  hideDetails?: boolean
  excludeId?: string
}) {
  const { products } = useBrowsingHistory()
  const [data, setData] = useState([])

  // 🔁 Tạo URL chỉ khi cần thiết
  const queryUrl = useMemo(() => {
    if (!products.length) return null
    const categories = products.map(p => p.category).join(',')
    const ids = products.map(p => p.id).join(',')
    return `/api/products/browsing-history?type=${type}&excludeId=${excludeId}&categories=${categories}&ids=${ids}`
  }, [excludeId, products, type])

  useEffect(() => {
    if (!queryUrl) return

    const fetchProducts = async () => {
      try {
        const res = await fetch(queryUrl)
        const result = await res.json()
        setData(result)
      } catch (error) {
        console.error('Failed to fetch browsing history products:', error)
      }
    }

    fetchProducts()
  }, [queryUrl])

  if (!data.length) return null

  return <ProductSlider title={title} products={data} hideDetails={hideDetails} />
}
