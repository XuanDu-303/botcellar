'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronUp } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { i18n } from '@/i18n-config'

import useSettingStore from '@/hooks/use-setting-store'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function Footer() {
  const t = useTranslations('Footer')
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()

  const {
    setting: { site, availableCurrencies, currency },
    setCurrency,
  } = useSettingStore()

  const { locales } = i18n

  return (
    <footer className="bg-black text-white underline-link mt-8">
      {/* Back to top */}
      <div className="w-full">
        <Button
          variant="ghost"
          className="bg-gray-800 w-full cursor-pointer rounded-none"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ChevronUp className="mr-2" />
          {t('Back to top')}
        </Button>
      </div>

      {/* Main Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 max-w-7xl mx-auto">
        {/* Get to Know Us */}
        <div>
          <h3 className="font-bold mb-2">{t('Get to Know Us')}</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/page/careers">{t('Careers')}</Link>
            </li>
            <li>
              <Link href="/page/blog">{t('Blog')}</Link>
            </li>
            <li>
              <Link href="/page/about-us">
                {t('About name', { name: site.name })}
              </Link>
            </li>
          </ul>
        </div>

        {/* Make Money with Us */}
        <div>
          <h3 className="font-bold mb-2">{t('Make Money with Us')}</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/page/sell">
                {t('Sell products on', { name: site.name })}
              </Link>
            </li>
            <li>
              <Link href="/page/become-affiliate">{t('Become an Affiliate')}</Link>
            </li>
            <li>
              <Link href="/page/advertise">{t('Advertise Your Products')}</Link>
            </li>
          </ul>
        </div>

        {/* Let Us Help You */}
        <div>
          <h3 className="font-bold mb-2">{t('Let Us Help You')}</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/page/shipping">{t('Shipping Rates & Policies')}</Link>
            </li>
            <li>
              <Link href="/page/returns-policy">{t('Returns & Replacements')}</Link>
            </li>
            <li>
              <Link href="/page/help">{t('Help')}</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Language, Currency, Logo */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto py-8 px-4 flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-4 flex-wrap md:flex-nowrap justify-center">
            <Image
              src="/icons/logo.svg"
              alt={`${site.name} logo`}
              width={48}
              height={48}
              className="w-14"
            />

            {/* Language Selector */}
            <Select
              value={locale}
              onValueChange={(value) => {
                router.push(pathname, { locale: value })
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('Select a language')} />
              </SelectTrigger>
              <SelectContent>
                {locales.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <span className="flex items-center gap-2">
                      <span className="text-lg">{lang.icon}</span> {lang.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Currency Selector */}
            <Select
              value={currency}
              onValueChange={(value) => {
                setCurrency(value)
                window.scrollTo(0, 0)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('Select a currency')} />
              </SelectTrigger>
              <SelectContent>
                {availableCurrencies.map((curr) => (
                  <SelectItem key={curr.code} value={curr.code}>
                    {curr.name} ({curr.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Bottom Links */}
      <div className="border-t border-gray-800 py-4">
        <div className="flex justify-center gap-3 text-sm flex-wrap">
          <Link href="/page/conditions-of-use">{t('Conditions of Use')}</Link>
          <Link href="/page/privacy-policy">{t('Privacy Notice')}</Link>
          <Link href="/page/help">{t('Help')}</Link>
        </div>
        <div className="flex justify-center text-sm mt-2">
          <p>© {site.copyright}</p>
        </div>
        <div className="mt-2 flex justify-center text-xs text-gray-400 text-center px-4">
          {site.address} | {site.phone}
        </div>
      </div>
    </footer>
  )
}