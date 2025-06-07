/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { SearchIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type Props = {
  categories: string[]
}

type SearchResult = {
  id: string
  name: string
  slug: string
  images: string[]
}

export default function SearchClient({ categories }: Props) {
  const [isFocused, setIsFocused] = useState(false)
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const params = new URLSearchParams(formData as any)
    router.push(`/search?${params.toString()}`)
    
    setQuery('')
    setResults([])
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)

    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!value) {
      setResults([])
      return
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(value)}`)
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setResults(data)
      } catch (err) {
        console.error('Search error:', err)
        setResults([])
      }
    }, 500)
  }
  console.log('Search results:', results)
  return (
    <form
      onSubmit={handleSubmit}
      className="group relative flex items-stretch bg-muted/50 overflow-visible rounded-md transition focus-within:ring-2 focus-within:ring-primary/50 focus-within:outline-none"
    >
      {/* Category select */}
      <Select name="category">
        <SelectTrigger className="w-auto min-h-[38px] rounded-none rounded-l-md !bg-muted/90 text-foreground focus:outline-none focus:ring-0 border border-r-0 border-muted-foreground group-focus-within:border-y-primary group-focus-within:border-l-primary">
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent position="popper" className="bg-popover text-foreground border border-border shadow-md">
          <SelectItem value="all">All</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Search input */}
      <div className="flex-1 relative">
        <Input
          name="q"
          type="search"
          value={query}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)} // delay để kịp click link
          placeholder="Search products"
          autoComplete="off"
          className="w-full min-h-[38px] bg-muted text-foreground text-base rounded-none border border-x-0 border-muted-foreground focus:!outline-none focus:!ring-0 focus:border-x-transparent group-focus-within:!border-y-primary shadow-none appearance-none"
        />

        {/* Results dropdown */}
        {isFocused && results.length > 0 && (
          <ul className="absolute top-full left-0 right-[-44px] z-30 bg-popover border border-border mt-1 rounded-md shadow-md max-h-120 overflow-y-auto text-sm">
            {results.map((product) => (
              <li key={product.id}>
                <Link
                  href={`/product/${product.slug}`}
                  className="flex items-center gap-2 px-3 py-1 hover:bg-accent"
                >
                  <div className="relative w-8 h-8 flex-shrink-0">
                    <Image
                      src={product?.images?.[0] || '/placeholder.svg'}
                      alt={product.name}
                      fill
                      className="object-cover rounded"
                      unoptimized
                    />
                  </div>
                  <span className="truncate text-foreground">{product.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Submit button */}
      <button
        type="submit"
        className="bg-primary text-primary-foreground flex items-center justify-center px-[10px] rounded-r-md hover:bg-primary/90 transition-colors cursor-pointer"
      >
        <SearchIcon className="size-6" />
      </button>
    </form>
  )
}
