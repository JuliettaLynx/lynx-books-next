"use client";

import { ReactNode, FormEvent } from "react";
import { Control, FieldErrors, FieldValues, Path } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { FieldConfig } from "@/features/auth/model/auth-form";
import AuthFormField from "./AuthFormField";

interface AuthFormProps<T extends FieldValues> {
  title: string;
  fields: FieldConfig<T>[];
  control: Control<T>;
  errors: FieldErrors<T>;
  touched: Record<string, boolean>;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  submitText: string;
  loading: boolean;
  error?: string;
  toggleLink: ReactNode;
  onEnter?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onBlur?: (name: Path<T>) => void;
  passwordVisible?: boolean;
  onTogglePassword?: () => void;
}

export function AuthForm<T extends FieldValues>({
  title,
  fields,
  control,
  errors,
  touched,
  onSubmit,
  submitText,
  loading,
  error,
  toggleLink,
  onEnter,
  onBlur,
  passwordVisible,
  onTogglePassword,
}: AuthFormProps<T>) {
  return (
    <div className="relative z-30 rounded-2xl p-6 w-full max-w-sm bg-background/40 -bg-linear-20 from-background/20 from-30% to-primary/20 shadow-[4px_8px_24px_rgba(0,0,0,0.3)]">
      <h1 className="text-foreground text-2xl tracking-wider font-bold text-center pb-4">
        {title}
      </h1>

      <form onSubmit={onSubmit} className="space-y-4">
        <FieldGroup className="gap-4">
          {fields.map((field) => (
            <AuthFormField
              key={field.name}
              name={field.name}
              control={control}
              placeholder={field.placeholder}
              icon={field.icon}
              type={field.type}
              autoComplete={field.autoComplete}
              onEnter={onEnter}
              onBlurHandler={() => onBlur?.(field.name)}
              touched={touched}
              errors={errors}
              showPasswordToggle={field.showPasswordToggle}
              passwordVisible={passwordVisible}
              onTogglePassword={onTogglePassword}
            />
          ))}
        </FieldGroup>

        <Button
          type="submit"
          disabled={loading}
          className="w-full py-5 bg-primary hover:bg-primary/80 font-medium text-secondary rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-secondary" />
              Загрузка…
            </>
          ) : (
            submitText
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground mt-4">
          {toggleLink}
        </p>
      </form>
    </div>
  );
}
