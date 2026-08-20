import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MonthNavigationProps {
  onPrev: () => void;
  onNext: () => void;
}

export default function MonthNavigation({
  onPrev,
  onNext,
}: MonthNavigationProps) {
  return (
    <div className="flex items-center gap-1">
      <Button variant="outline" size="icon" onClick={onPrev}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={onNext}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
