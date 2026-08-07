"use client";

export default function AuraBackground() {
  return (
    <div
      className="absolute z-0 w-[180vw] h-[160vh] left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 blur-[80px] opacity-50"
      style={{
        background: `radial-gradient(
          ellipse,
          var(--primary),
          color-mix(in oklch, var(--chart-3) 80%, transparent),
          color-mix(in oklch, var(--chart-4) 60%, transparent),
          color-mix(in oklch, var(--chart-5) 20%, transparent),
          transparent 100%
        )`,
      }}
    />
  );
}
