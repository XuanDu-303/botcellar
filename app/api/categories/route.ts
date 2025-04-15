// app/api/categories/route.ts
import { getAllCategories } from '@/lib/actions/product.actions'

export async function GET() {
  try {
    const categories = await getAllCategories()
    return Response.json(categories)
  } catch {
    return new Response('Failed to fetch categories', { status: 500 })
  }
}
