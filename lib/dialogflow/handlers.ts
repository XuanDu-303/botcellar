/* eslint-disable @typescript-eslint/no-explicit-any */
import Product, { IProduct } from "../db/models/product.model"

function resolvePrice(params: any): number | undefined {
  if (params.price) return params.price
  if (params.amount && params.unit_price) {
    return params.amount * params.unit_price
  }
  return undefined
}

export async function handleProductSearch(params: any): Promise<{
  fulfillmentText: string
  products: IProduct[]
}> {
  const { product_type, brand, size, size_number, color, min_price, max_price, price_op } = params

  const price = resolvePrice(params)
  console.log("params", params)
  console.log("price", price)
  const query: any = {}

  if (product_type) query.category = product_type

  if (Array.isArray(brand) && brand.length > 0) {
    query.brand = { $in: brand }
  } else if (typeof brand === "string" && brand.trim() !== "") {
    query.brand = brand
  }

  const resolvedSize = size || size_number
  if (resolvedSize) query.sizes = resolvedSize
  if (color) query.colors = { $in: [color] }

  if (min_price && max_price) {
    query.price = {
      $gte: min_price,
      $lte: max_price
    }
  } else if (price && price_op === 'lt') {
    query.price = { $lt: price }
  } else if (price && price_op === 'gt') {
    query.price = { $gt: price }
  }

  const products = await Product.find(query).limit(5).lean()

  if (!products.length) {
    return {
      fulfillmentText: `Không tìm thấy sản phẩm phù hợp với tiêu chí bạn đưa ra.`,
      products: [],
    }
  }

  const queryDescription = [
    brand && `thương hiệu ${brand}`,
    product_type && `loại ${product_type}`,
    size || size_number && `kích cỡ ${size}`,
    color && `màu ${color}`,
    min_price && max_price && `giá từ ${min_price} đến ${max_price}`,
    price && price_op === "lt" && `giá dưới ${price}`,
    price && price_op === "gt" && `giá trên ${price}`,
  ]
    .filter(Boolean)
    .join(", ")

  const variations = [
    `Dưới đây là ${products.length} sản phẩm phù hợp${queryDescription ? ` với ${queryDescription}` : ""}:`,
    `${products.length} sản phẩm khớp với yêu cầu của bạn${queryDescription ? `: ${queryDescription}` : ""}.`,
    `Chúng tôi đã tìm thấy ${products.length} lựa chọn${queryDescription ? ` (${queryDescription})` : ""}.`,
    `Có ${products.length} sản phẩm phù hợp với tiêu chí bạn đưa ra.`,
    `Đây là những gợi ý dành cho bạn${queryDescription ? ` (${queryDescription})` : ""}:`,
  ]

  const summary = variations[Math.floor(Math.random() * variations.length)]

  return { fulfillmentText: summary, products: products }
}
