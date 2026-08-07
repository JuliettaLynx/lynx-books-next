"use client";

import { usePathname } from "next/navigation";
import NavItem from "./NavItem";
import { mainNavItems, bottomNavItems } from "../model/navConfig";

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
