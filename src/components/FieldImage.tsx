import { useRef, ChangeEvent } from "react";
import Image from "next/image";
import { Field, FieldContent } from "@/components/ui/field";
import { X } from "lucide-react";

interface FieldImageUploadProps {
  value: string | null;
  onChange: (file: File | null, preview: string | null) => void;
}

export function FieldImageUpload({ value, onChange }: FieldImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onChange(file, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null, null);
  };

  return (
    <Field>
      <FieldContent>
        <div
          className="relative w-32 h-44 rounded-md border-2 border-dashed border-muted-foreground/30 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors overflow-hidden"
          onClick={handleClick}
        >
          {value ? (
            <>
              <Image src={value} alt="Обложка" fill className="object-cover" />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 transition-colors"
                aria-label="Удалить обложку"
              >
                <X className="size-5" />
              </button>
            </>
          ) : (
            <span className="text-muted-foreground text-sm">Загрузить</span>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </FieldContent>
    </Field>
  );
}
