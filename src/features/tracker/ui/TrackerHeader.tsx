import MonthNavigation from "./MonthNavigation";
import YearSelect from "./YearSelect";

interface TrackerHeaderProps {
  year: number;
  month: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onYearChange: (year: number) => void;
}

export default function TrackerHeader({
  year,
  month,
  onPrevMonth,
  onNextMonth,
  onYearChange,
}: TrackerHeaderProps) {
  const monthName = new Date(year, month, 1).toLocaleString("ru", {
    month: "long",
  });

  return (
    <div className="flex items-center justify-between">
      <YearSelect year={year} onYearChange={onYearChange} />
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold capitalize">{monthName}</h2>
        <MonthNavigation onPrev={onPrevMonth} onNext={onNextMonth} />
      </div>
    </div>
  );
}
