"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function NavItem({
  href,
  icon: Icon,
  label,
  isActive = false,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(() => {
      router.push(href);
    });
  };

  const linkClasses = `
    flex items-center gap-3 p-2 rounded-lg
    transition-colors
    transform transition-transform duration-100 cursor-pointer 
    ${isActive ? "text-primary" : isPending ? "translate-y-px text-secondary-foreground" : "text-muted-foreground hover:text-secondary-foreground"}
  `;

  return (
    <Tooltip>
      <TooltipTrigger
        render={(triggerProps) => {
          const { onClick: triggerClick, ...restTriggerProps } = triggerProps;
          return (
            <button
              onClick={(e) => {
                triggerClick?.(e);
                handleClick();
              }}
              disabled={isPending}
              className={linkClasses}
              aria-label={label}
              {...restTriggerProps}
            >
              <Icon className="w-6 h-6 stroke-[2.5]" />
            </button>
          );
        }}
      />
      <TooltipContent side="right">
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export default NavItem;
