'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { TrashIcon, PlusIcon, MinusIcon } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'

import useCartStore from '@/hooks/use-cart-store'
import useSettingStore from '@/hooks/use-setting-store'
import { getDirection } from '@/i18n-config'
import { cn } from '@/lib/utils'
import ProductPrice from './product/product-price'
import Loading from './loading'
import { Button, buttonVariants } from '../ui/button'
import { Separator } from '../ui/separator'
import { ScrollArea } from '../ui/scroll-area'

export default function CartSidebar() {
  const {
    cart: { items, itemsPrice },
    updateItem,
    removeItem,
  } = useCartStore()

  const {
    setting: {
      common: { freeShippingMinPrice },
    },
  } = useSettingStore()

  const t = useTranslations('Cart')
  const locale = useLocale()

  const [loading, setLoading] = useState(true)
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null)

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className="w-32 overflow-y-auto">
      <div
        className={cn(
          'fixed h-full w-32 bg-background',
          getDirection(locale) === 'rtl' ? 'border-r' : 'border-l'
        )}
      >
        <div className="p-2 h-full flex flex-col gap-2 justify-center items-center">
          {/* Subtotal */}
          <div className="text-center text-sm space-y-1 pt-2">
            <div>{t('Subtotal')}</div>
            <div className="font-bold">
              <ProductPrice price={itemsPrice} plain />
            </div>
            <div className="space-y-2">
              {itemsPrice > freeShippingMinPrice && (
                <div className="text-xs text-center">
                  {t('Your order qualifies for FREE Shipping')}
                </div>
              )}

              <Link
                href="/cart"
                className={cn(
                  buttonVariants({ variant: 'outline' }),
                  'rounded-full text-xs hover:no-underline w-full'
                )}
              >
                {t('Go to Cart')}
              </Link>
            </div>
          </div>

          <Separator className="my-1" />

          <ScrollArea className="flex-1 w-full px-1 max-h-[72vh]">
            {loading
              ? Array.from({ length: 2 }).map((_, i) => <CartItemSkeleton key={i} />)
              : items.map((item) => (
                  <div key={item.cartItemId} className="mb-2">
                    {/* Image */}
                    <Link href={`/product/${item.slug}`}>
                      <div className="relative h-24">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          unoptimized
                          sizes="20vw"
                          className="object-contain"
                        />
                      </div>
                    </Link>

                    {/* Price */}
                    <div className="text-sm text-center py-1 font-bold">
                      <ProductPrice price={item.price} plain />
                    </div>

                    {/* Quantity stepper */}
                    <div className="flex items-center justify-between gap-2 mt-2 border-2 border-primary rounded-full">
                      {item.quantity === 1 ? (
                        <Button
                          onClick={() => removeItem(item)}
                          variant="ghost"
                          size="icon"
                          className="w-7 h-7 rounded-full text-foreground font-bold"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          onClick={async () => {
                            setLoadingItemId(item.cartItemId)
                            await updateItem(item, item.quantity - 1)
                            setLoadingItemId(null)
                          }}
                          variant="ghost"
                          size="icon"
                          className="w-7 h-7 rounded-full text-foreground font-bold"
                        >
                          <MinusIcon className="w-4 h-4" />
                        </Button>
                      )}

                      <span className="w-6 text-center text-sm text-foreground font-bold">
                        {loadingItemId === item.cartItemId ? <Loading /> : item.quantity}
                      </span>

                      <Button
                        onClick={async () => {
                          if (item.quantity < item.countInStock) {
                            setLoadingItemId(item.cartItemId)
                            await updateItem(item, item.quantity + 1)
                            setLoadingItemId(null)
                          }
                        }}
                        variant="ghost"
                        size="icon"
                        className="w-7 h-7 rounded-full text-foreground font-bold"
                      >
                        <PlusIcon className="w-4 h-4" />
                      </Button>
                    </div>

                    <Separator className="my-3" />
                  </div>
                ))}
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}

function CartItemSkeleton() {
  return (
    <div className="animate-pulse space-y-2 p-2">
      <div className="relative h-24 w-full rounded bg-gray-200" />
      <div className="h-4 w-1/2 mx-auto bg-gray-200 rounded" />
      <div className="flex items-center justify-between gap-2 border-2 mt-2 bg-gray-200 h-7 rounded-full" />
      <Separator />
    </div>
  )
}
