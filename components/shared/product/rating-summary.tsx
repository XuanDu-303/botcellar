"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDownIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from 'next-intl'

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
  const t = useTranslations("Product")
  const [animatedPercentages, setAnimatedPercentages] = useState<number[]>([]);

  useEffect(() => {
    if (!loading && ratingDistribution.length > 0 && numReviews > 0) {
      setAnimatedPercentages(new Array(ratingDistribution.length).fill(0))
      const percentages = ratingDistribution.map((x) =>
        Math.round((x.count / numReviews) * 100)
      )
      const timeout = setTimeout(() => {
        setAnimatedPercentages(percentages)
      }, 100)
  
      return () => clearTimeout(timeout)
    }
  }, [loading, ratingDistribution, numReviews])

  const RatingDistribution = () => (
    <div className={`flex flex-col gap-2 ${asTooltip ? "min-w-72" : ""}`}>
      <div className="flex flex-wrap items-center gap-1 cursor-help text-foreground">
        <Rating rating={avgRating} size={5} />
        <span className="text-lg font-bold">
          {t('avgRating out of 5', {
            avgRating: avgRating.toFixed(1),
          })}
        </span>
      </div>
      <div
        className={`${!asTooltip ? "text-[15px] text-muted-foreground" : "text-base"}`}
      >
        {t("numReviews ratings", {
          numReviews,
          scope: !asTooltip ? t("global") : ""
        })}
      </div>
      <div className="space-y-3">
        {ratingDistribution
          .sort((a, b) => b.rating - a.rating)
          .map(({ rating }, index) => {
            const percentage = animatedPercentages[index] || 0;
            return (
              <div key={rating} className="flex gap-2 items-center">
                <div className="text-sm whitespace-nowrap">{t('rating star', { rating })}</div>
                <Progress
                  value={percentage}
                  className="h-4 rounded-[4px] transition-[width] ease-in-out"
                  style={{ transitionDuration: '1s' }}
                />
                <div className="text-sm text-right whitespace-nowrap min-w-8">
                  {percentage}%
                </div>
              </div>
            );
          })}
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
                    {t('See customer reviews')}
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