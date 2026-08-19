import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonFilterBar() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-10 w-full rounded-lg" />

      <div className="flex gap-3 items-center">
        <Skeleton className="h-8 w-16 rounded-lg hidden sm:inline-flex" />
        <Skeleton className="h-8 w-20 rounded-lg" />
        <Skeleton className="h-8 flex-1 rounded-lg" />
      </div>

      <div className="flex flex-col lg:flex-row gap-3">
        <div className="flex flex-wrap gap-2 flex-1">
          <Skeleton className="h-8 flex-1 min-w-36 rounded-lg" />
          <Skeleton className="h-8 flex-1 min-w-36 rounded-lg" />
          <Skeleton className="h-8 flex-1 min-w-36 rounded-lg" />
        </div>

        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <div className="flex flex-row gap-2 flex-1">
            <Skeleton className="h-8 flex-1 min-w-24 rounded-lg" />
            <Skeleton className="h-8 flex-1 min-w-24 rounded-lg" />
          </div>
          <div className="flex flex-row gap-2 items-center justify-end sm:justify-start lg:justify-end">
            <Skeleton className="h-8 w-full rounded-lg sm:hidden" />{" "}
            <Skeleton className="h-8 w-28 rounded-lg" />{" "}
          </div>
        </div>
      </div>
    </div>
  );
}
