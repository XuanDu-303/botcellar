'use client'

import Link from 'next/link'
import { ShoppingCartIcon } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'

import useIsMounted from '@/hooks/use-is-mounted'
import useCartStore from '@/hooks/use-cart-store'
import useShowSidebar from '@/hooks/use-cart-sidebar'
import { getDirection } from '@/i18n-config'
import { cn } from '@/lib/utils'

export default function CartButton() {
  const isMounted = useIsMounted()
  const {
    cart: { items },
  } = useCartStore()

  const cartItemsCount = items.reduce((acc, item) => acc + item.quantity, 0)
  const showSidebar = useShowSidebar()
  const t = useTranslations('Header')
  const locale = useLocale()

  const direction = getDirection(locale)

  return (
    <Link href="/cart" className="px-1 header-button">
      <div className="flex items-end text-xs relative">
        <ShoppingCartIcon className="h-8 w-8" />

        {isMounted && (
          <span
            className={cn(
              'bg-black px-1 rounded-full text-primary text-base font-bold absolute top-[-4px] z-10',
              direction === 'rtl' ? 'right-[5px]' : 'left-[10px]',
              cartItemsCount >= 10 && 'text-sm px-0 p-[1px]'
            )}
          >
            {cartItemsCount}
          </span>
        )}

        <span className="font-bold">{t('Cart')}</span>

        {showSidebar && (
          <div
            className={cn(
              'absolute top-[20px] z-10 w-0 h-0 border-l-[7px] border-r-[7px] border-b-[8px] border-transparent border-b-background',
              direction === 'rtl'
                ? 'left-[-16px] rotate-[-270deg]'
                : 'right-[-16px] rotate-[-90deg]'
            )}
          />
        )}
      </div>
    </Link>
  )
}
