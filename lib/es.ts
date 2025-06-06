import 'dotenv/config'
import { Client } from '@elastic/elasticsearch'

console.log(process.env.ELASTICSEARCH_NODE)

export const esClient = new Client({
  node: process.env.ELASTICSEARCH_NODE!,
  auth: {
    apiKey: process.env.ELASTICSEARCH_API_KEY!,
  },
})

export default esClient