"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Library,
  BookOpen,
  Heart,
  Users,
  NotebookPen,
  Send,
} from "lucide-react";
import { useState } from "react";
import { Tooltip } from "@/components/ui/Tooltip";

const navItems = [
  {
    href: "/library",
    label: "Библиотека",
    icon: Library,
    tooltip: "Библиотека",
  },
  {
    href: "/tracker",
    label: "Трекер",
    icon: BookOpen,
    tooltip: "Трекер",
  },
  {
    href: "/wishlist",
    label: "Вишлист",
    icon: Heart,
    tooltip: "Вишлист",
  },
  {
    href: "/community",
    label: "Сообщество",
    icon: Users,
    tooltip: "Сообщество",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <aside
        className={
          "fixed inset-y-0 left-0 z-50 w-16 dark:bg-bg-secondary shadow-2xl border-r border-border hidden lg:flex flex-col justify-content items-center py-4 gap-1"
        }
      >
        {/* Логотип */}
        <div className="p-1.5 flex items-center gap-3">
          <img src="/logo.svg" alt="LynxBooks" className="w-12 h-12" />
        </div>

        {/* Навигация */}
        <nav className="flex-1 flex flex-col justify-center items-center p-2.5 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Tooltip key={item.href} content={item.tooltip}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={` w-11 flex items-center gap-3 p-2 rounded-lg transition-colors ${
                    isActive ? "text-accent" : "text-text hover:bg-border/40"
                  }`}
                >
                  <item.icon className="w-7 h-7" />
                </Link>
              </Tooltip>
            );
          })}
        </nav>

        {/* Кнопки внизу */}
        <div className="p-4 space-y-2">
          <Tooltip content="Написать в Telegram">
            <a
              href="https://t.me/julietta_lynx"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-2 rounded-lg text-text hover:bg-border/40 hover:text-accent transition-colors"
            >
              <Send className="w-7 h-7" />
            </a>
          </Tooltip>
          <Tooltip content="Предложить книгу">
            <a
              href="https://forms.gle/Ff2xgHXGYgEjbT858"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-2 rounded-lg text-text hover:bg-border/40 hover:text-accent transition-colors"
            >
              <NotebookPen className="w-7 h-7" />
            </a>
          </Tooltip>
        </div>
      </aside>
    </>
  );
}
