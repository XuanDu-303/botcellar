import { NextRequest, NextResponse } from 'next/server'
import esClient from '@/lib/es'

type ProductHit = {
  name: string
  slug: string
  description?: string
  category?: string
  tags?: string[]
  brand?: string
}

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('q')?.trim()

  if (!query) {
    return NextResponse.json([])
  }

  try {
    const { hits } = await esClient.search<ProductHit>({
      index: 'products',
      size: 5,
      query: {
        multi_match: {
          query,
          fields: ['name^3', 'description', 'category', 'tags', 'brand'],
          fuzziness: 'AUTO',
        },
      },
    })

    const results = hits.hits.map(({ _id, _source }) => ({
      id: _id,
      ..._source,
    }))

    return NextResponse.json(results)
  } catch (error) {
    console.error('[Elasticsearch Error]', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
