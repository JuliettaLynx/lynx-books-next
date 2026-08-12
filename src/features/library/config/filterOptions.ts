import {
  BookFormat,
  BookReadingStatus,
  FORMAT_LABELS,
  STATUS_LABELS,
} from "@/shared/models/Book";
import { FilterOption } from "@/shared/types/filter";
import {
  Clock,
  CircleCheck,
  CircleX,
  FileText,
  Smartphone,
  Headphones,
  type LucideIcon,
} from "lucide-react";

const STATUS_ICONS: Record<BookReadingStatus, LucideIcon> = {
  "не прочитано": Clock,
  прочитано: CircleCheck,
  брошено: CircleX,
};

const FORMAT_ICONS: Record<BookFormat, LucideIcon> = {
  бумажная: FileText,
  электронная: Smartphone,
  аудио: Headphones,
};

export const STATUS_OPTIONS: FilterOption[] = Object.entries(STATUS_LABELS).map(
  ([value, label]) => ({
    value: value as BookReadingStatus,
    label,
    icon: STATUS_ICONS[value as BookReadingStatus],
  }),
);

export const FORMAT_OPTIONS: FilterOption[] = Object.entries(FORMAT_LABELS).map(
  ([value, label]) => ({
    value: value as BookFormat,
    label,
    icon: FORMAT_ICONS[value as BookFormat],
  }),
);
