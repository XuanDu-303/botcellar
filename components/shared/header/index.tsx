import Image from 'next/image'
import Link from 'next/link'

import Menu from './menu'
import Sidebar from './sidebar'
import Search from './search'

import { getAllCategories } from '@/lib/actions/product.actions'
import { getSetting } from '@/lib/actions/setting.actions'
import data from '@/lib/data'
import { getTranslations } from 'next-intl/server'
import { auth } from '@/lib/auth'

export default async function Header() {
  const session = await auth()
  const categories = await getAllCategories()
  const { site } = await getSetting()
  const t = await getTranslations()

  return (
    <header className="bg-black text-white">
      {/* Top bar */}
      <div className="px-2">
        <div className="flex gap-2 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex gap-1 items-center header-button font-extrabold text-2xl m-1"
            >
              <Image
                src={site.logo}
                width={40}
                height={40}
                alt={`${site.name} logo`}
              />
              {site.name}
            </Link>
          </div>

          {/* Search (desktop) */}
          <div className="hidden md:block flex-1 max-w-xl">
            <Search categories={categories} siteName={site.name}/>
          </div>

          {/* Menu */}
          <Menu />
        </div>

        {/* Search (mobile) */}
        <div className="md:hidden block py-2">
          <Search categories={categories} siteName={site.name}/>
        </div>
      </div>

      {/* Category and Menus */}
      <div className="flex md:px-3 bg-gray-800 border-y border-gray-800">
        {/* Sidebar categories */}
        <Sidebar categories={categories} session={session} />

        {/* Header menu links */}
        <div className="flex items-center text-sm text-[14px] flex-wrap gap-1 md:gap-3 !py-[10px] md:!py-0 overflow-hidden">
          {data.headerMenus.map((menu) => (
            <Link
              href={menu.href}
              key={menu.href}
              className="header-button md:!py-[10px] !py-0"
            >
              {t('Header.' + menu.name)}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}
