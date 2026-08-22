"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { ChevronDownIcon } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateTimeFieldProps {
  name: string;
  label: string;
  noTime?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  onDateSelect?: () => void;
}

export function DateTimeField({
  name,
  label,
  noTime = false,
  onFocus,
  onBlur,
  onDateSelect,
}: DateTimeFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const [open, setOpen] = useState(false);
  const error = errors[name]?.message as string | undefined;

  return (
    <Field>
      <FieldLabel className="text-xs text-muted-foreground">{label}</FieldLabel>
      <FieldContent>
        <Controller
          name={name}
          control={control}
          render={({ field: { value, onChange } }) => {
            const date = value ? new Date(value) : undefined;
            const timeStr = date ? format(date, "HH:mm") : "";

            return (
              <div className="flex flex-col gap-1">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger
                    render={
                      <Button
                        variant="outline"
                        className="w-full justify-between font-normal"
                      >
                        {date
                          ? format(date, "PPP", { locale: ru })
                          : "Выберите дату"}
                        <ChevronDownIcon className="size-4 opacity-50" />
                      </Button>
                    }
                  />
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(newDate) => {
                        if (newDate) {
                          const updated = newDate;
                          updated.setSeconds(0, 0);
                          if (date) {
                            updated.setHours(
                              date.getHours(),
                              date.getMinutes(),
                              0,
                            );
                          }
                          onChange(updated);
                          if (onDateSelect) onDateSelect();
                        }
                        setOpen(false);
                      }}
                      captionLayout="dropdown"
                      defaultMonth={date}
                      weekStartsOn={1}
                    />
                  </PopoverContent>
                </Popover>
                {!noTime && (
                  <Input
                    type="time"
                    value={timeStr}
                    onChange={(e) => {
                      const [hours, minutes] = e.target.value
                        .split(":")
                        .map(Number);
                      if (date) {
                        const newDate = new Date(date);
                        newDate.setHours(hours, minutes, 0);
                        onChange(newDate);
                      }
                    }}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    className="w-28 appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  />
                )}
              </div>
            );
          }}
        />
        {error && <FieldError errors={[{ message: error }]} />}
      </FieldContent>
    </Field>
  );
}
