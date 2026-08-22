import { Hint } from "@/components/Hint";

export function StatsGroup({
  title,
  items,
}: {
  title: string;
  items: { label: string; value: string | number; hint?: string }[];
}) {
  return (
    <div className="flex-1 min-w-37.5 bg-secondary/20 -bg-linear-20 from-background/20 from-30% to-primary/10 p-3 rounded-lg text-center">
      <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
        {title}
      </div>
      <div className="space-y-1 text-sm">
        {items.map((item, idx) => (
          <div key={idx} className="flex justify-between gap-4">
            <span className="text-muted-foreground flex items-center gap-1">
              {item.label}
              {item.hint && <Hint text={item.hint} side="top" align="center" />}
            </span>
            <span className="font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
