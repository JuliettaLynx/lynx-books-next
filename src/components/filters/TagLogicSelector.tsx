"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface TagLogicSelectorProps {
  value: "OR" | "AND";
  onChange: (value: "OR" | "AND") => void;
}

export function TagLogicSelector({ value, onChange }: TagLogicSelectorProps) {
  return (
    <div className="flex items-center gap-2 rounded-lg border bg-muted/30 px-3 h-8 py-1">
      <RadioGroup
        value={value}
        onValueChange={(val) => onChange(val as "OR" | "AND")}
        className="flex flex-row gap-3"
      >
        <div className="flex items-center gap-1 cursor-pointer">
          <RadioGroupItem value="OR" id="tag-logic-or" className="size-3" />
          <Label
            htmlFor="tag-logic-or"
            className="text-sm text-muted-foreground"
          >
            или
          </Label>
        </div>
        <div className="flex items-center gap-1 cursor-pointer">
          <RadioGroupItem value="AND" id="tag-logic-and" className="size-3" />
          <Label
            htmlFor="tag-logic-and"
            className="text-sm text-muted-foreground"
          >
            и
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}
