export type BookFormat = "бумажная" | "электронная" | "аудио";
export type BookReadingStatus = "не прочитано" | "прочитано" | "брошено";

export type Quote = {
  _id?: string;
  text: string;
  page?: number;
  createdAt: Date;
};

export interface LibraryBook {
  _id: string;
  userId: string;

  title: string;
  author: string;
  isbn?: string;
  annotation?: string;
  seriesName?: string;
  seriesNumber?: number;

  cover?: string | null;
  publisher?: string;
  pages?: number;

  tags: string[];
  format: BookFormat;
  readingStatus: BookReadingStatus;
  isFavorite: boolean;
  review?: string;
  rating?: number;
  quotes: Quote[];

  createdAt: Date;
  updatedAt: Date;
}

export const FORMAT_LABELS: Record<BookFormat, string> = {
  бумажная: "Бумажная",
  электронная: "Электронная",
  аудио: "Аудио",
};

export const STATUS_LABELS: Record<BookReadingStatus, string> = {
  "не прочитано": "Не прочитано",
  прочитано: "Прочитано",
  брошено: "Брошено",
};
