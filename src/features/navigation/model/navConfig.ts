import {
  Library,
  ChartBarDecreasing,
  Heart,
  Users,
  MessageSquareMore,
  User,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  activePaths?: string[];
}

export const mainNavItems: NavItem[] = [
  { href: "/library", label: "Библиотека", icon: Library },
  { href: "/tracker", label: "Трекер", icon: ChartBarDecreasing },
  { href: "/wishlist", label: "Вишлист", icon: Heart },
  { href: "/community", label: "Подписки", icon: Users },
];

export const bottomNavItems: NavItem[] = [
  { href: "/contact", label: "Связаться", icon: MessageSquareMore },
  { href: "/profile", label: "Профиль", icon: User },
];

export const tabNavItems: NavItem[] = [
  ...mainNavItems,
  {
    href: "/profile",
    label: "Профиль",
    icon: User,
    activePaths: ["/profile", "/contact"],
  },
];
