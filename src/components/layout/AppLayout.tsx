"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/navigation/Sidebar";
import { TabBar } from "@/components/navigation/TabBar";
import { Header } from "@/components/navigation/Header";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/auth";

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Sidebar />
      <div className="flex-1 lg:ml-16 flex flex-col">
        <Header />
        <main className="flex-1 pb-16 lg:pb-0">{children}</main>
      </div>
      <TabBar />
    </div>
  );
}
