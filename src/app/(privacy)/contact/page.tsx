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
import { Button } from "@/components/ui/button";

export default function WishlistPage() {
  return (
    <div className="p-4 md:p-8 space-y-6">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Wrench />
          </EmptyMedia>
          <EmptyTitle>Страница в разработке</EmptyTitle>
          <EmptyDescription>
            Скоро появится полноценная возможность связи, а пока можете
            воспользоваться гугл формой ниже
          </EmptyDescription>

          <EmptyContent>
            <Button
              render={() => {
                return (
                  <a
                    href="https://forms.gle/Ff2xgHXGYgEjbT858"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Google форма
                  </a>
                );
              }}
            ></Button>
          </EmptyContent>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
