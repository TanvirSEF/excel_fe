import {
  differenceInBusinessDays,
  differenceInCalendarDays,
  intervalToDuration,
  isWeekend,
} from "date-fns"

export interface DateDifferenceInput {
  start: Date
  end: Date
  /** Extra non-weekend holidays to exclude from the business-day count. */
  holidayCount: number
}

export interface DateDifferenceResult {
  totalDays: number
  inclusiveDays: number
  years: number
  months: number
  days: number
  weeks: number
  weekRemainderDays: number
  businessDays: number
  weekendDays: number
}

export function calculateDateDifference({
  start,
  end,
  holidayCount,
}: DateDifferenceInput): DateDifferenceResult {
  const later = start <= end ? end : start
  const earlier = start <= end ? start : end

  const totalDays = differenceInCalendarDays(later, earlier)
  const duration = intervalToDuration({ start: earlier, end: later })
  const weeks = Math.floor(totalDays / 7)

  // NETWORKDAYS parity: differenceInBusinessDays is exclusive of the start date,
  // while NETWORKDAYS counts both endpoints — add the start back when it is a weekday.
  const networkdays =
    differenceInBusinessDays(later, earlier) + (isWeekend(earlier) ? 0 : 1)
  const businessDays = Math.max(0, networkdays - Math.min(holidayCount, networkdays))

  let weekendDays = 0
  for (let offset = 0; offset <= totalDays; offset++) {
    if (isWeekend(new Date(earlier.getFullYear(), earlier.getMonth(), earlier.getDate() + offset))) {
      weekendDays++
    }
  }

  return {
    totalDays,
    inclusiveDays: totalDays + 1,
    years: duration.years ?? 0,
    months: duration.months ?? 0,
    days: duration.days ?? 0,
    weeks,
    weekRemainderDays: totalDays % 7,
    businessDays,
    weekendDays,
  }
}

/** Parses a yyyy-MM-dd input value as local midnight, avoiding UTC shifts. */
export function parseDateInput(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const date = new Date(`${value}T00:00:00`)
  return Number.isNaN(date.getTime()) ? null : date
}

/** Formats a Date as a yyyy-MM-dd value for <input type="date">. */
export function toDateInputValue(date: Date): string {
  const year = String(date.getFullYear()).padStart(4, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}
