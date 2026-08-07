"use client";

import { Sidebar } from "@/features/navigation/ui/Sidebar";
import { TabBar } from "@/features/navigation/ui/TabBar";
import AuraBackground from "../../components/background/AuraBackground";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Sidebar />
      <AuraBackground />
      <main className="flex-1 z-10 lg:ml-16 flex flex-col pb-16 lg:pb-0">
        {children}
      </main>
      <TabBar />
    </div>
  );
}
