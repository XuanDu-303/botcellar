"use client";

import { Card, CardContent } from "@/components/ui/card";
import { HomeCard } from "./home-card";
import { CardItem, Data } from "@/types";
import { IProduct } from "@/lib/db/models/product.model";
import dynamic from "next/dynamic";

const HomeCarousel = dynamic(
  () => import("./home-carousel").then((m) => m.default),
  {
    ssr: false,
    loading: () => (
      <div className="h-[200px] flex items-center justify-center text-muted-foreground">
        <span className="animate-pulse">Loading products...</span>
      </div>
    ),
  }
);

const ProductSlider = dynamic(
  () =>
    import("@/components/shared/product/product-slider").then((m) => m.default),
  {
    ssr: false,
    loading: () => (
      <div className="h-[200px] flex items-center justify-center text-muted-foreground">
        <span className="animate-pulse">Loading products...</span>
      </div>
    ),
  }
);

const BrowsingHistoryList = dynamic(
  () =>
    import("@/components/shared/browsing-history-list").then((m) => m.default),
  {
    ssr: false,
    loading: () => (
      <div className="h-[200px] flex items-center justify-center text-muted-foreground">
        <span className="animate-pulse">Loading products...</span>
      </div>
    ),
  }
);

export default function HomePageClient({
  cards,
  todaysDeals,
  bestSellingProducts,
  carouselItems,
}: {
  cards: CardItem[];
  todaysDeals: IProduct[];
  bestSellingProducts: IProduct[];
  carouselItems: Data['carousels'];
}) {
  return (
    <>
      <div className="relative">
        <HomeCarousel items={carouselItems} />

        <div className="absolute inset-x-0 bottom-5 translate-y-1/2 z-10">
          <div className="md:px-4 md:space-y-4">
            <HomeCard cards={cards} />
          </div>
        </div>
      </div>

      <div className="md:p-4 md:space-y-4 bg-border">
        <Card className="w-full mt-52 rounded-none">
          <CardContent className="p-4 items-center gap-3">
            <ProductSlider title={"Today's Deals"} products={todaysDeals} />
          </CardContent>
        </Card>

        <Card className="w-full rounded-none">
          <CardContent className="p-4 items-center gap-3">
            <ProductSlider
              title="Best Selling Products"
              products={bestSellingProducts}
              hideDetails
            />
          </CardContent>
        </Card>
      </div>

      <div className="p-4 bg-background">
        <BrowsingHistoryList />
      </div>
    </>
  );
}
