import StarsBackground from "@/components/background/StarsBackground";
import AuraBackground from "@/components/background/AuraBackground";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center p-4 overflow-hidden">
      <AuraBackground />
      <StarsBackground />

      <div className="relative z-30 rounded-2xl p-6 w-full max-w-sm bg-background/40 -bg-linear-20 from-background/20 from-30% via-chart-3/10 via-70% to-primary/20 shadow-[4px_8px_24px_rgba(0,0,0,0.3)]">
        <div className="text-center">
          <h1 className="text-7xl font-bold text-primary mb-2">404</h1>
          <p className="text-muted-foreground text-sm mb-6">
            Страница не найдена
          </p>
          <Link
            href="/library"
            className="inline-block px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Вернуться к библиотеке
          </Link>
        </div>
      </div>
    </div>
  );
}
