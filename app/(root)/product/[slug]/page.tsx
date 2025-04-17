import { Card, CardContent } from "@/components/ui/card"
import {
  getProductBySlug,
  getRelatedProductsByCategory,
} from "@/lib/actions/product.actions"

import SelectVariant from "@/components/shared/product/select-variant"
import ProductPrice from "@/components/shared/product/product-price"
import ProductGallery from "@/components/shared/product/product-gallery"
import { Separator } from "@/components/ui/separator"
import ProductSlider from "@/components/shared/product/product-slider"
import Rating from "@/components/shared/product/rating"
import BrowsingHistoryList from "@/components/shared/browsing-history-list"
import AddToBrowsingHistory from "@/components/shared/product/add-to-browsing-history"
import AddToCart from "@/components/shared/product/add-to-cart"
import { generateId, round2 } from "@/lib/utils"

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug)
  return {
    title: product?.name || "Product not found",
    description: product?.description || "",
  }
}

export default async function ProductDetails({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { page?: string; color?: string; size?: string }
}) {
  const { slug } = params
  const { page = "1", color, size } = searchParams

  const product = await getProductBySlug(slug)
  if (!product) return <div className="text-center mt-10">Product not found.</div>

  const selectedSize = size || product.sizes?.[0]
  const selectedColor = color || product.colors?.[0]

  const relatedProducts = await getRelatedProductsByCategory({
    category: product.category,
    productId: product._id,
    page: Number(page),
  })

  return (
    <div>
      <AddToBrowsingHistory product={product} />

      <section className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="col-span-2">
          <ProductGallery images={product.images} />
        </div>

        <div className="col-span-2 flex flex-col gap-4 md:p-5">
          <p className="p-medium-16 rounded-full bg-grey-500/10 text-grey-500">
            Brand {product.brand} · {product.category}
          </p>

          <h1 className="font-bold text-lg lg:text-xl">{product.name}</h1>

          <div className="flex items-center gap-2">
            <span>{product.avgRating.toFixed(1)}</span>
            <Rating rating={product.avgRating} />
            <span>{product.numReviews} ratings</span>
          </div>

          <Separator />

          <ProductPrice
            price={product.price}
            listPrice={product.listPrice}
            isDeal={product.tags.includes("todays-deal")}
            forListing={false}
          />

          <SelectVariant
            product={product}
            size={selectedSize}
            color={selectedColor}
          />

          <Separator className="my-2" />

          <div className="flex flex-col gap-2">
            <p className="p-bold-20 text-grey-600">Description:</p>
            <p className="p-medium-16 lg:p-regular-18">{product.description}</p>
          </div>
        </div>

        <div className="col-span-1">
          <Card>
            <CardContent className="p-4 flex flex-col gap-4">
              <ProductPrice price={product.price} />

              {product.countInStock > 0 && product.countInStock <= 3 && (
                <div className="text-destructive font-bold">
                  Only {product.countInStock} left in stock - order soon
                </div>
              )}

              <div
                className={`text-xl font-semibold ${
                  product.countInStock !== 0 ? "text-green-700" : "text-destructive"
                }`}
              >
                {product.countInStock !== 0 ? "In Stock" : "Out of Stock"}
              </div>

              {product.countInStock > 0 && (
                <div className="flex justify-center items-center">
                  <AddToCart
                    item={{
                      cartItemId: generateId(),
                      product: product._id,
                      countInStock: product.countInStock,
                      name: product.name,
                      slug: product.slug,
                      category: product.category,
                      price: round2(product.price),
                      quantity: 1,
                      image: product.images[0],
                      size: selectedSize,
                      color: selectedColor,
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mt-10">
        <ProductSlider
          products={relatedProducts.data}
          title={`Best Sellers in ${product.category}`}
        />
      </section>

      <BrowsingHistoryList className="mt-10" />
    </div>
  )
}
