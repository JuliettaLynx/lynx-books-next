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

      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-muted-foreground py-1"
          >
            {day}
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
