import type { ReadingSession } from "@/shared/models/ReadingSession";
import { StatsGroup } from "./StatsGroup";

interface TrackerStatsProps {
  sessions: ReadingSession[];
  year: number;
  month: number;
}

export default function TrackerStats({
  sessions,
  year,
  month,
}: TrackerStatsProps) {
  // Группируем сессии по дням (по startDate)
  const sessionsByDay = new Map<string, ReadingSession[]>();
  sessions.forEach((s) => {
    const dayKey = s.startDate.toISOString().slice(0, 10); // YYYY-MM-DD
    if (!sessionsByDay.has(dayKey)) {
      sessionsByDay.set(dayKey, []);
    }
    sessionsByDay.get(dayKey)!.push(s);
  });

  const activeDays = sessionsByDay.size;

  // Максимальная серия подряд идущих дней
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

  // Общие суммы
  const totalSessions = sessions.length;
  const totalPages = sessions.reduce((sum, s) => sum + (s.pagesRead || 0), 0);

  // Средние значения
  const sessionsWithTime = sessions.filter((s) => (s.durationMinutes || 0) > 0);
  const pagesPerMinute =
    sessionsWithTime.length > 0
      ? sessionsWithTime.reduce((sum, s) => sum + (s.pagesRead || 0), 0) /
        sessionsWithTime.reduce((sum, s) => sum + (s.durationMinutes || 0), 0)
      : 0;

  const pagesPerDay = activeDays > 0 ? totalPages / activeDays : 0;
  const sessionsPerDay = activeDays > 0 ? totalSessions / activeDays : 0;

  // Форматирование чисел с одним знаком после запятой
  const formatNumber = (num: number) => num.toFixed(1);

  // Подготовка данных для групп
  const totalItems = [
    { label: "Дней", value: activeDays },
    { label: "Сессий", value: totalSessions },
    { label: "Страниц", value: totalPages },
  ];

  const averageItems = [
    {
      label: "Страниц/мин",
      value: sessionsWithTime.length > 0 ? formatNumber(pagesPerMinute) : "—",
    },
    {
      label: "Страниц/день",
      value: activeDays > 0 ? formatNumber(pagesPerDay) : "—",
    },
    {
      label: "Сессий/день",
      value: activeDays > 0 ? formatNumber(sessionsPerDay) : "—",
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
