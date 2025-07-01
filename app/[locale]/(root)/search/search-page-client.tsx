"use client";

import { useEffect, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import ProductSortSelector from "@/components/shared/product/product-sort-selector";
import Sidebar from "./siderbar";
import ProductCard from "@/components/shared/product/product-card";
import Pagination from "@/components/shared/pagination";
import { searchProducts } from "@/lib/actions/product.actions";
import { IProduct } from "@/lib/db/models/product.model";

const sortOrders = [
  { value: "price-low-to-high", nameKey: "Price: Low to high" },
  { value: "price-high-to-low", nameKey: "Price: High to low" },
  { value: "newest-arrivals", nameKey: "Newest arrivals" },
  { value: "avg-customer-review", nameKey: "Avg customer review" },
  { value: "best-selling", nameKey: "Best selling" },
];

export default function SearchPageClient() {
  const t = useTranslations("Search");
  const searchParams = useSearchParams();
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
  if (category !== "all" && category !== "") filters.push(`${t("Category")}: ${category}`);
  if (selectedTags.length > 0) filters.push(`${t("Tag")}: ${selectedTags.join(", ")}`);
  if (price !== "all") filters.push(`${t("Price")}: ${price}`);
  if (rating !== "all") filters.push(`${t("Rating")}: ${rating} ${t("& Up")}`);

  useEffect(() => {
    function fetchProducts() {
      startTransition(async () => {
        const products = await searchProducts({
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
            ? t("No products found")
            : `${productsData.from}-${productsData.to} ${t("of")} ${productsData.totalProducts}`} {t("results")}
          {filters.length > 0 && (
            <>
              {` ${t("for")} `}
              <span className="font-bold text-primary">
                &quot;{filters.join(", ")}&quot;
              </span>
            </>
          )}
        </div>

        <ProductSortSelector
          sortOrders={sortOrders.map((order) => ({
            ...order,
            name: t(order.nameKey),
          }))}
          sort={sort}
          params={params}
        />
      </div>

      {/* Main Content */}
      <div className="my-4 grid md:grid-cols-9 text-[15px] md:gap-4">
        {/* Filters */}
        <div className="md:col-span-2">
          <Sidebar />
        </div>

        {/* Product List */}
        <div className="md:col-span-7 py-5 space-y-4 relative">
          {/* Overlay loading */}
          {isPending && (
            <div className="absolute inset-0 flex justify-center bg-muted/60 backdrop-blur-md z-10">
              <div className="border-gray-300 my-54 h-16 w-16 animate-spin rounded-full border-8 border-t-primary" />
            </div>
          )}

          {/* Products */}
          <div
            className={`grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 transition-opacity ${
              isPending ? "pointer-events-none opacity-50" : "opacity-100"
            }`}
          >
            {productsData.products.length === 0 ? (
              <div className="col-span-full flex flex-col py-1 text-muted-foreground">
                <p>{t("No products found")}</p>
              </div>
            ) : (
              productsData.products.map((product) => (
                <ProductCard key={product._id} product={product} hideDiscount />
              ))
            )}
          </div>

          {/* Pagination */}
          {productsData.totalPages > 1 && (
            <Pagination
              page={productsData.from}
              totalPages={productsData.totalPages}
            />
          )}
        </div>
      </div>
    </div>
  );
}