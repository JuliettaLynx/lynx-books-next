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
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

import { FilterOption } from "@/shared/types/filter";

interface SingleFilterBoxProps {
  options: FilterOption[];
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder: string;
  className?: string;
}

export function SingleFilterBox({
  options,
  value,
  onChange,
  placeholder,
  className,
}: SingleFilterBoxProps) {
  const [open, setOpen] = React.useState(false);

  const selectedOption = options.find((o) => o.value === value);

  return (
    <Combobox
      open={open}
      onOpenChange={setOpen}
      value={value ?? ""}
      onValueChange={(val) => {
        const newVal = val as string;
        if (newVal === value) {
          onChange(null);
        } else {
          onChange(newVal);
        }
      }}
    >
      <ComboboxTrigger
        className={cn(
          "h-8 gap-1.5 justify-start inline-flex items-center rounded-lg border border-input bg-muted/30 text-muted-foreground px-3 py-2 text-sm ring-offset-background hover:cursor-pointer hover:text-foreground",
          open && "border-primary bg-primary/10 text-foreground",
          value && !open && "border-primary bg-primary/10 text-primary",
          className,
        )}
      >
        <div className="flex items-center gap-1.5 truncate">
          {selectedOption?.icon && (
            <selectedOption.icon className="size-3.5 shrink-0 hidden min-[390px]:block" />
          )}
          <span className="truncate">
            {selectedOption?.label || placeholder}
          </span>
        </div>
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
        <ComboboxList className="max-h-52 overflow-y-auto p-1">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            const Icon = opt.icon;
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
                {Icon && <Icon className="size-4 shrink-0" />}
                <span className="truncate">{opt.label}</span>
              </ComboboxItem>
            );
          })}
          {options.length === 0 && (
            <div className="px-3 py-4 text-center text-xs text-muted-foreground">
              Нет вариантов
            </div>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
