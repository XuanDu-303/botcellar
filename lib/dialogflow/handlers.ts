/* eslint-disable @typescript-eslint/no-explicit-any */
import Product, { IProduct } from "../db/models/product.model"

export async function handleProductSearch(params: any): Promise<{
  fulfillmentText: string
  products: IProduct[]
}> {
  const { product_type, brand, size, color } = params

  const query: any = {}

  if (product_type) query.category = product_type

  if (Array.isArray(brand) && brand.length > 0) {
    query.brand = { $in: brand }
  } else if (typeof brand === "string" && brand.trim() !== "") {
    query.brand = brand
  }

  if (size) query.sizes = size
  if (color) query.colors = { $in: [color] }

  const products = await Product.find(query).limit(5).lean()

  if (!products.length) {
    return {
      fulfillmentText: `Sorry, we couldn't find any ${brand || ""} ${product_type || "products"}${size ? ` in size ${size}` : ""}${color ? ` in color ${color}` : ""}.`,
      products: [],
    }
  }

  const summary = `Here are ${products.length} great options for ${brand || ""} ${product_type || "products"}${size ? ` in size ${size}` : ""}${color ? ` in color ${color}` : ""}:`

  // Only return minimal fields for frontend
  const result = products.map((p) => ({
    name: p.name,
    image: p.images?.[0],
  }))
  console.log(result)

  return { fulfillmentText: summary, products: products }
}
