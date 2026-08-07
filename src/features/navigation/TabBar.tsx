"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LibraryBig, ChartColumn, Heart, Users, User } from "lucide-react";
import { useRef, useEffect, useState, useCallback } from "react";

const navItems = [
  { href: "/library", icon: LibraryBig },
  { href: "/tracker", icon: ChartColumn },
  { href: "/wishlist", icon: Heart },
  { href: "/community", icon: Users },
  { href: "/profile", icon: User },
];

export function TabBar() {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const earsRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  const [isMounted, setIsMounted] = useState(false);

  const moveEars = useCallback((targetHref: string) => {
    const nav = navRef.current;
    const ears = earsRef.current;
    const targetLink = linkRefs.current[targetHref];
    if (!nav || !ears || !targetLink) return;

    const navRect = nav.getBoundingClientRect();
    const linkRect = targetLink.getBoundingClientRect();
    const earsWidth = ears.offsetWidth;

    const offsetX =
      linkRect.left - navRect.left + linkRect.width / 2 - earsWidth / 2;

    ears.style.transform = `translateX(${offsetX}px)`;
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    requestAnimationFrame(() => {
      moveEars(pathname);
    });
  }, [pathname, isMounted, moveEars]);

  useEffect(() => {
    if (!isMounted) return;
    let timer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        moveEars(pathname);
      }, 150);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, [pathname, isMounted, moveEars]);

  return (
    <nav
      ref={navRef}
      className="fixed bottom-0 left-0 w-full bg-secondary border-t border-border rounded-t-4xl flex justify-around items-center h-16 z-30 lg:hidden bg-linear-to-t from-background/40 to-secondary"
    >
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            ref={(el) => {
              linkRefs.current[item.href] = el;
            }}
            className={`flex flex-col items-center justify-center p-2 transition-colors relative z-10 ${
              isActive
                ? "text-primary"
                : "text-secondary-foreground hover:text-foreground"
            }`}
          >
            <item.icon className="w-5 h-5" />
          </Link>
        );
      })}

      <div
        ref={earsRef}
        className="absolute top-2 left-0 flex items-center justify-center pointer-events-none -z-10 transition-transform duration-300 ease"
      >
        <img
          src="/ears.svg"
          alt="ears"
          className="w-8 h-8 shadow-2xl shadow-primary"
        />
      </div>
    </nav>
  );
}
