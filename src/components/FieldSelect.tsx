"use client";

import * as React from "react";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import {
  Combobox,
  ComboboxContent,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from "@/components/ui/combobox";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface Option {
  value: string;
  label: string;
}

interface FieldSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  options: Option[];
}

export function FieldSelect<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ control, name, label, options }: FieldSelectProps<TFieldValues, TName>) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex justify-between items-center gap-2">
      <label className="text-xs font-medium text-muted-foreground w-30">
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const selectedOption = options.find((o) => o.value === field.value);

          return (
            <Combobox
              open={open}
              onOpenChange={setOpen}
              value={field.value ?? ""}
              onValueChange={(val) => {
                field.onChange(val || null);
              }}
            >
              <ComboboxTrigger
                className={cn(
                  "flex-1 h-8 max-w-44 gap-1.5 justify-start inline-flex items-center rounded-lg border border-input bg-muted/30 text-muted-foreground px-3 py-2 text-sm ring-offset-background hover:cursor-pointer hover:text-foreground",
                  open && "border-primary text-foreground",
                  field.value && !open && "border-muted text-foreground",
                )}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span className="truncate">
                    {selectedOption?.label || `Выберите ${label.toLowerCase()}`}
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
                className="z-50 w-[--trigger-width] max-w-40 overflow-hidden rounded-lg border bg-popover text-popover-foreground shadow-md"
              >
                <ComboboxList className="max-h-52 overflow-y-auto p-1">
                  {options.map((opt) => {
                    const isSelected = opt.value === field.value;
                    return (
                      <ComboboxItem
                        key={opt.value}
                        value={opt.value}
                        className={cn(
                          "relative flex cursor-pointer items-center gap-2 rounded-md py-1.5 pr-8 pl-3 text-sm outline-none select-none data-highlighted:bg-accent data-disabled:pointer-events-none data-disabled:opacity-50",
                          isSelected && "text-primary font-medium",
                        )}
                      >
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
        }}
      />
    </div>
  );
}
