"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/shared/lib/utils";
import { Heart, HeartOff } from "lucide-react";

interface FavoriteToggleProps {
  value: boolean | null;
  onChange: (value: boolean | null) => void;
}

export function FavoriteToggle({ value, onChange }: FavoriteToggleProps) {
  const handleClick = (val: boolean) => {
    onChange(value === val ? null : val);
  };

  const toggleStyle =
    "flex flex-1 items-center justify-center gap-1 h-8 px-3 border border-input bg-muted/30 text-sm text-muted-foreground cursor-pointer hover:text-foreground data-pressed:bg-primary/10 data-pressed:border-primary data-pressed:text-primary";

  return (
    <ToggleGroup
      value={value === null ? [] : [value ? "favorite" : "not-favorite"]}
      className="w-full flex gap-0"
    >
      <ToggleGroupItem
        value="favorite"
        onClick={() => handleClick(true)}
        className={cn(toggleStyle, "rounded-r-none")}
      >
        <Heart className="size-3.5" />
        <span className="hidden min-[390px]:block">Избранное</span>
      </ToggleGroupItem>
      <ToggleGroupItem
        value="not-favorite"
        onClick={() => handleClick(false)}
        className={cn(toggleStyle, "rounded-l-none")}
      >
        <HeartOff className="size-3.5" />
        <span className="hidden min-[390px]:block">Не избранное</span>
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
