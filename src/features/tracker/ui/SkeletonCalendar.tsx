import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCalendar() {
  return (
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
  );
}
