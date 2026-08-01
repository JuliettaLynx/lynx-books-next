"use client";

import { Sidebar } from "@/components/navigation/Sidebar";
import { TabBar } from "@/components/navigation/TabBar";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Sidebar />
      <main className="flex-1 lg:ml-16 flex flex-col pb-16 lg:pb-0">
        {children}
      </main>
      <TabBar />
    </div>
  );
}
