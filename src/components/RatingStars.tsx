"use client";

import { Star } from "lucide-react";

interface RatingStarsProps {
  rating?: number;
  maxStars?: number;
  maxRating?: number;
}

export function RatingStars({
  rating,
  maxStars = 5,
  maxRating = 10,
}: RatingStarsProps) {
  if (rating === undefined || rating === null) return null;

  const starValue = maxRating / maxStars;
  const fullStars = Math.floor(rating / starValue);
  const remainder = rating % starValue;
  const hasHalf = remainder >= starValue / 2;

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: maxStars }).map((_, i) => {
        let fillPercent = 0;
        if (i < fullStars) {
          fillPercent = 100;
        } else if (i === fullStars && hasHalf) {
          fillPercent = 50;
        } else {
          fillPercent = 0;
        }

        return (
          <div key={i} className="relative size-5">
            <Star
              className="absolute inset-0 size-5 text-muted-foreground"
              fill="none"
              stroke="currentColor"
            />
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fillPercent}%` }}
            >
              <Star
                className="size-5 text-warning"
                fill="currentColor"
                stroke="currentColor"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
