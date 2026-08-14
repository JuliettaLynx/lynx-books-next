"use client";

import * as React from "react";
import { cn } from "@/shared/lib/utils";

import {
  Combobox,
  ComboboxContent,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from "@/components/ui/combobox";
import { ChevronDownIcon, ChevronUpIcon, XIcon } from "lucide-react";

import { FilterOption } from "@/shared/types/filter";
import { Button } from "@/components/ui/button";

interface MultipleFilterBoxProps {
  options: FilterOption[];
  selected: string[];
  onChange: (value: string[]) => void;
  placeholder: string;
  className?: string;
}

export function MultipleFilterBox({
  options,
  selected,
  onChange,
  placeholder,
  className,
}: MultipleFilterBoxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setSearchQuery("");
    }
  }, [open]);

  const handleRemove = (e: React.MouseEvent, value: string) => {
    e.stopPropagation();
    onChange(selected.filter((v) => v !== value));
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  const filteredOptions = React.useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return options;
    return options.filter((opt) => opt.label.toLowerCase().includes(query));
  }, [options, searchQuery]);

  return (
    <div className={cn("w-full", className)}>
      <Combobox
        open={open}
        onOpenChange={setOpen}
        multiple
        value={selected}
        onValueChange={(vals) => {
          onChange(Array.isArray(vals) ? vals : [vals as string]);
        }}
      >
        <ComboboxTrigger
          className={cn(
            "h-full gap-1.5 justify-start w-full inline-flex items-center rounded-lg border border-input bg-muted/30 text-muted-foreground px-3 py-1.5 text-sm ring-offset-background hover:cursor-pointer hover:text-foreground",
            open && "border-primary bg-primary/10 text-foreground",
            selected.length > 0 &&
              !open &&
              "border-primary bg-primary/10 text-primary",
          )}
        >
          {selected.length > 0 ? (
            <span className="flex flex-wrap gap-1 max-w-full">
              {selected.map((tag) => {
                const option = options.find((o) => o.value === tag);
                return (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-0.5 rounded bg-primary/20 px-1.5 py-0.5 text-xs text-primary"
                  >
                    {option?.label || tag}
                    <span
                      className="ml-0.5 inline-flex items-center hover:opacity-70 cursor-pointer"
                      onClick={(e) => handleRemove(e, tag)}
                    >
                      <XIcon className="size-3" />
                    </span>
                  </span>
                );
              })}
            </span>
          ) : (
            <span>{placeholder}</span>
          )}
          {open ? (
            <ChevronUpIcon className="size-3 ml-auto shrink-0" />
          ) : (
            <ChevronDownIcon className="size-3 ml-auto shrink-0" />
          )}
        </ComboboxTrigger>

        <ComboboxContent
          side="bottom"
          className="z-50 w-[--trigger-width] overflow-hidden rounded-lg border bg-popover text-popover-foreground shadow-md"
        >
          <div className="flex items-center justify-between border-b px-3 py-2">
            <span className="text-xs text-muted-foreground">
              {selected.length} выбрано
            </span>
            {selected.length > 0 && (
              <Button
                variant="link"
                onClick={handleClearAll}
                size="xs"
                className="h-4 text-muted-foreground"
              >
                Сбросить
              </Button>
            )}
          </div>

          <div className="border-b px-3 py-2">
            <input
              type="text"
              placeholder="Поиск..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-input bg-secondary/30 px-3 py-1 text-sm outline-none focus:ring focus:ring-ring"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setSearchQuery("");
                  e.stopPropagation();
                }
              }}
            />
          </div>

          <ComboboxList className="max-h-52 overflow-y-auto p-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const isSelected = selected.includes(opt.value);
                return (
                  <ComboboxItem
                    key={opt.value}
                    value={opt.value}
                    className={cn(
                      "relative flex cursor-pointer items-center gap-2 rounded-md py-1.5 pr-8 pl-3 text-sm outline-none select-none",
                      "data-highlighted:bg-accent",
                      "data-disabled:pointer-events-none data-disabled:opacity-50",
                      isSelected && "text-primary font-medium",
                    )}
                  >
                    <span className="truncate">{opt.label}</span>
                  </ComboboxItem>
                );
              })
            ) : (
              <div className="px-3 py-4 text-center text-xs text-muted-foreground">
                Ничего не найдено
              </div>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}
