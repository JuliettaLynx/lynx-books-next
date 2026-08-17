import { forwardRef } from "react";
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface FieldInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: { message?: string };
  register?: any;
}

export const FieldInput = forwardRef<HTMLInputElement, FieldInputProps>(
  ({ label, error, register, ...props }, ref) => {
    return (
      <Field className="gap-0.5">
        <FieldLabel className="text-xs text-muted-foreground">
          {label}
        </FieldLabel>
        <FieldContent>
          <Input ref={ref} {...register} {...props} />
          <FieldError errors={error ? [error] : []} />
        </FieldContent>
      </Field>
    );
  },
);
FieldInput.displayName = "FieldInput";
