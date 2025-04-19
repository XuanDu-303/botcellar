import HomePageClient from './_components/home-page-client'
import {
  getAllCategories,
  getProductsByTag,
  getProductsForCard,
} from '@/lib/actions/product.actions'
import data from '@/lib/data'
import { toSlug } from '@/lib/utils'

export default async function HomePage() {
  const categories = (await getAllCategories()).slice(0, 4)

  const newArrivals = await getProductsForCard({ tag: 'new-arrival', limit: 4 })
  const featureds = await getProductsForCard({ tag: 'featured', limit: 4 })
  const bestSellers = await getProductsForCard({ tag: 'best-seller', limit: 4 })

  const cards = [
    {
      title: 'Categories to explore',
      link: {
        text: 'See More',
        href: '/search',
      },
      items: categories.map((category) => ({
        name: category,
        image: `/images/${toSlug(category)}.jpg`,
        href: `/search?category=${category}`,
      })),
    },
    {
      title: 'Explore New Arrivals',
      items: newArrivals,
      link: {
        text: 'View All',
        href: '/search?tag=new-arrival',
      },
    },
    {
      title: 'Discover Best Sellers',
      items: bestSellers,
      link: {
        text: 'View All',
        href: '/search?tag=best-seller',
      },
    },
    {
      title: 'Featured Products',
      items: featureds,
      link: {
        text: 'Shop Now',
        href: '/search?tag=featured',
      },
    },
  ]

  const todaysDeals = await getProductsByTag({ tag: 'todays-deal' })
  const bestSellingProducts = await getProductsByTag({ tag: 'best-seller' })

  return (
    <HomePageClient
      cards={cards}
      todaysDeals={todaysDeals}
      bestSellingProducts={bestSellingProducts}
      carouselItems={data.carousels}
    />
  )
}
