'use client'

import { Skeleton } from "@/components/ui/skeleton"

export default function RatingSummarySkeleton() {
  return (
    <div className="space-y-4">
      {/* Skeleton for average rating + stars */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-24" />
      </div>

      {/* Skeleton for numReviews */}
      <Skeleton className="h-4 w-20" />

      {/* Skeleton bars for each rating level */}
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-[40px_1fr_30px] gap-2 items-center"
          >
            <Skeleton className="h-4 w-10" /> {/* star label */}
            <Skeleton className="h-4 w-52 rounded-[4px]" /> {/* bar */}
            <Skeleton className="h-4 w-6" /> {/* percentage */}
          </div>
        ))}
      </div>
    </div>
  )
}
