"use client";

import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";
import Rating from "@/components/shared/product/rating";

type RatingSummaryProps = {
  asTooltip?: boolean;
  avgRating: number;
  numReviews: number;
  ratingDistribution: {
    rating: number;
    count: number;
  }[];
};

export default function RatingSummary({
  asTooltip,
  avgRating = 0,
  numReviews = 0,
  ratingDistribution = [],
}: RatingSummaryProps) {
  const RatingDistribution = () => {
    const ratingPercentageDistribution = ratingDistribution.map((x) => ({
      ...x,
      percentage: Math.round((x.count / numReviews) * 100),
    }));

    return (
      <>
        <div className="flex flex-wrap items-center gap-1 cursor-help">
          <Rating rating={avgRating} size={5} />
          <span className="text-lg font-bold">
            {avgRating.toFixed(1)} out of 5
          </span>
        </div>
        <div className={`  ${!asTooltip ? "global text-[15px] text-gray-700" : "text-base"}`}>{numReviews}{`${!asTooltip ? " global" : ""}`} ratings</div>

        <div className="space-y-3">
          {ratingPercentageDistribution
            .sort((a, b) => b.rating - a.rating)
            .map(({ rating, percentage }) => (
              <div
                key={rating}
                className="grid grid-cols-[40px_1fr_30px] gap-2 items-center"
              >
                <div className="text-sm"> {rating} star</div>
                <Progress value={percentage} className="h-4 w-52 rounded-[4px]" />
                <div className="text-sm text-right">{percentage}%</div>
              </div>
            ))}
        </div>
      </>
    );
  };

  return asTooltip ? (
    <div className="flex items-center gap-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className="flex gap-1 [&_svg]:size-3 text-base"
            >
              <span>{avgRating.toFixed(1)}</span>
              <Rating rating={avgRating} />
              <ChevronDownIcon className="w-5 h-5 text-muted-foreground" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" align="center" className="w-auto px-4 pt-4 pb-3 bg-white border shadow-md rounded-lg">
            <div className="flex flex-col gap-2">
              <RatingDistribution />
              <Separator />
              <Link className="highlight-link text-center py-4" href="#reviews">
                See customer reviews
              </Link>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div className=" ">
        <Link href="#reviews" className="highlight-link">
          ({numReviews})
        </Link>
      </div>
    </div>
  ) : (
    <RatingDistribution />
  );
}
