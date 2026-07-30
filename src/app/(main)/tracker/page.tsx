"use client";

import { Wrench } from "lucide-react";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function TrackerPage() {
  return (
    <div className="p-4 md:p-8 space-y-6">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Wrench />
          </EmptyMedia>
          <EmptyTitle>Страница в разработке</EmptyTitle>
          <EmptyDescription>Скоро появится трекер чтения</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
