"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useEffect, useState, useCallback } from "react";
import { tabNavItems } from "../model/navConfig";
import { Star } from "lucide-react";

export function TabBar() {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const starRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  const [isMounted, setIsMounted] = useState(false);

  const activeItem = tabNavItems.find((item) =>
    item.activePaths
      ? item.activePaths.includes(pathname)
      : pathname === item.href,
  );
  const activeHref = activeItem?.href || pathname;

  const moveStar = useCallback((targetHref: string) => {
    const nav = navRef.current;
    const star = starRef.current;
    const targetLink = linkRefs.current[targetHref];
    if (!nav || !star || !targetLink) return;

    const navRect = nav.getBoundingClientRect();
    const linkRect = targetLink.getBoundingClientRect();
    const starWidth = star.offsetWidth;

    const offsetX =
      linkRect.left - navRect.left + linkRect.width / 2 - starWidth / 2;

    star.style.transform = `translateX(${offsetX}px)`;
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    requestAnimationFrame(() => {
      moveStar(activeHref);
    });
  }, [activeHref, isMounted, moveStar]);

  useEffect(() => {
    if (!isMounted) return;
    let timer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        moveStar(activeHref);
      }, 150);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, [activeHref, isMounted, moveStar]);

  return (
    <nav
      ref={navRef}
      className="fixed bottom-2 inset-x-2 bg-secondary border-t border-border rounded-full flex justify-around items-center h-14 z-30 lg:hidden bg-linear-to-tr from-background/40 to-accent"
    >
      {tabNavItems.map((item) => {
        const isActive = item.activePaths
          ? item.activePaths.includes(pathname)
          : pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            ref={(el) => {
              linkRefs.current[item.href] = el;
            }}
            className={`flex flex-col items-center justify-center p-2 transition-colors relative z-10 ${
              isActive
                ? "text-secondary"
                : "text-secondary-foreground hover:text-foreground"
            }`}
          >
            <item.icon className="w-5 h-5 stroke-[2.5]" />
          </Link>
        );
      })}

      <div
        ref={starRef}
        className="absolute top-1 left-0 flex items-center justify-center pointer-events-none -z-10 transition-transform duration-300 ease"
      >
        <Star className="w-11 h-11 text-primary fill-primary" />
      </div>
    </nav>
  );
}
