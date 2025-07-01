'use client'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

import { formUrlQuery } from '@/lib/utils'

import { Button } from '../ui/button'
import { useTranslations } from 'next-intl'

type PaginationProps = {
  page: number | string
  totalPages: number
  urlParamName?: string
}

const Pagination = ({ page, totalPages, urlParamName }: PaginationProps) => {
  const t = useTranslations('Search')
  const router = useRouter()
  const searchParams = useSearchParams()

  const onClick = (btnType: string) => {
    const pageValue = btnType === 'next' ? Number(page) + 1 : Number(page) - 1

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: urlParamName || 'page',
      value: pageValue.toString(),
    })

    router.push(newUrl, { scroll: true })
  }
  return (
    <div className='flex justify-center items-center gap-2 pt-2 text-sm text-muted-foreground'>
      <Button
        size='lg'
        variant='outline'
        className='flex justify-start items-center w-28 cursor-pointer'
        onClick={() => onClick('prev')}
        disabled={Number(page) <= 1}
      >
        <ChevronLeft className="h-4 w-4" /> {t('Previous')}
      </Button>
      <Button
        size='lg'
        variant='outline'
        className='flex justify-center w-28 items-center cursor-pointer'
        onClick={() => onClick('next')}
        disabled={Number(page) >= totalPages}
      >
        {t('Next')} <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default Pagination