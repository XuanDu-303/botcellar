"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import CollapsibleOnMobile from "@/components/shared/collapsible-on-mobile";
import ProductSortSelector from "@/components/shared/product/product-sort-selector";
import ProductList from "./product-list";
import { getAllCategories, getAllTags, getAllProducts } from "@/lib/actions/product.actions";
import { getFilterUrl, toSlug } from "@/lib/utils";
import Rating from "@/components/shared/product/rating";
import { IProduct } from "@/lib/db/models/product.model";

const sortOrders = [
  { value: "price-low-to-high", name: "Price: Low to high" },
  { value: "price-high-to-low", name: "Price: High to low" },
  { value: "newest-arrivals", name: "Newest arrivals" },
  { value: "avg-customer-review", name: "Avg. customer review" },
  { value: "best-selling", name: "Best selling" },
];

const prices = [
  { name: "$1 to $20", value: "1-20" },
  { name: "$21 to $50", value: "21-50" },
  { name: "$51 to $1000", value: "51-1000" },
];

function toggleTag(currentTags: string[], tag: string) {
  const slug = toSlug(tag);
  const normalizedTags = currentTags.map(toSlug);
  if (normalizedTags.includes(slug)) {
    return normalizedTags.filter((t) => t !== slug).join(",");
  } else {
    return [...normalizedTags, slug].join(",");
  }
}

export default function SearchPageClient() {
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<string[]>([]);
  const [tagsList, setTagsList] = useState<string[]>([]);
  const [productsData, setProductsData] = useState<{
    products: IProduct[];
    totalPages: number;
    totalProducts: number;
    from: number;
    to: number;
  }>({
    products: [],
    totalPages: 1,
    totalProducts: 0,
    from: 0,
    to: 0,
  });

  const [isPending, startTransition] = useTransition();

  const params = Object.fromEntries(searchParams.entries());

  const {
    q = "all",
    category = "all",
    tags = "all",
    price = "all",
    rating = "all",
    sort = "best-selling",
    page = "1",
  } = params;

  const selectedTags = tags !== "all" ? tags.split(",") : [];

  const filters: string[] = [];
  if (q !== "all" && q !== "") filters.push(`${q}`);
  if (category !== "all" && category !== "") filters.push(`Category: ${category}`);
  if (selectedTags.length > 0) filters.push(`Tags: ${selectedTags.join(", ")}`);
  if (price !== "all") filters.push(`Price: ${price}`);
  if (rating !== "all") filters.push(`Rating: ${rating} & up`);

  useEffect(() => {
    async function fetchCategoriesAndTags() {
      const [cats, tagsArr] = await Promise.all([
        getAllCategories(),
        getAllTags(),
      ]);
  
      setCategories(cats);
      setTagsList(tagsArr);
    }
  
    fetchCategoriesAndTags();
  }, []);

  useEffect(() => {
    function fetchProducts() {
      startTransition(async () => {
        const products = await getAllProducts({
          query: q,
          category,
          tags,
          price,
          rating,
          sort,
          page: Number(page),
        });
        setProductsData(products);
      });
    }
  
    fetchProducts();
  }, [q, category, tags, price, rating, sort, page]); 

  return (
    <div>
      {/* Header */}
      <div className="pb-4 md:border-b flex-between flex-col md:flex-row">
        <div className="flex items-center flex-wrap font-semibold gap-1 text-sm text-foreground">
          {productsData.totalProducts === 0
            ? "No"
            : `${productsData.from}-${productsData.to} of ${productsData.totalProducts}`} results
          {filters.length > 0 && (
            <>
              {" for "}
              <span className="font-bold text-primary">
                &quot;{filters.join(", ")}&quot;
              </span>
            </>
          )}
        </div>

        <ProductSortSelector sortOrders={sortOrders} sort={sort} params={params} />
      </div>

      {/* Main Content */}
      <div className="my-4 grid md:grid-cols-9 text-[15px] md:gap-4">
        {/* Filters */}
        <div className="md:col-span-2">
          <CollapsibleOnMobile title="Filters">
            <div className="space-y-4">
              {/* Department */}
              <div>
                <div className="font-bold my-[2px]">Department</div>
                <ul>
                  <li>
                    <Link
                      className={`hover:text-primary ${category === "all" && "font-semibold"}`}
                      href={getFilterUrl({ category: "all", params })}
                    >
                      All
                    </Link>
                  </li>
                  {categories.map((c) => (
                    <li key={c}>
                      <Link
                        className={`hover:text-primary ${c === category && "font-semibold"}`}
                        href={getFilterUrl({ category: c, params })}
                      >
                        {c}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price */}
              <div>
                <div className="font-bold my-[2px]">Price</div>
                <ul>
                  <li>
                    <Link
                      className={`hover:text-primary ${price === "all" && "font-semibold"}`}
                      href={getFilterUrl({ price: "all", params })}
                    >
                      All
                    </Link>
                  </li>
                  {prices.map((p) => (
                    <li key={p.value}>
                      <Link
                        className={`hover:text-primary ${p.value === price && "font-semibold"}`}
                        href={getFilterUrl({ price: p.value, params })}
                      >
                        {p.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Rating */}
              <div>
                <div className="font-bold my-[2px]">Customer Review</div>
                <ul>
                  <li>
                    <Link
                      className={`hover:text-primary ${rating === "all" && "font-semibold"}`}
                      href={getFilterUrl({ rating: "all", params })}
                    >
                      All
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={`hover:text-primary ${rating === "4" && "font-semibold"}`}
                      href={getFilterUrl({ rating: "4", params })}
                    >
                      <div className="flex items-center gap-1">
                        <Rating size={4} rating={4} />
                        <span className="text-xs">& Up</span>
                      </div>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Tags */}
              <div>
                <div className="flex justify-between items-center font-bold my-[2px]">
                  Tags
                  {selectedTags.length > 0 && (
                    <Link
                      href={getFilterUrl({ params, tags: "all" })}
                      className="text-xs text-primary hover:underline"
                    >
                      Clear All
                    </Link>
                  )}
                </div>
                <ul className="space-y-1">
                  {tagsList.map((t) => {
                    const slug = toSlug(t);
                    const isChecked = selectedTags.includes(slug);
                    return (
                      <li key={t}>
                        <Link
                          href={getFilterUrl({ params, tags: toggleTag(selectedTags, t) })}
                          className="group flex items-center gap-2 hover:text-primary"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            readOnly
                            className="size-4 accent-primary rounded-md group-hover:border-primary transition"
                          />
                          <span className={`${isChecked ? "font-semibold" : ""}`}>
                            {t}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </CollapsibleOnMobile>
        </div>

        {/* Product List */}
        <ProductList productsData={productsData} isPending={isPending} />
      </div>
    </div>
  );
}
