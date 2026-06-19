"use client"

import { SlidersHorizontal, X } from "lucide-react"
import { STREAMS, STATES, TYPES } from "@/lib/colleges"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export type Filters = {
  streams: string[]
  states: string[]
  types: string[]
  maxFees: number
  minRating: number
}

export const FEE_MAX = 2500000

function FilterGroup({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string
  options: readonly string[]
  selected: string[]
  onToggle: (value: string) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      <div className="flex flex-col gap-2.5">
        {options.map((option) => (
          <div key={option} className="flex items-center gap-2.5">
            <Checkbox
              id={`${title}-${option}`}
              checked={selected.includes(option)}
              onCheckedChange={() => onToggle(option)}
            />
            <Label
              htmlFor={`${title}-${option}`}
              className="cursor-pointer text-sm font-normal text-muted-foreground"
            >
              {option}
            </Label>
          </div>
        ))}
      </div>
    </div>
  )
}

export function FilterSidebar({
  filters,
  setFilters,
  onClear,
  resultCount,
}: {
  filters: Filters
  setFilters: React.Dispatch<React.SetStateAction<Filters>>
  onClear: () => void
  resultCount: number
}) {
  const toggle = (key: "streams" | "states" | "types", value: string) => {
    setFilters((prev) => {
      const list = prev[key]
      return {
        ...prev,
        [key]: list.includes(value)
          ? list.filter((v) => v !== value)
          : [...list, value],
      }
    })
  }

  return (
    <div className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
          <SlidersHorizontal className="size-4 text-primary" />
          Filters
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="h-8 px-2 text-xs text-muted-foreground"
        >
          <X className="size-3.5" />
          Clear
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">{resultCount}</span> colleges match your filters
      </p>

      <Separator />

      <FilterGroup
        title="Stream"
        options={STREAMS}
        selected={filters.streams}
        onToggle={(v) => toggle("streams", v)}
      />
      <Separator />

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-foreground">Max Total Fees</h4>
          <span className="text-xs font-medium text-primary">
            {filters.maxFees >= FEE_MAX
              ? "Any"
              : `₹${(filters.maxFees / 100000).toFixed(1)}L`}
          </span>
        </div>
        <Slider
          min={50000}
          max={FEE_MAX}
          step={50000}
          value={[filters.maxFees]}
          onValueChange={(v) => setFilters((p) => ({ ...p, maxFees: (v as number[])[0] }))}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>₹50K</span>
          <span>₹25L+</span>
        </div>
      </div>
      <Separator />

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-foreground">Min Rating</h4>
          <span className="text-xs font-medium text-primary">
            {filters.minRating > 0 ? `${filters.minRating.toFixed(1)}+` : "Any"}
          </span>
        </div>
        <Slider
          min={0}
          max={5}
          step={0.5}
          value={[filters.minRating]}
          onValueChange={(v) => setFilters((p) => ({ ...p, minRating: (v as number[])[0] }))}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Any</span>
          <span>5.0</span>
        </div>
      </div>
      <Separator />

      <FilterGroup
        title="College Type"
        options={TYPES}
        selected={filters.types}
        onToggle={(v) => toggle("types", v)}
      />
      <Separator />

      <FilterGroup
        title="State"
        options={STATES}
        selected={filters.states}
        onToggle={(v) => toggle("states", v)}
      />
    </div>
  )
}
