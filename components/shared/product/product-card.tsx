import Image from "next/image";
import Link from "next/link";
import React from "react";

import { IProduct } from "@/lib/db/models/product.model";
import ImageHover from "./image-hover";

import Rating from "./rating";
import { formatNumber, generateId, round2 } from "@/lib/utils";
import ProductPrice from "./product-price";
import AddToCart from "./add-to-cart";
import RatingSummary from "./rating-summary";

const ProductCard = ({
  product,
  hideBorder = false,
  hideDetails = false,
  hideAddToCart = false,
  hideDiscount = false,
}: {
  product: IProduct;
  hideDetails?: boolean;
  hideBorder?: boolean;
  hideAddToCart?: boolean;
  hideDiscount?: boolean;
}) => {
  const ProductImage = () => (
    <Link href={`/product/${product.slug}`}>
      <div className="relative p-3">
        {product.images.length > 1 ? (
          <ImageHover
            src={product.images[0]}
            hoverSrc={product.images[1]}
            alt={product.name}
          />
        ) : (
          <div className="relative p-3">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="80vw"
              className="object-contain"
            />
          </div>
        )}
      </div>
    </Link>
  );
  const ProductDetails = () => (
    <div className="flex-1 space-y-2">
      <p className="font-bold">{product.brand}</p>
      <Link
        href={`/product/${product.slug}`}
        className="overflow-hidden text-ellipsis"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
        }}
      >
        {product.name}
      </Link>
      <div className="flex gap-2">
        {hideBorder ? (
          <>
            <Rating rating={product.avgRating} />
            <span>({formatNumber(product.numReviews)})</span>
          </>
        ) : (
          <RatingSummary
            avgRating={product.avgRating}
            numReviews={product.numReviews}
            asTooltip
            ratingDistribution={product.ratingDistribution}
          />
        )}
      </div>

      <ProductPrice
        isDeal={product.tags.includes("todays-deal")}
        price={product.price}
        listPrice={product.listPrice}
        forListing
        hideDiscount={hideDiscount}
      />
    </div>
  );

  const AddButton = () => (
    <div className="w-full">
      <AddToCart
        minimal
        item={{
          cartItemId: generateId(),
          product: product._id,
          size: product.sizes[0],
          color: product.colors[0],
          countInStock: product.countInStock,
          name: product.name,
          slug: product.slug,
          category: product.category,
          price: round2(product.price),
          quantity: 1,
          image: product.images[0],
        }}
      />
    </div>
  );

  return hideBorder ? (
    <div className="flex flex-col">
      <ProductImage />
      {!hideDetails && (
        <>
          <div className="p-3 flex-1">
            <ProductDetails />
          </div>
          {!hideAddToCart && <AddButton />}
        </>
      )}
    </div>
  ) : (
    <div className="flex flex-col border rounded-md py-3 shadow-lg gap-1 bg-card">
      <ProductImage />
      {!hideDetails && (
        <div className="h-full p-3 flex flex-col justify-between">
          <ProductDetails />
          <div className="pt-2">{!hideAddToCart && <AddButton />}</div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
