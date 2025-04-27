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
    <div className="md:col-span-7 space-y-4 relative">
      {/* Overlay loading */}
      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm z-10">
          <div className="border-gray-300 h-16 w-16 animate-spin rounded-full border-8 border-t-blue-600" />
        </div>
      )}

      {/* Products */}
      <div
        className={`grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 transition-opacity ${
          isPending ? "pointer-events-none opacity-50" : "opacity-100"
        }`}
      >
        {productsData.products.length === 0 ? (
          <div className="col-span-full flex justify-center items-center flex-col py-10 text-muted-foreground">
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
