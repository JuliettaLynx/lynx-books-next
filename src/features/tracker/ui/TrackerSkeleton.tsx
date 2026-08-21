import { Skeleton } from "@/components/ui/skeleton";

export function TrackerSkeleton() {
  return (
    <>
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-20" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-24" />
          <div className="flex items-center gap-1">
            <Skeleton className="size-8" />
            <Skeleton className="size-8" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-3 items-stretch">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-29 flex-1 min-w-37.5" />
          <Skeleton className="h-29 flex-1 min-w-37.5" />
        </div>
      </div>

      <div className="flex justify-end">
        <Skeleton className="h-8 w-full sm:w-44" />
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="text-center py-1">
            <Skeleton className="h-4 w-6 mx-auto" />
          </div>
        ))}
        {Array.from({ length: 42 }).map((_, i) => (
          <Skeleton
            key={i}
            className="aspect-1/2 sm:aspect-2/1 w-full rounded-lg"
          />
        ))}
      </div>
    </>
  );
}
