"use client";

import { User, Settings, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { SettingsModal } from "@/components/settings/SettingsModal";

const pageTitles: Record<string, string> = {
  "/library": "Библиотека",
  "/tracker": "Трекер",
  "/wishlist": "Вишлист",
  "/community": "Сообщество",
};

export function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const pageTitle = pageTitles[pathname] || "LynxBooks";

  const openSettings = () => {
    const params = new URLSearchParams();
    params.set("settings", "open");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/auth" });
  };

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-border bg-bg-secondary shadow-[0_6px_16px_6px_rgba(0,0,0,0.4)] transition-colors duration-200">
        <div className="px-3 lg:px-6 py-2">
          {/* Название страницы */}
          <h1 className="absolute px-2 pt-1 text-2xl font-bold text-white">
            {pageTitle}
          </h1>

          {/* Профиль */}
          <div className="flex justify-end items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
                {session?.user?.name || "Пользователь"}
              </span>
              <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center overflow-hidden">
                {session?.user?.avatar ? (
                  <img
                    src={session.user.avatar}
                    alt={session.user.name || "Аватар"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-7 h-7 text-accent" />
                )}
              </div>
            </div>
            <button
              onClick={openSettings}
              className="p-2 rounded-lg hover:bg-border/40 transition-colors"
              title="Настройки"
            >
              <Settings className="w-6 h-6 text-text hover:text-accent" />
            </button>
          </div>
        </div>
      </header>

      {/* Модальное окно настроек */}
      <SettingsModal />
    </>
  );
}
