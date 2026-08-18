"use client";

import {
  STATUS_OPTIONS,
  FORMAT_OPTIONS,
} from "@/features/library/config/filterOptions";
import { BookFormat, BookReadingStatus } from "@/shared/models/Book";
import { Separator } from "@/components/ui/separator";

import { SearchInput } from "@/components/filters/SearchInput";
import { TagLogicSelector } from "@/components/filters/TagLogicSelector";
import { MultipleFilterBox } from "@/components/filters/MultipleFilterBox";
import { SingleFilterBox } from "@/components/filters/SingleFilterBox";
import { FavoriteToggle } from "@/components/filters/FavoriteToggle";
import { ResetFiltersButton } from "@/components/filters/ResetFiltersButton";

export interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  readingStatus: BookReadingStatus | null;
  onReadingStatusChange: (value: BookReadingStatus | null) => void;
  format: BookFormat | null;
  onFormatChange: (value: BookFormat | null) => void;
  tags: string[];
  onTagsChange: (value: string[]) => void;
  tagLogic: "OR" | "AND";
  onTagLogicChange: (value: "OR" | "AND") => void;
  allTags: string[];
  onReset: () => void;
  isFavorite: boolean | null;
  onFavoriteChange: (value: boolean | null) => void;
  activeFilterCount: number;
  seriesName: string | null;
  onSeriesNameChange: (value: string | null) => void;
  author: string | null;
  onAuthorChange: (value: string | null) => void;
  publisher: string | null;
  onPublisherChange: (value: string | null) => void;
  allSeries: string[];
  allAuthors: string[];
  allPublishers: string[];
}

export function FilterBar({
  search,
  onSearchChange,
  readingStatus,
  onReadingStatusChange,
  format,
  onFormatChange,
  tags,
  onTagsChange,
  tagLogic,
  onTagLogicChange,
  allTags,
  onReset,
  activeFilterCount,
  isFavorite,
  onFavoriteChange,
  seriesName,
  onSeriesNameChange,
  author,
  onAuthorChange,
  publisher,
  onPublisherChange,
  allSeries,
  allAuthors,
  allPublishers,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3">
      <SearchInput value={search} onChange={onSearchChange} />

      <div className="flex gap-3">
        <TagLogicSelector value={tagLogic} onChange={onTagLogicChange} />
        <MultipleFilterBox
          options={allTags.map((t) => ({ label: t, value: t }))}
          selected={tags}
          onChange={onTagsChange}
          placeholder="Теги"
          className="flex-1 min-w-37.5"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <SingleFilterBox
          options={allSeries.map((s) => ({ label: s, value: s }))}
          value={seriesName}
          onChange={onSeriesNameChange}
          placeholder="● Серия"
          className="flex-1 min-w-36"
        />
        <SingleFilterBox
          options={allAuthors.map((a) => ({ label: a, value: a }))}
          value={author}
          onChange={onAuthorChange}
          placeholder="● Автор"
          className="flex-1 min-w-36"
        />
        <SingleFilterBox
          options={allPublishers.map((p) => ({ label: p, value: p }))}
          value={publisher}
          onChange={onPublisherChange}
          placeholder="● Издательство"
          className="flex-1 min-w-36"
        />
      </div>

      <div className="flex flex-col md:grid md:grid-cols-[1fr_auto_1fr] md:items-center gap-2 md:gap-x-2 md:gap-y-0">
        <div className="flex gap-2 justify-start">
          <SingleFilterBox
            options={STATUS_OPTIONS}
            value={readingStatus}
            onChange={(val) =>
              onReadingStatusChange(val as BookReadingStatus | null)
            }
            placeholder="● Статус"
            className="w-full"
          />
          <SingleFilterBox
            options={FORMAT_OPTIONS}
            value={format}
            onChange={(val) => onFormatChange(val as BookFormat | null)}
            placeholder="● Формат"
            className="w-full"
          />
        </div>

        <Separator orientation="vertical" className="hidden md:block" />

        <div className="flex pt-1 md:pt-0 gap-2 justify-end items-center">
          <FavoriteToggle value={isFavorite} onChange={onFavoriteChange} />
          <>
            <Separator orientation="vertical" className="hidden sm:block" />
            <ResetFiltersButton
              activeCount={activeFilterCount}
              onReset={onReset}
              disabled={activeFilterCount === 0}
            />
          </>
        </div>
      </div>
    </div>
  );
}
