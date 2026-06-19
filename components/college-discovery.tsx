"use client"

import { useEffect, useMemo, useState } from "react"
import { SlidersHorizontal, GitCompare, X, ArrowUpDown } from "lucide-react"
import type { College } from "@/lib/colleges"
import { CollegeCard } from "@/components/college-card"
import { FilterSidebar, FEE_MAX, type Filters } from "@/components/filter-sidebar"
import { SearchHero } from "@/components/search-hero"
import { Pagination } from "@/components/pagination"
import { Button } from "@/components/ui/button"

const PAGE_SIZE = 5

const SORT_OPTIONS = [
  { value: "ranking", label: "Top Ranked" },
  { value: "rating", label: "Highest Rated" },
  { value: "fees-low", label: "Fees: Low to High" },
  { value: "fees-high", label: "Fees: High to Low" },
] as const

const defaultFilters: Filters = {
  streams: [],
  states: [],
  types: [],
  maxFees: FEE_MAX,
  minRating: 0,
}

const SAVED_KEY = "collegekampus:saved"

export function CollegeDiscovery({ colleges }: { colleges: College[] }) {
  const [query, setQuery] = useState("")
  const [filters, setFilters] = useState<Filters>(defaultFilters)
  const [sort, setSort] = useState<(typeof SORT_OPTIONS)[number]["value"]>("ranking")
  const [page, setPage] = useState(1)
  const [saved, setSaved] = useState<string[]>([])
  const [compared, setCompared] = useState<string[]>([])
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // Load saved colleges from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SAVED_KEY)
      if (stored) setSaved(JSON.parse(stored))
    } catch {
      // ignore malformed storage
    }
  }, [])

  // Persist saved colleges whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(SAVED_KEY, JSON.stringify(saved))
    } catch {
      // ignore storage write failures
    }
  }, [saved])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const result = colleges.filter((c) => {
      const matchesQuery =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.stream.toLowerCase().includes(q) ||
        c.exams.some((e) => e.toLowerCase().includes(q))
      const matchesStream =
        filters.streams.length === 0 || filters.streams.includes(c.stream)
      const matchesState =
        filters.states.length === 0 || filters.states.includes(c.state)
      const matchesType =
        filters.types.length === 0 || filters.types.includes(c.type)
      const matchesFees = c.fees <= filters.maxFees
      const matchesRating = c.rating >= filters.minRating
      return (
        matchesQuery &&
        matchesStream &&
        matchesState &&
        matchesType &&
        matchesFees &&
        matchesRating
      )
    })

    result.sort((a, b) => {
      switch (sort) {
        case "rating":
          return b.rating - a.rating
        case "fees-low":
          return a.fees - b.fees
        case "fees-high":
          return b.fees - a.fees
        default:
          return a.ranking - b.ranking
      }
    })
    return result
  }, [query, filters, sort, colleges])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const resetPage = () => setPage(1)

  const toggleSave = (id: string) =>
    setSaved((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    )

  const toggleCompare = (id: string) =>
    setCompared((prev) =>
      prev.includes(id)
        ? prev.filter((s) => s !== id)
        : prev.length >= 4
          ? prev
          : [...prev, id],
    )

  const clearFilters = () => {
    setFilters(defaultFilters)
    setQuery("")
    resetPage()
  }

  return (
    <>
      <SearchHero
        query={query}
        onQueryChange={(v) => {
          setQuery(v)
          resetPage()
        }}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          {/* Sidebar - desktop */}
          <aside className="hidden lg:block">
            <div className="sticky top-20">
              <FilterSidebar
                filters={filters}
                setFilters={(f) => {
                  setFilters(f)
                  resetPage()
                }}
                onClear={clearFilters}
                resultCount={filtered.length}
              />
            </div>
          </aside>

          {/* Results */}
          <main>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {filtered.length} Colleges Found
                </h2>
                <p className="text-sm text-muted-foreground">
                  Showing {paged.length > 0 ? (safePage - 1) * PAGE_SIZE + 1 : 0}
                  {"–"}
                  {(safePage - 1) * PAGE_SIZE + paged.length} of {filtered.length}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setMobileFiltersOpen(true)}
                >
                  <SlidersHorizontal className="size-4" />
                  Filters
                </Button>
                <div className="relative flex items-center">
                  <ArrowUpDown className="pointer-events-none absolute left-2.5 size-4 text-muted-foreground" />
                  <select
                    value={sort}
                    onChange={(e) => {
                      setSort(e.target.value as typeof sort)
                      resetPage()
                    }}
                    aria-label="Sort colleges"
                    className="h-9 rounded-md border border-border bg-card py-1 pl-8 pr-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-ring"
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {paged.length > 0 ? (
              <div className="flex flex-col gap-4">
                {paged.map((college) => (
                  <CollegeCard
                    key={college.id}
                    college={college}
                    saved={saved.includes(college.id)}
                    compared={compared.includes(college.id)}
                    onToggleSave={toggleSave}
                    onToggleCompare={toggleCompare}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card py-16 text-center">
                <SlidersHorizontal className="size-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No colleges match your filters.
                </p>
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear all filters
                </Button>
              </div>
            )}

            <div className="mt-8">
              <Pagination
                currentPage={safePage}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          </main>
        </div>
      </div>

      {/* Compare bar */}
      {compared.length > 0 && (
        <div className="sticky bottom-0 z-30 border-t border-border bg-card/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <GitCompare className="size-5 text-primary" />
              <span>
                {compared.length} {compared.length === 1 ? "college" : "colleges"} to compare
              </span>
              <button
                type="button"
                onClick={() => setCompared([])}
                className="ml-1 text-xs text-muted-foreground underline-offset-2 hover:underline"
              >
                Clear
              </button>
            </div>
            <Button disabled={compared.length < 2}>
              Compare Now
            </Button>
          </div>
        </div>
      )}

      {/* Mobile filters drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setMobileFiltersOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 left-0 w-[85%] max-w-sm overflow-y-auto bg-background p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-semibold text-foreground">Filters</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Close filters"
              >
                <X className="size-5" />
              </Button>
            </div>
            <FilterSidebar
              filters={filters}
              setFilters={(f) => {
                setFilters(f)
                resetPage()
              }}
              onClear={clearFilters}
              resultCount={filtered.length}
            />
            <div className="mt-4">
              <Button className="w-full" onClick={() => setMobileFiltersOpen(false)}>
                Show {filtered.length} results
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
