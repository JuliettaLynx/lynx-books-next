"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";

interface SearchInputProps {
  placeholder?: string;
  onChange: (value: string) => void;
}

export function SearchInput({
  placeholder = "Название или автор",
  onChange,
}: SearchInputProps) {
  const [value, setValue] = useState("");
  const [debounced, setDebounced] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDebounced(value);
      onChange(value);
    }, 300);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [value, onChange]);

  const handleClear = () => {
    setValue("");
    setDebounced("");
    onChange("");
  };

  return (
    <div className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2 rounded-lg border border-border bg-bg-primary text-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-colors"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-text"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
