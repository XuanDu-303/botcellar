import { getProductsByTag } from '@/lib/actions/product.actions'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const tag = searchParams.get('tag')
  const limit = parseInt(searchParams.get('limit') || '10', 10)

  if (!tag) return new Response('Missing tag parameter', { status: 400 })

  try {
    const products = await getProductsByTag({ tag, limit })
    return Response.json(products)
  } catch {
    return new Response('Failed to fetch products by tag', { status: 500 })
  }
}