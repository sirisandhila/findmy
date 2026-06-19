"use client"

import Image from "next/image"
import {
  MapPin,
  Heart,
  GitCompare,
  Award,
  BookOpen,
  Wallet,
  Check,
} from "lucide-react"
import type { College } from "@/lib/colleges"
import { RatingBadge } from "@/components/rating-badge"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function CollegeCard({
  college,
  saved,
  compared,
  onToggleSave,
  onToggleCompare,
}: {
  college: College
  saved: boolean
  compared: boolean
  onToggleSave: (id: string) => void
  onToggleCompare: (id: string) => void
}) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:border-primary/40 hover:shadow-md sm:flex-row">
      {/* Image */}
      <div className="relative h-44 w-full shrink-0 overflow-hidden sm:h-auto sm:w-56">
        <Image
          src={college.image || "/placeholder.svg"}
          alt={`${college.name} campus`}
          fill
          sizes="(max-width: 640px) 100vw, 224px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {college.featured && (
          <span className="absolute left-3 top-3 rounded-md bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">
            Featured
          </span>
        )}
        <button
          type="button"
          onClick={() => onToggleSave(college.id)}
          aria-label={saved ? "Remove from saved" : "Save college"}
          aria-pressed={saved}
          className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-card/90 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-card"
        >
          <Heart
            className={cn(
              "size-4.5 transition-colors",
              saved ? "fill-destructive text-destructive" : "text-muted-foreground",
            )}
          />
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="font-medium">
                {college.type}
              </Badge>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                <Award className="size-3.5" />
                #{college.ranking} {college.rankingBody}
              </span>
            </div>
            <h3 className="text-pretty text-base font-semibold leading-snug text-foreground">
              {college.name}
            </h3>
            <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="size-3.5 shrink-0" />
              {college.location}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <RatingBadge rating={college.rating} />
            <span className="text-xs text-muted-foreground">
              {college.reviews.toLocaleString("en-IN")} reviews
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 rounded-lg bg-muted/60 p-3">
          <Stat icon={Wallet} label="Total Fees" value={college.feesLabel} />
          <Stat icon={BookOpen} label="Courses" value={`${college.courses}+`} />
          <Stat icon={Award} label="Accredited" value={college.accredited} />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {college.exams.map((exam) => (
            <span
              key={exam}
              className="rounded-md border border-border bg-background px-2 py-0.5 text-xs text-muted-foreground"
            >
              {exam}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
          <Button size="sm" className="flex-1 sm:flex-none">
            View Details
          </Button>
          <Button
            size="sm"
            variant={compared ? "default" : "outline"}
            onClick={() => onToggleCompare(college.id)}
            aria-pressed={compared}
            className={cn(compared && "bg-accent-foreground text-primary-foreground hover:bg-accent-foreground/90")}
          >
            {compared ? <Check className="size-4" /> : <GitCompare className="size-4" />}
            {compared ? "Added" : "Compare"}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onToggleSave(college.id)}
            aria-pressed={saved}
          >
            <Heart className={cn("size-4", saved && "fill-destructive text-destructive")} />
            {saved ? "Saved" : "Save"}
          </Button>
        </div>
      </div>
    </article>
  )
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="flex items-center gap-1 text-xs text-muted-foreground">
        <Icon className="size-3.5" />
        {label}
      </span>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  )
}
