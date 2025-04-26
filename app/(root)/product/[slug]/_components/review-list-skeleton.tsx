import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import {  Calendar } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function ReviewListSkeleton() {
  return (
    <div className="md:col-span-3 flex flex-col gap-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Skeleton className="h-[22px] w-[22px] text-muted-foreground" />
                <Skeleton className="h-4 w-24 rounded" />
              </div>
              <div className="italic text-sm flex items-center gap-1">
                <Skeleton className="h-4 w-30" />
              </div>
            </div>

            <CardTitle className="flex items-center gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </CardTitle>

            <CardDescription className="flex items-center gap-1">
              Reviewed on <Calendar className="h-3 w-3" />
              <Skeleton className="h-3 w-20" />
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-5/6 mb-1" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      ))}
      <Separator className="my-4" />
    </div>
  )
}
