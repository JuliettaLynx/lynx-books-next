"use client";

import { usePathname } from "next/navigation";
import NavItem from "./NavItem";
import {
  Library,
  ChartBarDecreasing,
  Heart,
  Users,
  MessageSquareMore,
  User,
} from "lucide-react";

const mainNavItems = [
  { href: "/library", label: "Библиотека", icon: Library },
  { href: "/tracker", label: "Трекер", icon: ChartBarDecreasing },
  { href: "/wishlist", label: "Вишлист", icon: Heart },
  { href: "/community", label: "Подписки", icon: Users },
];

const bottomItems = [
  {
    href: "https://forms.gle/Ff2xgHXGYgEjbT858",
    label: "Связаться",
    icon: MessageSquareMore,
    external: true,
  },
  { href: "/profile", label: "Профиль", icon: User, external: false },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50 w-16
        bg-secondary bg-linear-to-tr from-background/60 to-secondary
        shadow-2xl border-r border-border
        hidden lg:flex lg:flex-col items-center py-1 gap-1 
      `}
    >
      <div className="p-1.5 flex items-center gap-3">
        <img src="/logo.svg" alt="LynxBooks" className="w-14" />
      </div>

      <nav className="flex-1 flex flex-col justify-center items-center p-2.5 space-y-2 ">
        {mainNavItems.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isActive={pathname === item.href}
          />
        ))}
      </nav>

      <div className="p-4 space-y-2">
        {bottomItems.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isActive={pathname === item.href}
            external={item.external}
          />
        ))}
      </div>
    </aside>
  );
}
