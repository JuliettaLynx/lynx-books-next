"use client";

import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { cn } from "@/shared/lib/utils";

interface EmptyStateProps {
  title: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  buttonText,
  onButtonClick,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <Empty
      className={cn(
        "relative top-4 left-1/2 -translate-x-1/2 w-72 bg-background/40 -bg-linear-20 from-background/20 from-30% via-chart-3/10 via-70% to-primary/20 shadow-[4px_8px_24px_rgba(0,0,0,0.3)]",
        className,
      )}
    >
      <EmptyHeader>
        {icon && <EmptyMedia>{icon}</EmptyMedia>}
        <EmptyTitle>{title}</EmptyTitle>
        {description && <EmptyDescription>{description}</EmptyDescription>}
        {buttonText && onButtonClick && (
          <EmptyContent>
            <Button variant="link" onClick={onButtonClick} className="text-sm">
              {buttonText}
            </Button>
          </EmptyContent>
        )}
      </EmptyHeader>
    </Empty>
  );
}
