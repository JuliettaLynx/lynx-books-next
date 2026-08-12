"use client";

import { Button } from "@/components/ui/button";
import { FilterX } from "lucide-react";

interface ResetFiltersButtonProps {
  activeCount: number;
  onReset: () => void;
  disabled?: boolean;
}

export function ResetFiltersButton({
  activeCount,
  onReset,
  disabled,
}: ResetFiltersButtonProps) {
  return (
    <Button
      variant="destructive"
      onClick={onReset}
      disabled={disabled}
      className="h-8 shrink-0 gap-1.5 text-xs cursor-pointer"
    >
      <FilterX className="size-3.5" />
      Сбросить ({activeCount})
    </Button>
  );
}
