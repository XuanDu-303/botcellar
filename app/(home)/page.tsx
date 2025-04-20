import { Card, CardContent} from '@/components/ui/card';
import {
  getAllCategories,
  getProductsByTag,
  getProductsForCard,
} from '@/lib/actions/product.actions'
import data from '@/lib/data'
import { toSlug } from '@/lib/utils'
import HomeCard from './_components/home-card';
import HomeCarousel from './_components/home-carousel';
import ProductSlider from '@/components/shared/product/product-slider';
import BrowsingHistoryList from '@/components/shared/browsing-history-list';


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
    <>
      <div className="relative">
        <HomeCarousel items={data.carousels} />

        <div className="absolute inset-x-0 bottom-5 translate-y-1/2 z-10">
          <div className="md:px-4 md:space-y-4">
            <HomeCard cards={cards} />
          </div>
        </div>
      </div>

      <div className="md:p-4 md:space-y-4 bg-border">
        <Card className="w-full mt-52 rounded-none">
          <CardContent className="p-4 items-center gap-3">
            <ProductSlider title={"Today's Deals"} products={todaysDeals} />
          </CardContent>
        </Card>

        <Card className="w-full rounded-none">
          <CardContent className="p-4 items-center gap-3">
            <ProductSlider
              title="Best Selling Products"
              products={bestSellingProducts}
              hideDetails
            />
          </CardContent>
        </Card>
      </div>

      <div className="p-4 bg-background">
        <BrowsingHistoryList />
      </div>
    </>
  )
}
