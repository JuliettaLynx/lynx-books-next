import { useCallback } from "react";

export function useFormNavigation() {
  const handleEnter = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        const form = e.currentTarget.form;
        if (!form) return;
        const inputs = Array.from(
          form.querySelectorAll<HTMLInputElement>("input:not([disabled])"),
        );
        const currentIndex = inputs.indexOf(e.currentTarget);
        const nextIndex = currentIndex + 1;
        if (nextIndex < inputs.length) {
          e.preventDefault();
          inputs[nextIndex].focus();
        }
      }
    },
    [],
  );

  return { handleEnter };
}
