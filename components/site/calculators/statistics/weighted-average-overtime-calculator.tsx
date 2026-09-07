"use client"

import { useState } from "react"
import { IconAlertTriangle, IconCircleCheck, IconPlus, IconRotate, IconX } from "@tabler/icons-react"

import { NumberField } from "@/components/site/calculators/field"
import { StepList } from "@/components/site/calculators/statistics/step-list"
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
import { Input } from "@/components/ui/input"
import { parseNumericInput } from "@/lib/calculators"
import { formatCurrency, formatDecimal } from "@/lib/format"

interface JobRow {
  description: string
  hours: string
  rate: string
}

const DEFAULT_ROWS: JobRow[] = [
  { description: "Regular Shift", hours: "35", rate: "20" },
  { description: "Weekend Shift", hours: "10", rate: "25" },
]

const DEFAULTS = { bonus: "100", threshold: "40" }

export function WeightedAverageOvertimeCalculator() {
  const [rows, setRows] = useState<JobRow[]>(DEFAULT_ROWS)
  const [bonus, setBonus] = useState(DEFAULTS.bonus)
  const [threshold, setThreshold] = useState(DEFAULTS.threshold)

  const parsed = rows.map((row) => ({
    hours: parseNumericInput(row.hours, { min: 0 }),
    rate: parseNumericInput(row.rate, { min: 0 }),
  }))

  const bonusInput = parseNumericInput(bonus, { min: 0 })
  const thresholdInput = parseNumericInput(threshold, { min: 0 })

  const validJobs = parsed
    .map((p, i) => ({ ...p, index: i }))
    .filter((p) => p.hours.value !== null && p.rate.value !== null)

  const totalHours = validJobs.reduce((t, p) => t + p.hours.value!, 0)
  const totalStraight =
    validJobs.reduce((t, p) => t + p.hours.value! * p.rate.value!, 0) +
    (bonusInput.value ?? 0)
  const regularRate = totalHours > 0 ? totalStraight / totalHours : 0
  const otHours =
    thresholdInput.value !== null ? Math.max(0, totalHours - thresholdInput.value) : 0
  const otPremium = otHours * regularRate * 0.5
  const gross = totalStraight + otPremium

  const valid =
    validJobs.length > 0 &&
    totalHours > 0 &&
    bonusInput.value !== null &&
    thresholdInput.value !== null

  const overtime = otHours > 0

  function updateRow(index: number, key: keyof JobRow, value: string) {
    setRows((current) =>
      current.map((row, i) => (i === index ? { ...row, [key]: value } : row))
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Enter work hours &amp; rates</CardTitle>
          <CardDescription>
            Each job or shift with its hours and pay rate — plus any non-discretionary
            bonus that must be included in the regular rate.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {rows.map((row, index) => {
              const hoursError =
                parsed[index].hours.value === null && row.hours !== ""
                  ? parsed[index].hours.error
                  : null
              const rateError =
                parsed[index].rate.value === null && row.rate !== ""
                  ? parsed[index].rate.error
                  : null
              return (
                <div key={index} className="space-y-2 rounded-xl border border-border/70 bg-muted/20 p-3">
                  <div className="flex items-center gap-2">
                    <Input
                      value={row.description}
                      onChange={(event) => updateRow(index, "description", event.target.value)}
                      placeholder="e.g. Regular Shift"
                      className="h-8 bg-background text-xs font-medium"
                      aria-label={`Job ${index + 1} description`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={() =>
                        setRows((current) =>
                          current.length > 1
                            ? current.filter((_, i) => i !== index)
                            : current
                        )
                      }
                      aria-label={`Remove ${row.description || `job ${index + 1}`}`}
                    >
                      <IconX className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="min-w-0 flex-1">
                      <NumberField
                        label="Hours"
                        value={row.hours}
                        onChange={(v) => updateRow(index, "hours", v)}
                        error={hoursError}
                        placeholder="35"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <NumberField
                        label="Rate"
                        value={row.rate}
                        onChange={(v) => updateRow(index, "rate", v)}
                        error={rateError}
                        suffix="$"
                        placeholder="20"
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() =>
              setRows((current) => [...current, { description: "", hours: "", rate: "" }])
            }
          >
            <IconPlus className="h-4 w-4" />
            Add job / rate
          </Button>

          <NumberField
            label="Total bonus ($)"
            value={bonus}
            onChange={setBonus}
            error={bonusInput.error}
            hint="Non-discretionary — commissions, attendance, production"
            suffix="$"
            placeholder="100"
          />

          <NumberField
            label="Overtime threshold"
            value={threshold}
            onChange={setThreshold}
            error={thresholdInput.error}
            hint="Weekly hours limit — usually 40"
            placeholder="40"
          />

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => {
              setRows(DEFAULT_ROWS)
              setBonus(DEFAULTS.bonus)
              setThreshold(DEFAULTS.threshold)
            }}
          >
            <IconRotate className="h-4 w-4" />
            Reset
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {valid ? (
          <ResultsRegion>
            <GradientHeroMetric
              label="Total gross pay"
              value={formatCurrency(gross)}
              sub={`Weighted rate: ${formatCurrency(regularRate)}/hr across ${formatDecimal(totalHours, 0)} hours`}
            />

            {overtime ? (
              <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs leading-relaxed text-emerald-700 dark:text-emerald-400">
                <IconCircleCheck className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  Overtime active: {formatDecimal(otHours, 2)} hrs at the weighted
                  half-time premium of {formatCurrency(regularRate * 0.5)}/hr.
                </p>
              </div>
            ) : (
              <div className="flex items-start gap-2.5 rounded-xl border border-border/70 bg-muted/20 p-3.5 text-xs leading-relaxed text-muted-foreground">
                <IconAlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  No overtime — total hours ({formatDecimal(totalHours, 0)}) stay within
                  the {threshold}h threshold. Gross pay equals straight-time pay.
                </p>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <MetricTile
                label="Total straight time"
                value={formatCurrency(totalStraight)}
                sub={`All jobs + ${formatCurrency(bonusInput.value ?? 0)} bonus`}
              />
              <MetricTile
                label="Total hours worked"
                value={formatDecimal(totalHours, 2)}
                sub={`${formatDecimal(Math.max(0, thresholdInput.value! - totalHours), 1)}h below threshold`}
              />
              <MetricTile
                label="Overtime premium"
                value={formatCurrency(otPremium)}
                sub={`${formatDecimal(otHours, 2)} hrs × ${formatCurrency(regularRate)} × 0.5`}
              />
              <MetricTile
                label="Overtime hours"
                value={formatDecimal(otHours, 2)}
                sub={`Hours beyond ${thresholdInput.value}h`}
              />
            </div>

            <StepList
              steps={[
                {
                  title: "Step 1 — Total straight-time pay",
                  body: validJobs
                    .map((p) => `${formatDecimal(p.hours.value!, 0)}×${formatCurrency(p.rate.value!, 0)}`)
                    .join(" + ") +
                    ` + ${formatCurrency(bonusInput.value ?? 0, 0)} bonus = ${formatCurrency(totalStraight)}`,
                },
                {
                  title: "Step 2 — Regular rate (blended)",
                  body: `${formatCurrency(totalStraight)} ÷ ${formatDecimal(totalHours, 0)} hrs = ${formatCurrency(regularRate)}/hr`,
                },
                {
                  title: "Step 3 — Overtime premium (half-time)",
                  body: overtime
                    ? `${formatDecimal(otHours, 1)} OT hrs × ${formatCurrency(regularRate)} × 0.5 = ${formatCurrency(otPremium)}`
                    : "No hours beyond threshold — premium is $0",
                },
                {
                  title: "Step 4 — Gross pay",
                  body: `${formatCurrency(totalStraight)} + ${formatCurrency(otPremium)} = ${formatCurrency(gross)}`,
                },
              ]}
            />
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter hours and rates for each job"
            description="The blended rate, overtime premium and total gross pay appear here."
          />
        )}
      </div>
    </div>
  )
}
