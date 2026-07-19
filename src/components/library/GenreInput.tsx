"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";

interface GenreInputProps {
  genres: string[];
  onChange: (genres: string[]) => void;
}

export function GenreInput({ genres, onChange }: GenreInputProps) {
  const [input, setInput] = useState("");

  const addGenre = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    if (genres.includes(trimmed)) {
      setInput("");
      return;
    }
    onChange([...genres, trimmed]);
    setInput("");
  };

  const removeGenre = (genre: string) => {
    onChange(genres.filter((g) => g !== genre));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addGenre();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Добавить жанр"
          className="flex-1 px-3 py-2 rounded-lg border border-border bg-bg-primary text-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
        />
        <button
          type="button"
          onClick={addGenre}
          disabled={!input.trim()}
          className="px-3 py-2 rounded-lg bg-accent text-bg-primary hover:bg-accent/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {genres.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {genres.map((genre) => (
            <span
              key={genre}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-border/50 text-sm text-text"
            >
              {genre}
              <button
                type="button"
                onClick={() => removeGenre(genre)}
                className="hover:text-red-400 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
