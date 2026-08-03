import {
  Controller,
  Control,
  FieldValues,
  Path,
  FieldErrors,
} from "react-hook-form";
import { Field, FieldError } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Eye, EyeOff, Check } from "lucide-react";
import { ReactNode } from "react";

interface AuthFormFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  placeholder: string;
  icon: ReactNode;
  type?: string;
  autoComplete?: string;
  onEnter?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onBlurHandler?: () => void;
  touched: Record<string, boolean>;
  errors: FieldErrors<T>;
  showPasswordToggle?: boolean;
  passwordVisible?: boolean;
  onTogglePassword?: () => void;
}

export function AuthFormField<T extends FieldValues>({
  name,
  control,
  placeholder,
  icon,
  type = "text",
  autoComplete,
  onEnter,
  onBlurHandler,
  touched,
  errors,
  showPasswordToggle = false,
  passwordVisible = false,
  onTogglePassword,
}: AuthFormFieldProps<T>) {
  const hasError = touched[name] && !!errors[name]?.message;
  const isValid = touched[name] && !errors[name]?.message;

  return (
    <Field>
      <InputGroup className="p-1 gap-1">
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <InputGroupInput
              {...field}
              id={name}
              type={type}
              placeholder={placeholder}
              autoComplete={autoComplete}
              onKeyDown={onEnter}
              onBlur={() => {
                field.onBlur();
                onBlurHandler?.();
              }}
              value={field.value ?? ""}
            />
          )}
        />
        <InputGroupAddon align="inline-start">{icon}</InputGroupAddon>

        {showPasswordToggle && (
          <InputGroupAddon align="inline-end">
            <button
              type="button"
              onClick={onTogglePassword}
              className="text-muted-foreground hover:text-secondary-foreground"
            >
              {passwordVisible ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </InputGroupAddon>
        )}

        {isValid && (
          <InputGroupAddon align="inline-end">
            <Check className="text-success w-5 h-5" />
          </InputGroupAddon>
        )}
      </InputGroup>

      {hasError && <FieldError>{String(errors[name]?.message)}</FieldError>}
    </Field>
  );
}

export default AuthFormField;
