import { esClient } from '@/lib/es'

export async function initElasticsearchIndex() {
  const index = 'products'
  const exists = await esClient.indices.exists({ index })

  if (!exists) {
    await esClient.indices.create({
      index,
      mappings: {
        properties: {
          name: { type: 'text' },
          slug: { type: 'keyword' },
          description: { type: 'text' },
          category: { type: 'keyword' },
          tags: { type: 'keyword' },
          brand: { type: 'keyword' },
          price: { type: 'float' },
        },
      },
    })
    console.log(`Created index '${index}'`)
  }
}
