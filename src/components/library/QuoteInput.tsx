"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface QuoteInputProps {
  quotes: string[];
  onChange: (quotes: string[]) => void;
}

export function QuoteInput({ quotes, onChange }: QuoteInputProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  const addQuote = () => {
    onChange([...quotes, ""]);
    setEditingIndex(quotes.length);
  };

  const updateQuote = (index: number, value: string) => {
    const updated = [...quotes];
    updated[index] = value;
    onChange(updated);
  };

  const removeQuote = (index: number) => {
    const updated = quotes.filter((_, i) => i !== index);
    onChange(updated);
    if (editingIndex === index) setEditingIndex(null);
  };

  const startEdit = (index: number, value: string) => {
    setEditingIndex(index);
    setEditValue(value);
  };

  const saveEdit = () => {
    if (editingIndex !== null) {
      updateQuote(editingIndex, editValue);
      setEditingIndex(null);
    }
  };

  return (
    <div className="space-y-3">
      {quotes.length === 0 && (
        <p className="text-sm text-gray-400">Цитаты пока не добавлены</p>
      )}

      {quotes.map((quote, index) => (
        <div key={index} className="flex gap-2 items-start">
          <div className="flex-1">
            {editingIndex === index ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEdit();
                    if (e.key === "Escape") setEditingIndex(null);
                  }}
                  placeholder="Текст цитаты"
                  autoFocus
                  className="w-full px-3 py-2 rounded-lg border border-border bg-bg-primary text-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
                />
                <button
                  type="button"
                  onClick={saveEdit}
                  className="px-3 py-2 rounded-lg bg-accent text-bg-primary hover:bg-accent/80 text-sm transition-colors"
                >
                  ОК
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => startEdit(index, quote)}
                className="w-full text-left px-3 py-2 rounded-lg border border-border bg-bg-primary text-text text-sm hover:bg-border/30 transition-colors min-h-10 text-gray-500"
              >
                {quote || "Нажмите, чтобы добавить цитату"}
              </button>
            )}
          </div>
          {quotes.length > 1 && (
            <button
              type="button"
              onClick={() => removeQuote(index)}
              className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={addQuote}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-border text-text hover:bg-border/30 text-sm transition-colors"
      >
        <Plus className="w-4 h-4" />
        Добавить цитату
      </button>
    </div>
  );
}
