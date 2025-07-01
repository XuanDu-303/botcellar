import CartButton from './cart-button'
import UserButton from './user-button'
import ThemeSwitcher from './theme-switcher'
import LanguageSwitcher from './language-switcher'

import { EllipsisVertical } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

import { useTranslations } from 'next-intl'

const Menu = ({ forAdmin = false }: { forAdmin?: boolean }) => {
  const t = useTranslations('Header')

  return (
    <div className="flex justify-end">
      {/* Desktop */}
      <nav className="hidden md:flex gap-3 w-full items-center justify-end">
        <ThemeSwitcher />
        <LanguageSwitcher />
        <UserButton />
        {!forAdmin && <CartButton />}
      </nav>

      {/* Mobile */}
      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger className="align-middle header-button">
            <EllipsisVertical className="h-6 w-6" />
          </SheetTrigger>
          <SheetContent className="bg-black text-white items-start space-y-3">
            <SheetHeader className="w-full">
              <div className="flex items-center justify-between w-full">
                <SheetTitle>{t('Site Menu')}</SheetTitle>
                <SheetDescription />
              </div>
            </SheetHeader>
            <ThemeSwitcher />
            <LanguageSwitcher />
            <UserButton />
            {!forAdmin && <CartButton />}
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  )
}

export default Menu
