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
      <HomeCarousel items={carouselItems} />

      <div className="md:p-4 md:space-y-4 bg-border">
        <HomeCard cards={cards} />

        <Card className="w-full rounded-none">
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
