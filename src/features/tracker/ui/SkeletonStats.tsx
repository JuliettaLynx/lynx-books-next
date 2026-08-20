import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonStats() {
  return (
    <div className="space-y-4">

      <div className="flex flex-wrap gap-3 items-stretch">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-24 flex-1 min-w-37.5" />
        <Skeleton className="h-24 flex-1 min-w-37.5" />
      </div>
    </div>
  );
}
