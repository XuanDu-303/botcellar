'use client'
import { getMonthName } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import ProductPrice from '@/components/shared/product/product-price'
import { SalesEntry } from '@/types/order-summary.types'

type TableChartProps = {
  labelType: 'month' | 'product'
  data: SalesEntry[]
}

interface ProgressBarProps {
  value: number // Accepts a number between 0 and 100
  className?: string
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value }) => {
  // Ensure value stays within 0-100 range
  const boundedValue = Math.min(100, Math.max(0, value))
  const [animatedValue, setAnimatedValue] = useState(0)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimatedValue(boundedValue)
    }, 50)

    return () => clearTimeout(timeout)
  }, [boundedValue])
  return (
    <div className='relative w-full h-4 overflow-hidden'>
      <div
        className='bg-primary h-full transition-all duration-700 rounded-lg'
        style={{
          width: `${animatedValue}%`,
          float: 'right',
        }}
      />
    </div>
  )
}

export default function TableChart({
  labelType = 'month',
  data = [],
}: TableChartProps) {
  const max = Math.max(...data.map((item) => item.value))
  const dataWithPercentage = data.map((x) => ({
    ...x,
    label: labelType === 'month' ? getMonthName(x.label) : x.label,
    percentage: Math.round((x.value / max) * 100),
  }))
  return (
    <div className='space-y-3'>
      {dataWithPercentage.map(({ label, id, value, image, percentage }) => (
        <div
          key={label}
          className={`grid grid-cols-[100px_1fr_80px] gap-2 items-center ${image ? 'md:grid-cols-[200px_1fr_80px]' : 'md:grid-cols-[150px_1fr_80px]'}`}
        >
          {image ? (
            <Link className='flex items-center gap-1' href={`/admin/products/${id}`}>
              <Image
                className='rounded border border-border aspect-square object-scale-down max-w-full h-auto mx-auto mr-1'
                src={image!}
                alt={label}
                width={36}
                height={36}
              />
              <p className='text-center text-sm whitespace-nowrap overflow-hidden text-ellipsis'>
                {label}
              </p>
            </Link>
          ) : (
            <div className='flex h-[36px] whitespace-nowrap items-center text-sm'>{label}</div>
          )}

          <ProgressBar value={percentage} />

          <div className='text-sm text-right flex items-center'>
            <ProductPrice price={value} plain />
          </div>
        </div>
      ))}
    </div>
  )
}