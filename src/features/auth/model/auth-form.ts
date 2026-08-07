import { ReactNode } from "react";
import { FieldValues, Path } from "react-hook-form";

export interface FieldConfig<T extends FieldValues> {
  name: Path<T>;
  placeholder: string;
  icon: ReactNode;
  type?: string;
  autoComplete?: string;
  showPasswordToggle?: boolean;
}
