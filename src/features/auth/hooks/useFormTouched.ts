import { useState, useEffect, useCallback, useRef } from "react";
import { UseFormReturn, FieldValues, Path } from "react-hook-form";

export function useFormTouched<T extends FieldValues>(
  form: UseFormReturn<T>,
  fields: Path<T>[],
  delay = 500,
) {
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const checkAndTouch = useCallback(
    (values: T) => {
      const fieldsToValidate = fields.filter((field) => {
        const value = values[field];
        return typeof value === "string" ? value.trim() !== "" : !!value;
      });

      if (fieldsToValidate.length > 0) {
        setTouched((prev) => ({
          ...prev,
          ...Object.fromEntries(fieldsToValidate.map((f) => [f, true])),
        }));
        form.trigger(fieldsToValidate as any);
      }
    },
    [fields, form],
  );

  const debouncedCheck = useRef(
    (() => {
      let timer: NodeJS.Timeout | null = null;
      return (values: T) => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          checkAndTouch(values);
          timer = null;
        }, delay);
      };
    })(),
  ).current;

  useEffect(() => {
    const subscription = form.watch((values) => {
      debouncedCheck(values as T);
    });
    return () => subscription.unsubscribe();
  }, [form, debouncedCheck]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const values = form.getValues();
      checkAndTouch(values);
    }, delay);
    return () => clearTimeout(timer);
  }, [checkAndTouch, delay]);

  const handleBlur = useCallback(
    (fieldName: Path<T>) => {
      setTouched((prev) => ({ ...prev, [fieldName]: true }));
      form.trigger(fieldName);
    },
    [form],
  );

  return { touched, setTouched, handleBlur };
}
