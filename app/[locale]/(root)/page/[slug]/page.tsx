import ReactMarkdown from 'react-markdown'
import { notFound } from 'next/navigation'
import { getWebPageBySlug } from '@/lib/actions/web-page.actions'

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params

  const { slug } = params

  const webPage = await getWebPageBySlug(slug)
  if (!webPage) {
    return { title: 'Web page not found' }
  }
  return {
    title: webPage.title,
  }
}

export default async function ProductDetailsPage(props: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page: string; color: string; size: string }>
}) {
  const params = await props.params
  const { slug } = params
  const webPage = await getWebPageBySlug(slug)

  if (!webPage) notFound()

  return (
    <div className='px-4 sm:px-6 md:px-8 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-bold mb-6 text-center'>{webPage.title}</h1>
      <section className='prose prose-lg dark:prose-invert max-w-none web-page-content'>
        <ReactMarkdown>{webPage.content}</ReactMarkdown>
      </section>
    </div>
  )
}