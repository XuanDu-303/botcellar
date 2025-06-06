import SearchClient from './search-client'
import { getAllCategories } from '@/lib/actions/product.actions'

export default async function Search() {
  const categories = await getAllCategories()

  return <SearchClient categories={categories} />
}
