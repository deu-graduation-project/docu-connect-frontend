// components/star-rating.tsx
import React from "react"
import { Icons } from "@/components/icons"

interface StarRatingProps {
  rating: number
  className?: string
}

export function StarRating({ rating, className }: StarRatingProps) {
  // Make sure rating is between 0 and 5
  const safeRating = Math.min(5, Math.max(0, rating))

  return (
    <div className={`flex items-center justify-start gap-1 ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Icons.star
          key={star}
          fill={star <= safeRating ? "currentColor" : "transparent"}
          className="h-4 w-4 text-yellow-500"
        />
      ))}
    </div>
  )
}
