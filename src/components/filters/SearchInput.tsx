"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SearchIcon } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <InputGroup className="flex-1">
      <InputGroupInput
        placeholder="Поиск по названию, автору или ISBN..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10"
      />
      <InputGroupAddon>
        <SearchIcon className="size-3.5" />
      </InputGroupAddon>
    </InputGroup>
  );
}
