"use client";

import { User, Settings } from "lucide-react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/library": "Библиотека",
  "/tracker": "Трекер",
  "/wishlist": "Вишлист",
  "/community": "Сообщество",
};

export function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const pageTitle = pageTitles[pathname] || "LynxBooks";

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg-secondary shadow-[0_6px_16px_6px_rgba(0,0,0,0.4)] transition-colors duration-200">
      <div className="px-2 lg:px-6 py-2">
        {/* Название страницы */}
        <h1 className="absolute px-2 pt-1 text-2xl font-bold text-black dark:text-white">
          {pageTitle}
        </h1>

        {/* Профиль */}
        <div className="flex justify-end items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
              {session?.user?.name || "Пользователь"}
            </span>
            <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center">
              <User className="w-7 h-7 text-accent" />
            </div>
          </div>
          <button className="p-2 rounded-lg hover:bg-border/40 transition-colors">
            <Settings className="w-6 h-6 text-text hover:text-accent" />
          </button>
        </div>
      </div>
    </header>
  );
}
