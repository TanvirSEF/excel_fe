"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RANGE_PRESETS, type DateRange, type RangePreset } from "@/lib/report-range"
import type { TrafficFilter } from "@/types/api"

const TRAFFIC_OPTIONS: { value: TrafficFilter; label: string; hint: string }[] = [
  { value: "clean", label: "Excluding bots", hint: "Likely human + unknown" },
  { value: "human", label: "Likely human only", hint: "Interaction or sustained engagement seen" },
  { value: "all", label: "All traffic", hint: "Including bots and internal" },
]

interface ReportControlsProps {
  preset: RangePreset
  range: DateRange
  traffic: TrafficFilter
  compare: boolean
  onPresetChange: (preset: RangePreset) => void
  onRangeChange: (range: DateRange) => void
  onTrafficChange: (traffic: TrafficFilter) => void
  onCompareChange: (compare: boolean) => void
}

export function ReportControls({
  preset,
  range,
  traffic,
  compare,
  onPresetChange,
  onRangeChange,
  onTrafficChange,
  onCompareChange,
}: ReportControlsProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border/80 bg-card p-3 shadow-xs lg:flex-row lg:flex-wrap lg:items-center">
      <div className="flex flex-wrap gap-1.5">
        {RANGE_PRESETS.map((item) => (
          <Button
            key={item.value}
            size="sm"
            variant={preset === item.value ? "default" : "outline"}
            onClick={() => onPresetChange(item.value)}
          >
            {item.label}
          </Button>
        ))}
      </div>

      {preset === "custom" ? (
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={range.from}
            max={range.to}
            onChange={(event) => onRangeChange({ ...range, from: event.target.value })}
            className="h-9 w-36 text-xs"
            aria-label="From date"
          />
          <span className="text-xs text-muted-foreground">to</span>
          <Input
            type="date"
            value={range.to}
            min={range.from}
            onChange={(event) => onRangeChange({ ...range, to: event.target.value })}
            className="h-9 w-36 text-xs"
            aria-label="To date"
          />
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-2 lg:ml-auto">
        <select
          value={traffic}
          onChange={(event) => onTrafficChange(event.target.value as TrafficFilter)}
          className="h-9 rounded-md border border-input bg-background px-2.5 text-xs font-medium"
          aria-label="Traffic quality filter"
          title={TRAFFIC_OPTIONS.find((option) => option.value === traffic)?.hint}
        >
          {TRAFFIC_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <Button size="sm" variant={compare ? "default" : "outline"} onClick={() => onCompareChange(!compare)}>
          Compare to previous period
        </Button>
      </div>
    </div>
  )
}
