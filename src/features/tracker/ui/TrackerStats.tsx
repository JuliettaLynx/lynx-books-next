import type { ReadingSession } from "@/shared/models/ReadingSession";
import { StatsGroup } from "./StatsGroup";

interface TrackerStatsProps {
  sessions: ReadingSession[];
}

export default function TrackerStats({ sessions }: TrackerStatsProps) {
  const sessionsByDay = new Map<string, ReadingSession[]>();
  sessions.forEach((s) => {
    const dayKey = s.startDate.toISOString().slice(0, 10); // YYYY-MM-DD
    if (!sessionsByDay.has(dayKey)) {
      sessionsByDay.set(dayKey, []);
    }
    sessionsByDay.get(dayKey)!.push(s);
  });

  const activeDays = sessionsByDay.size;

  let maxStreak = 0;
  let currentStreak = 0;
  const sortedDays = Array.from(sessionsByDay.keys()).sort();
  for (let i = 0; i < sortedDays.length; i++) {
    if (i === 0) {
      currentStreak = 1;
    } else {
      const prevDate = new Date(sortedDays[i - 1]);
      const currDate = new Date(sortedDays[i]);
      const diffDays = Math.floor(
        (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24),
      );
      if (diffDays === 1) {
        currentStreak += 1;
      } else {
        currentStreak = 1;
      }
    }
    if (currentStreak > maxStreak) maxStreak = currentStreak;
  }

  const totalSessions = sessions.length;
  const totalPages = sessions.reduce((sum, s) => sum + (s.pagesRead || 0), 0);

  const sessionsWithTime = sessions.filter((s) => (s.durationMinutes || 0) > 0);

  const pagesPerMinute =
    sessionsWithTime.length > 0
      ? sessionsWithTime.reduce((sum, s) => sum + (s.pagesRead || 0), 0) /
        sessionsWithTime.reduce((sum, s) => sum + (s.durationMinutes || 0), 0)
      : 0;

  const pagesPerDay = activeDays > 0 ? totalPages / activeDays : 0;

  const minutPerDay =
    sessionsWithTime.length > 0
      ? sessionsWithTime.reduce((sum, s) => sum + (s.durationMinutes || 0), 0) /
        activeDays
      : 0;

  const formatNumber = (num: number) => num.toFixed(1);

  const formatMinutes = (minutes: number): string => {
    if (minutes <= 0) return "0м";
    const rounded = Math.round(minutes);
    const hours = Math.floor(rounded / 60);
    const mins = rounded % 60;
    if (hours === 0) return `${mins}м`;
    if (mins === 0) return `${hours}ч`;
    return `${hours}ч ${mins}м`;
  };

  const totalItems = [
    { label: "Дней", value: activeDays },
    { label: "Сессий", value: totalSessions },
    { label: "Страниц", value: totalPages },
  ];

  const averageItems = [
    {
      label: "Страниц/мин",
      value: sessionsWithTime.length > 0 ? formatNumber(pagesPerMinute) : "—",
      hint: "Рассчитывается как: общее количество страниц / общее указанное время чтения (мин).",
    },
    {
      label: "Страниц/день",
      value: activeDays > 0 ? formatNumber(pagesPerDay) : "—",
      hint: "Рассчитывается как: общее количество страниц / количество активных дней.",
    },
    {
      label: "Минут/день",
      value: activeDays > 0 ? formatMinutes(minutPerDay) : "—",
      hint: "Рассчитывается как: общее указанное время чтения / количество активных дней.",
    },
  ];

  return (
    <div className="flex flex-wrap gap-3 items-stretch">
      <div className="w-full flex justify-between bg-secondary/20 -bg-linear-20 from-background/20 from-30% to-primary/10 px-3 py-1 rounded-lg text-center">
        <div className="text-xs text-muted-foreground uppercase tracking-wide flex items-center justify-center gap-1">
          Максимальная серия <span className="text-lg">🔥</span>
        </div>
        <div className="text-xl font-semibold">{maxStreak}</div>
      </div>
      <StatsGroup title="Всего" items={totalItems} />
      <StatsGroup title="Средние" items={averageItems} />
    </div>
  );
}
