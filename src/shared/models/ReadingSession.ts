import { SessionColorIndex } from "@/shared/constants/colors";

export interface ReadingSession {
  _id: string;
  userId: string;
  bookId: string;
  bookTitle: string;
  colorIndex: SessionColorIndex;
  startDate: Date;
  endDate: Date;
  startPage?: number;
  endPage?: number;
  pagesRead: number;
  durationMinutes: number;
  finishedBook: boolean;
  tags: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
