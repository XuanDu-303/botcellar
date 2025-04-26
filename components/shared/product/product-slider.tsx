"use client";

import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ProductCard from "./product-card";
import { IProduct } from "@/lib/db/models/product.model";

export default function ProductSlider({
  title,
  products,
  hideDetails = false,
}: {
  title?: string;
  products: IProduct[];
  hideDetails?: boolean;
}) {
  return (
    <div className="w-full bg-background">
      <h2 className="h2-bold mb-5">{title}</h2>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {products.map((product) => (
            <CarouselItem
              key={product.slug}
              className={
                hideDetails
                  ? "md:basis-1/4 lg:basis-1/6"
                  : "md:basis-1/3 lg:basis-1/5"
              }
            >
              <ProductCard
                hideDetails={hideDetails}
                hideAddToCart
                hideBorder
                product={product}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="shadow-xl cursor-pointer left-0 h-12 w-12 rounded-[10px]" />
        <CarouselNext className="shadow-xl cursor-pointer right-0 h-12 w-12 rounded-[10px]" />
      </Carousel>
    </div>
  );
}
