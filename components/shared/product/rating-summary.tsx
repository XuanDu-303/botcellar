"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDownIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

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
  const [loading, setLoading] = useState(false);

  const ratingPercentageDistribution = ratingDistribution.map((x) => ({
    ...x,
    percentage: Math.round((x.count / numReviews) * 100),
  }));

  const RatingDistribution = () => (
    <div className={`flex flex-col gap-2 ${asTooltip ? 'min-w-74' : ''}`}>
      <div className="flex flex-wrap items-center gap-1 cursor-help text-foreground">
        <Rating rating={avgRating} size={5} />
        <span className="text-lg font-bold">
          {avgRating.toFixed(1)} out of 5
        </span>
      </div>
      <div
        className={`${!asTooltip ? "text-[15px] text-muted-foreground" : "text-base"}`}
      >
        {numReviews} {`${!asTooltip ? "global" : ""}`} ratings
      </div>
      <div className="space-y-3">
        {ratingPercentageDistribution
          .sort((a, b) => b.rating - a.rating)
          .map(({ rating, percentage }) => (
            <div
              key={rating}
              className="flex gap-2 items-center "
            >
              <div className="text-sm whitespace-nowrap">{rating} star</div>
              <Progress value={percentage} className="h-4 rounded-[4px]" />
              <div className="text-sm text-right whitespace-nowrap min-w-8">{percentage}%</div>
            </div>
          ))}
      </div>
    </div>
  );

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center p-6">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setLoading(true);
      setTimeout(() => setLoading(false), 500);
    } else {
      setLoading(false);
    }
  };

  return asTooltip ? (
    <div className="flex items-center gap-1">
      <TooltipProvider>
        <Tooltip onOpenChange={handleOpenChange}>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1 text-base">
              <span>{avgRating.toFixed(1)}</span>
              <Rating rating={avgRating} size={4} />
              <ChevronDownIcon className="w-5 h-5 text-muted-foreground" />
            </div>
          </TooltipTrigger>

          <TooltipContent
            side="top"
            align="center"
            className="w-auto max-w-sm p-4 text-foreground bg-popover outline shadow-lg rounded-lg"
          >
            <div className="flex flex-col gap-2">
              {loading ? <LoadingSpinner /> : <RatingDistribution />}
              {!loading && (
                <>
                  <Separator />
                  <Link
                    className="text-center py-4 no-underline highlight-link"
                    href="#reviews"
                  >
                    See customer reviews
                  </Link>
                </>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div>
        <Link href="#reviews" className="highlight-link">
          ({numReviews})
        </Link>
      </div>
    </div>
  ) : (
    <RatingDistribution />
  );
}
