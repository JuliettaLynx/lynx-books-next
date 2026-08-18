import { useState } from "react";
import { cn } from "@/shared/lib/utils";
import { CircleHelp } from "lucide-react";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";

interface HintProps {
  text: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  className?: string;
}

export function Hint({
  text,
  side = "right",
  align = "start",
  className,
}: HintProps) {
  const [open, setOpen] = useState(false);

  const handleClick = () => setOpen(!open);

  return (
    <HoverCard open={open} onOpenChange={setOpen}>
      <HoverCardTrigger>
        <CircleHelp
          className={cn(
            "size-3.5 text-muted-foreground cursor-help",
            className,
          )}
          onClick={handleClick}
        />
      </HoverCardTrigger>
      <HoverCardContent
        side={side}
        align={align}
        className="w-72 text-xs leading-relaxed whitespace-pre-line"
      >
        {text}
      </HoverCardContent>
    </HoverCard>
  );
}
