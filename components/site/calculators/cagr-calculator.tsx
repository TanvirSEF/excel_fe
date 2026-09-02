"use client"

import { useState } from "react"
import { IconRotate } from "@tabler/icons-react"

import { CopyTableButton } from "@/components/site/calculators/copy-table-button"
import { DateField, NumberField } from "@/components/site/calculators/field"
import { ProjectionChart } from "@/components/site/calculators/projection-chart"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { parseNumericInput } from "@/lib/calculators"
import { calculateCagr, yearsBetweenDates } from "@/lib/calc-cagr"
import { parseDateInput } from "@/lib/calc-dates"
import {
  formatCurrency,
  formatMultiple,
  formatPercent,
} from "@/lib/format"

const DEFAULTS = {
  startValue: "100000",
  endValue: "200000",
  years: "5",
  // Fixed example dates (exactly 5 years apart) keep the page deterministic
  // for static prerendering.
  startDate: "2020-01-01",
  endDate: "2025-01-01",
}

export function CagrCalculator() {
  const [mode, setMode] = useState<"years" | "dates">("years")
  const [startValue, setStartValue] = useState(DEFAULTS.startValue)
  const [endValue, setEndValue] = useState(DEFAULTS.endValue)
  const [years, setYears] = useState(DEFAULTS.years)
  const [startDate, setStartDate] = useState(DEFAULTS.startDate)
  const [endDate, setEndDate] = useState(DEFAULTS.endDate)

  const startInput = parseNumericInput(startValue, { min: 0.01 })
  const endInput = parseNumericInput(endValue, { min: 0.01 })
  const yearsInput = parseNumericInput(years, { min: 0.01, max: 100 })
  const startDateParsed = parseDateInput(startDate)
  const endDateParsed = parseDateInput(endDate)

  const span =
    startDateParsed && endDateParsed
      ? yearsBetweenDates(
          startDateParsed <= endDateParsed ? startDateParsed : endDateParsed,
          startDateParsed <= endDateParsed ? endDateParsed : startDateParsed
        )
      : null

  const effectiveYears =
    mode === "years" ? yearsInput.value : span && span > 0 ? span : null

  const result =
    !startInput.value || !endInput.value || !effectiveYears
      ? null
      : calculateCagr({
          startValue: startInput.value,
          endValue: endInput.value,
          years: effectiveYears,
        })

  const invalid =
    Boolean(startInput.error) ||
    Boolean(endInput.error) ||
    (mode === "years" && Boolean(yearsInput.error)) ||
    (mode === "dates" && ((startDate !== "" && !startDateParsed) || (endDate !== "" && !endDateParsed)))

  const copyRows = result
    ? [
        ["Year", "Projected value", "Growth from start"],
        ...result.projection.map((row) => [
          String(row.year),
          row.value.toFixed(2),
          `${row.growthFromStart.toFixed(2)}%`,
        ]),
      ]
    : []

  function reset() {
    setStartValue(DEFAULTS.startValue)
    setEndValue(DEFAULTS.endValue)
    setYears(DEFAULTS.years)
    setStartDate(DEFAULTS.startDate)
    setEndDate(DEFAULTS.endDate)
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Growth inputs</CardTitle>
            <CardDescription>
              A declining value is valid — CAGR simply comes out negative.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs
              value={mode}
              onValueChange={(value) =>
                setMode(value === "dates" ? "dates" : "years")
              }
            >
              <TabsList className="w-full">
                <TabsTrigger value="years" className="flex-1">
                  Number of years
                </TabsTrigger>
                <TabsTrigger value="dates" className="flex-1">
                  Between dates
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <NumberField
              label="Starting value"
              value={startValue}
              onChange={setStartValue}
              error={startInput.error}
              hint="Revenue, investment or any metric"
              suffix="$"
              placeholder="100,000"
            />
            <NumberField
              label="Ending value"
              value={endValue}
              onChange={setEndValue}
              error={endInput.error}
              hint="Where it ended up"
              suffix="$"
              placeholder="200,000"
            />

            {mode === "years" ? (
              <NumberField
                label="Years elapsed"
                value={years}
                onChange={setYears}
                error={yearsInput.error}
                hint="Fractional years are fine, e.g. 2.5"
                suffix="yrs"
                placeholder="5"
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <DateField
                  label="Start date"
                  value={startDate}
                  onChange={setStartDate}
                />
                <DateField
                  label="End date"
                  value={endDate}
                  onChange={setEndDate}
                />
              </div>
            )}

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
                  label="CAGR"
                  value={formatPercent(result.cagrPercent)}
                  sub={`Compounded annually over ${effectiveYears ? effectiveYears.toFixed(effectiveYears < 10 ? 1 : 0) : "—"} years`}
                />
                <div className="grid grid-cols-2 gap-3">
                  <MetricTile
                    label="Absolute growth"
                    value={formatPercent(result.absoluteGrowthPercent)}
                    sub="Total change across the period"
                  />
                  <MetricTile
                    label="Growth multiple"
                    value={formatMultiple(result.multiple)}
                    sub="End value ÷ start value"
                  />
                  <MetricTile
                    label="Start value"
                    value={formatCurrency(startInput.value ?? 0, 0)}
                  />
                  <MetricTile
                    label="End value"
                    value={formatCurrency(endInput.value ?? 0, 0)}
                  />
                </div>
              </ResultsRegion>
            </div>
          ) : (
            <ResultsPlaceholder
              title={invalid ? "Fix the highlighted fields" : "Enter both values"}
              description="Compound annual growth rate and a year-by-year projection appear here as soon as the inputs are valid."
            />
          )}
        </div>
      </div>

      {result ? (
        <Card>
          <CardHeader className="flex-row items-start justify-between gap-4">
            <div className="space-y-1.5">
              <CardTitle>Growth projection</CardTitle>
              <CardDescription>
                Where the start value lands each year when compounding at this
                exact rate.
              </CardDescription>
            </div>
            <CopyTableButton rows={copyRows} />
          </CardHeader>
          <CardContent className="space-y-6">
            <ProjectionChart projection={result.projection} />

            <div className="max-h-96 overflow-auto rounded-xl border border-border/70">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-muted">
                  <TableRow>
                    <TableHead className="text-right">Year</TableHead>
                    <TableHead className="text-right">Projected value</TableHead>
                    <TableHead className="text-right">Growth from start</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.projection.map((row) => (
                    <TableRow key={row.year}>
                      <TableCell className="text-right font-mono text-xs tabular-nums">
                        {row.year}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs tabular-nums font-medium">
                        {formatCurrency(row.value)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs tabular-nums text-muted-foreground">
                        {formatPercent(row.growthFromStart, 1)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
