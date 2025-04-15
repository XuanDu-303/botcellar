import { getProductsForCard } from '@/lib/actions/product.actions'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const tag = searchParams.get('tag')
  const limit = parseInt(searchParams.get('limit') || '4', 10)

  if (!tag) return new Response('Missing tag parameter', { status: 400 })

  try {
    const products = await getProductsForCard({ tag, limit })
    return Response.json(products)
  } catch {
    return new Response('Failed to fetch products for card', { status: 500 })
  }
}


