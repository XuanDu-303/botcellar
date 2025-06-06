/* eslint-disable @typescript-eslint/no-explicit-any */
import { esClient } from '@/lib/es'
import { getAllPublishedProducts } from '@/lib/actions/product.actions'
import { initElasticsearchIndex } from '@/lib/elastic/initIndex'
import { connectToDatabase } from '@/lib/db'

async function indexAllProducts() {
  await connectToDatabase()
  await initElasticsearchIndex()
  const products = await getAllPublishedProducts()

  console.log(`🔄 Indexing ${products.length} published products to Elasticsearch via bulk()`)

  const bulkResponse = await esClient.helpers.bulk({
    index: 'products',
    datasource: products.map(({ _id, ...rest }) => ({ id: _id.toString(), ...rest })),
    onDocument(doc: any) {
      return {
        index: { _id: doc.id },
      }
    },
    onDrop(...args: any[]) {
      const [doc, error, operation, statusCode] = args
      console.error('Drop:', { doc, error, operation, statusCode })
    }
  })

  console.log('Bulk index completed:', {
    successful: bulkResponse.successful,
    failed: bulkResponse.failed,
    total: products.length,
  })

  await esClient.indices.refresh({ index: 'products' })
}

indexAllProducts().catch((err) => {
  console.error('Bulk indexing failed:', err)
})
