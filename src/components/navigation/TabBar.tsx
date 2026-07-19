"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Library, BookOpen, Heart, Users } from "lucide-react";

const navItems = [
  { href: "/library", icon: Library },
  { href: "/tracker", icon: BookOpen },
  { href: "/wishlist", icon: Heart },
  { href: "/community", icon: Users },
];

export function TabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-bg-secondary border-t border-border flex justify-around items-center h-16 z-30 lg:hidden">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center p-2 transition-colors ${
              isActive ? "text-accent" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <item.icon className="w-7 h-7" />
          </Link>
        );
      })}
    </nav>
  );
}
