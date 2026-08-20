"use client";

export default function AuraBackground() {
  return (
    <div
      className="fixed z-0 w-[180vw] h-[160vh] left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 blur-[80px] opacity-50"
      style={{
        background: `radial-gradient(
          ellipse,
          var(--primary) 0%,
          color-mix(in oklch, var(--primary) 60%, transparent) 30%,
          color-mix(in oklch, var(--primary) 40%, transparent) 50%,
          color-mix(in oklch, var(--primary) 10%, transparent) 70%,
          transparent 100%
        )`,
      }}
    />
  );
}
