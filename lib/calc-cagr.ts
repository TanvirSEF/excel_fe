import { differenceInDays } from "date-fns"

export interface ProjectionRow {
  year: number
  value: number
  growthFromStart: number
}

export interface CagrInput {
  startValue: number
  endValue: number
  years: number
}

export interface CagrResult {
  cagrPercent: number
  absoluteGrowthPercent: number
  multiple: number
  projection: ProjectionRow[]
}

const MAX_PROJECTION_ROWS = 50

export function calculateCagr({
  startValue,
  endValue,
  years,
}: CagrInput): CagrResult {
  const multiple = endValue / startValue
  const cagr = multiple ** (1 / years) - 1

  const rows = Math.min(Math.max(1, Math.round(years)), MAX_PROJECTION_ROWS)
  const projection: ProjectionRow[] = []
  for (let year = 1; year <= rows; year++) {
    const value = startValue * (1 + cagr) ** year
    projection.push({
      year,
      value,
      growthFromStart: (value / startValue - 1) * 100,
    })
  }

  return {
    cagrPercent: cagr * 100,
    absoluteGrowthPercent: (multiple - 1) * 100,
    multiple,
    projection,
  }
}

export function yearsBetweenDates(start: Date, end: Date): number {
  return differenceInDays(end, start) / 365.25
}
