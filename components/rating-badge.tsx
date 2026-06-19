import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

export function RatingBadge({
  rating,
  className,
}: {
  rating: number
  className?: string
}) {
  const tone =
    rating >= 4.5
      ? "bg-success/15 text-success"
      : rating >= 4
        ? "bg-primary/10 text-primary"
        : "bg-warning/15 text-[oklch(0.5_0.14_70)]"

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-bold",
        tone,
        className,
      )}
    >
      <Star className="size-3.5 fill-current" />
      {rating.toFixed(1)}
    </span>
  )
}
