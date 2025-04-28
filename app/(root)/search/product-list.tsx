"use client";

import ProductCard from "@/components/shared/product/product-card";
import Pagination from "@/components/shared/pagination";
import { IProduct } from "@/lib/db/models/product.model";

export default function ProductList({
  productsData,
  isPending = false,
}: {
  productsData: {
    products: IProduct[];
    totalPages: number;
    totalProducts: number;
    from: number;
    to: number;
  };
  isPending?: boolean;
}) {
  return (
    <div className="md:col-span-7 py-5 space-y-4 relative">
      {/* Overlay loading */}
      {isPending && (
        <div className="absolute inset-0 flex justify-center bg-muted/60 backdrop-blur-md z-10">
          <div className="border-gray-300 mt-54 h-16 w-16 animate-spin rounded-full border-8 border-t-primary" />
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
            <p>No products found</p>
          </div>
        ) : (
          productsData.products.map((product) => (
            <ProductCard key={product._id} product={product} hideDiscount />
          ))
        )}
      </div>

      {/* Pagination */}
      {productsData.totalPages > 1 && (
        <Pagination page={productsData.from} totalPages={productsData.totalPages} />
      )}
    </div>
  );
}
