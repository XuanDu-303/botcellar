import { usePathname } from 'next/navigation'
import useDeviceType from './use-device-type'
import useCartStore from './use-cart-store'
import { i18n } from '@/i18n-config'

const localesRegex = i18n.locales.map((l) => l.code).join('|')

const isNotInPaths = (s: string) =>
  !new RegExp(`^/$|^/cart$|^/checkout(/.*)?$|^/sign-in(/.*)?$|^/sign-up(/.*)?$|^/forgot-password(/.*)?$|^/reset-password(/.*)?$|^/order(/.*)?$|^/account(/.*)?$|^/admin(/.*)?$|^/page(/.*)?$|^/(${localesRegex})(/.*)?$`).test(s)

function useCartSidebar() {
  const {
    cart: { items },
  } = useCartStore()
  const deviceType = useDeviceType()
  const currentPath = usePathname()

  return (
    items.length > 0 && deviceType === 'desktop' && isNotInPaths(currentPath)
  )
}

export default useCartSidebar