import { useState } from "react";
import {
  Combobox,
  ComboboxTrigger,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
} from "@/components/ui/combobox";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface YearSelectProps {
  year: number;
  onYearChange: (year: number) => void;
}

export default function YearSelect({ year, onYearChange }: YearSelectProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 10 + i);
  const [open, setOpen] = useState(false);

  return (
    <div className="flex justify-between items-center gap-2">
      <Combobox
        open={open}
        onOpenChange={setOpen}
        value={String(year)}
        onValueChange={(val) => onYearChange(Number(val))}
      >
        <ComboboxTrigger
          className={cn(
            "flex-1 h-8 max-w-44 gap-1.5 justify-start inline-flex items-center rounded-lg border border-input bg-muted/30 text-muted-foreground px-3 py-2 text-sm ring-offset-background hover:cursor-pointer hover:text-foreground",
            open && "border-primary text-foreground",
            !open && "border-muted text-foreground",
          )}
        >
          <span className="truncate">{year}</span>
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
            {years.map((y) => (
              <ComboboxItem
                key={y}
                value={String(y)}
                className={cn(
                  "relative flex cursor-pointer items-center gap-2 rounded-md py-1.5 pr-8 pl-3 text-sm outline-none select-none data-highlighted:bg-accent data-disabled:pointer-events-none data-disabled:opacity-50",
                  y === year && "text-primary font-medium",
                )}
              >
                <span className="truncate">{y}</span>
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}
