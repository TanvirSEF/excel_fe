"use client"

import { useState } from "react"
import { IconRotate } from "@tabler/icons-react"

import { DateField, NumberField } from "@/components/site/calculators/field"
import {
  GradientHeroMetric,
  MetricTile,
  ResultsPlaceholder,
  ResultsRegion,
} from "@/components/site/calculators/result-metrics"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { parseNumericInput } from "@/lib/calculators"
import {
  calculateDateDifference,
  parseDateInput,
} from "@/lib/calc-dates"
import { formatNumber } from "@/lib/format"

// Fixed example range keeps the page deterministic for static prerendering.
const DEFAULTS = {
  start: "2026-01-01",
  end: "2026-12-31",
  holidays: "0",
}

export function DateDifferenceCalculator() {
  const [start, setStart] = useState(DEFAULTS.start)
  const [end, setEnd] = useState(DEFAULTS.end)
  const [holidays, setHolidays] = useState(DEFAULTS.holidays)

  const startDate = parseDateInput(start)
  const endDate = parseDateInput(end)
  const holidaysInput = parseNumericInput(holidays, {
    min: 0,
    max: 100000,
    integer: true,
  })

  const result =
    !startDate || !endDate || holidaysInput.value === null
      ? null
      : calculateDateDifference({
          start: startDate,
          end: endDate,
          holidayCount: holidaysInput.value,
        })

  const invalid =
    (start !== "" && !startDate) ||
    (end !== "" && !endDate) ||
    Boolean(holidaysInput.error)

  function reset() {
    setStart(DEFAULTS.start)
    setEnd(DEFAULTS.end)
    setHolidays(DEFAULTS.holidays)
  }

  const duration = result
    ? `${result.years}y ${result.months}m ${result.days}d`
    : "—"

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Dates</CardTitle>
          <CardDescription>
            Counts both endpoints, like Excel&apos;s NETWORKDAYS. Order
            doesn&apos;t matter — the range is normalized.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <DateField label="Start date" value={start} onChange={setStart} />
          <DateField label="End date" value={end} onChange={setEnd} />
          <NumberField
            label="Weekday holidays to exclude"
            value={holidays}
            onChange={setHolidays}
            error={holidaysInput.error}
            hint="How many holiday dates fall on weekdays inside this range"
            suffix="days"
            placeholder="0"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={reset}
            className="w-full gap-1.5"
          >
            <IconRotate className="h-3.5 w-3.5" />
            Reset to example
          </Button>
        </CardContent>
      </Card>

      <div className="lg:col-span-3">
        {result && !invalid ? (
          <div className="space-y-3 lg:sticky lg:top-24">
            <ResultsRegion>
              <GradientHeroMetric
                label="Business days (NETWORKDAYS)"
                value={formatNumber(result.businessDays)}
                sub={
                  holidaysInput.value
                    ? `Excludes weekends and ${formatNumber(holidaysInput.value)} weekday holidays`
                    : "Excludes weekends (Sat & Sun)"
                }
              />
              <div className="grid grid-cols-2 gap-3">
                <MetricTile
                  label="Duration"
                  value={duration}
                  sub="Years / months / days"
                />
                <MetricTile
                  label="Calendar days"
                  value={formatNumber(result.totalDays)}
                  sub={`${formatNumber(result.inclusiveDays)} inclusive of both dates`}
                />
                <MetricTile
                  label="Weeks"
                  value={`${formatNumber(result.weeks)}w ${formatNumber(result.weekRemainderDays)}d`}
                  sub="Total weeks plus leftover days"
                />
                <MetricTile
                  label="Weekend days"
                  value={formatNumber(result.weekendDays)}
                  sub="Saturdays and Sundays in range"
                />
              </div>
            </ResultsRegion>
          </div>
        ) : (
          <ResultsPlaceholder
            title={invalid ? "Fix the highlighted fields" : "Pick two dates"}
            description="Total days, weeks, months and NETWORKDAYS-style business days appear here as soon as both dates are set."
          />
        )}
      </div>
    </div>
  )
}
