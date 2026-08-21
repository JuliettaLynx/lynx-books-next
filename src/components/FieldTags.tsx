import { useState } from "react";
import { Field, FieldLabel, FieldContent } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Hint } from "@/components/Hint";

interface FieldTagsProps {
  label: string;
  value: string[];
  onChange: (tags: string[]) => void;
  hint: string;
}

export function FieldTags({ label, value, onChange, hint }: FieldTagsProps) {
  const [newTag, setNewTag] = useState("");

  const handleAddTag = () => {
    const trimmed = newTag.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const defaultHint = `Гибкий способ группировки`;

  return (
    <Field className="gap-0.5">
      <div className="flex items-center gap-2">
        <FieldLabel className="text-xs text-muted-foreground">
          {label}
        </FieldLabel>
        <Hint text={hint || defaultHint} />
      </div>

      <FieldContent>
        <div className="flex gap-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Введите и добавьте тег"
          />
          <Button
            type="button"
            variant="default"
            onClick={handleAddTag}
            disabled={!newTag.trim()}
          >
            <Plus />
          </Button>
        </div>
        {value.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {value.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-foreground"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        )}
      </FieldContent>
    </Field>
  );
}
