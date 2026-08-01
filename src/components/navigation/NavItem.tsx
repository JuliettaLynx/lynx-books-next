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
  external = false,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
  external?: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (external) {
      window.open(href, "_blank", "noopener,noreferrer");
      return;
    }
    startTransition(() => {
      router.push(href);
    });
  };

  const linkClasses = `
    flex items-center gap-3 p-2 rounded-lg
    transition-colors
    transform transition-transform duration-100 cursor-pointer hover:text-secondary-foreground
    ${isActive ? "text-primary" : ""}
    ${isPending ? "scale-90 text-secondary-foreground" : "text-muted-foreground"}
  `;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={handleClick}
          disabled={isPending}
          className={linkClasses}
          aria-label={label}
          {...(external && { target: "_blank", rel: "noopener noreferrer" })}
        >
          <Icon className="w-7 h-7" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="right">
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export default NavItem;
