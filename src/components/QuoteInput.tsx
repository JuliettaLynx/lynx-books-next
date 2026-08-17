"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Check, X } from "lucide-react";

interface QuoteInputProps {
  value: string;
  onChange: (text: string) => void;
  page: number | undefined;
  onPageChange: (page: number | undefined) => void;
  onSave: () => void;
  onCancel?: () => void;
  isEditing: boolean;
  disabled?: boolean;
}

export function QuoteInput({
  value,
  onChange,
  page,
  onPageChange,
  onSave,
  onCancel,
  isEditing,
  disabled,
}: QuoteInputProps) {
  return (
    <div className="mt-1 space-y-2">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Текст цитаты"
        className="w-full resize-none"
        rows={3}
      />
      <div className="flex gap-2">
        <Input
          type="number"
          value={page ?? ""}
          onChange={(e) =>
            onPageChange(e.target.value ? Number(e.target.value) : undefined)
          }
          placeholder="Стр."
          className="w-24 shrink-0"
        />
        <Button
          type="button"
          variant="default"
          onClick={onSave}
          disabled={disabled}
        >
          {isEditing ? (
            <Check className="size-4" />
          ) : (
            <Plus className="size-4" />
          )}
        </Button>
        {isEditing && onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
