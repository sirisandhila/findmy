"use client"

import { Search, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SearchHero({
  query,
  onQueryChange,
}: {
  query: string
  onQueryChange: (value: string) => void
}) {
  const popular = ["IIT Delhi", "MBA Colleges", "NEET", "Law", "Engineering"]

  return (
    <section className="border-b border-border bg-primary">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <h1 className="text-balance text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl lg:text-5xl">
          Find the right college for your future
        </h1>
        <p className="mt-3 max-w-2xl text-pretty text-base text-primary-foreground/80 sm:text-lg">
          Explore 25,000+ colleges. Compare fees, ratings, rankings, and reviews
          all in one place.
        </p>

        <div className="mt-6 flex flex-col gap-2 rounded-xl bg-card p-2 shadow-lg sm:flex-row">
          <div className="flex flex-1 items-center gap-2 rounded-lg px-3">
            <Search className="size-5 shrink-0 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search colleges, courses, or exams..."
              className="h-11 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              aria-label="Search colleges"
            />
          </div>
          <div className="hidden items-center gap-2 border-l border-border px-3 sm:flex">
            <MapPin className="size-5 shrink-0 text-muted-foreground" />
            <input
              type="text"
              placeholder="Location"
              className="h-11 w-28 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              aria-label="Filter by location"
            />
          </div>
          <Button size="lg" className="h-11 shrink-0">
            <Search className="size-4" />
            Search
          </Button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-sm text-primary-foreground/70">Popular:</span>
          {popular.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onQueryChange(item)}
              className="rounded-full border border-primary-foreground/25 px-3 py-1 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
