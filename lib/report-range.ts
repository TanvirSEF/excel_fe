import { format, subDays } from "date-fns"

export type RangePreset = "today" | "yesterday" | "7d" | "28d" | "30d" | "custom"

export interface DateRange {
  from: string
  to: string
}

export const RANGE_PRESETS: { value: RangePreset; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "7d", label: "Last 7 days" },
  { value: "28d", label: "Last 28 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "custom", label: "Custom" },
]

const DAY_FORMAT = "yyyy-MM-dd"

export function browserTimeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"
}

export function presetRange(preset: Exclude<RangePreset, "custom">): DateRange {
  const today = new Date()
  switch (preset) {
    case "today":
      return { from: format(today, DAY_FORMAT), to: format(today, DAY_FORMAT) }
    case "yesterday": {
      const day = format(subDays(today, 1), DAY_FORMAT)
      return { from: day, to: day }
    }
    case "7d":
      return { from: format(subDays(today, 6), DAY_FORMAT), to: format(today, DAY_FORMAT) }
    case "28d":
      return { from: format(subDays(today, 27), DAY_FORMAT), to: format(today, DAY_FORMAT) }
    case "30d":
      return { from: format(subDays(today, 29), DAY_FORMAT), to: format(today, DAY_FORMAT) }
  }
}
