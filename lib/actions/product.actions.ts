"use server";

import { connectToDatabase } from "@/lib/db";
import Product, { IProduct } from "@/lib/db/models/product.model";
import { PAGE_SIZE } from "../constants";

export async function getAllCategories() {
  await connectToDatabase();
  const categories = await Product.find({ isPublished: true }).distinct(
    "category"
  );
  return categories;
}

export async function getProductsForCard({
  tag,
  limit = 4,
}: {
  tag: string;
  limit?: number;
}) {
  await connectToDatabase();
  const products = await Product.aggregate([
    { $match: { tags: { $in: [tag] }, isPublished: true } },
    { $sort: { createdAt: -1 } },
    { $limit: limit },
    {
      $project: {
        name: 1,
        href: { $concat: ["/product/", "$slug"] },
        image: { $arrayElemAt: ["$images", 0] },
      },
    },
  ]);

  return JSON.parse(JSON.stringify(products)) as {
    name: string;
    href: string;
    image: string;
  }[];
}

// GET PRODUCTS BY TAG
export async function getProductsByTag({
  tag,
  limit = 10,
}: {
  tag: string;
  limit?: number;
}) {
  await connectToDatabase();
  const products = await Product.find({
    tags: { $in: [tag] },
    isPublished: true,
  })
    .sort({ createdAt: "desc" })
    .limit(limit);
  return JSON.parse(JSON.stringify(products)) as IProduct[];
}

export async function getProductBySlug(slug: string) {
  await connectToDatabase();
  const product = await Product.findOne({ slug, isPublished: true });
  if (!product) throw new Error("Product not found");
  return JSON.parse(JSON.stringify(product)) as IProduct;
}

export async function getRelatedProductsByCategory({
  category,
  productId,
  limit = PAGE_SIZE,
  page = 1,
}: {
  category: string;
  productId: string;
  limit?: number;
  page: number;
}) {
  await connectToDatabase();
  const skipAmount = (Number(page) - 1) * limit;
  const conditions = {
    isPublished: true,
    category,
    _id: { $ne: productId },
  };
  const products = await Product.find(conditions)
    .sort({ numSales: "desc" })
    .skip(skipAmount)
    .limit(limit);
  const productsCount = await Product.countDocuments(conditions);
  return {
    data: JSON.parse(JSON.stringify(products)) as IProduct[],
    totalPages: Math.ceil(productsCount / limit),
  };
}

export async function getAllProducts({
  query,
  limit,
  page,
  category,
  tags,
  price,
  rating,
  sort,
}: {
  query: string;
  category: string;
  tags: string;
  limit?: number;
  page: number;
  price?: string;
  rating?: string;
  sort?: string;
}) {
  limit = limit || PAGE_SIZE;
  await connectToDatabase();

  const queryFilter = query && query !== "all"
    ? { name: { $regex: query, $options: "i" } }
    : {};

  const categoryFilter = category && category !== "all"
    ? { category }
    : {};

  const tagsFilter = tags && tags !== "all"
    ? { tags: { $in: tags.split(",") } }
    : {};

  const ratingFilter = rating && rating !== "all"
    ? { avgRating: { $gte: Number(rating) } }
    : {};

  const priceFilter = price && price !== "all"
    ? {
        price: {
          $gte: Number(price.split("-")[0]),
          $lte: Number(price.split("-")[1]),
        },
      }
    : {};

  const order: Record<string, 1 | -1> =
    sort === "best-selling"
      ? { numSales: -1 }
      : sort === "price-low-to-high"
        ? { price: 1 }
        : sort === "price-high-to-low"
          ? { price: -1 }
          : sort === "avg-customer-review"
            ? { avgRating: -1 }
            : { _id: -1 }; // newest

  const isPublished = { isPublished: true };

  const filters = {
    ...isPublished,
    ...queryFilter,
    ...categoryFilter,
    ...tagsFilter,
    ...priceFilter,
    ...ratingFilter,
  };

  const products = await Product.find(filters)
    .sort(order)
    .skip(limit * (page - 1))
    .limit(limit)
    .lean();

  const countProducts = await Product.countDocuments(filters);

  return {
    products: JSON.parse(JSON.stringify(products)) as IProduct[],
    totalPages: Math.ceil(countProducts / limit),
    totalProducts: countProducts,
    from: limit * (page - 1) + 1,
    to: limit * (page - 1) + products.length,
  };
}


export async function getAllTags() {
  const tags = await Product.aggregate([
    { $unwind: "$tags" },
    { $group: { _id: null, uniqueTags: { $addToSet: "$tags" } } },
    { $project: { _id: 0, uniqueTags: 1 } },
  ]);
  return (
    (tags[0]?.uniqueTags
      .sort((a: string, b: string) => a.localeCompare(b))
      .map((x: string) =>
        x
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      ) as string[]) || []
  );
}
