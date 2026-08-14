"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import NavItem from "@/features/navigation/ui/NavItem";
import {
  mainNavItems,
  bottomNavItems,
} from "@/features/navigation/model/navConfig";
import Logo from "@/assets/logo.svg";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className={`
        fixed inset-y-2 left-2 z-50 w-14
        bg-secondary bg-linear-to-tr from-background/60 to-accent
        rounded-full shadow-2xl border-r border-border
        hidden lg:flex lg:flex-col items-center py-1 gap-1 
      `}
    >
      <Link href="/library" className="p-1.5 pt-3 flex items-center gap-3">
        <Logo className="text-primary w-12 h-12" />
      </Link>

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
        {bottomNavItems.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isActive={pathname === item.href}
          />
        ))}
      </div>
    </aside>
  );
}
