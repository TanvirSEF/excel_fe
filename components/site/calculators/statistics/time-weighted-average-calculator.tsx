"use client"

import { useState } from "react"
import { IconPlus, IconRotate, IconX } from "@tabler/icons-react"

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
import { parseNumericInput } from "@/lib/calculators"
import { formatDecimal } from "@/lib/format"
import { weightedMean } from "@/lib/stats"

interface PeriodRow {
  value: string
  period: string
}

const DEFAULT_ROWS: PeriodRow[] = [
  { value: "8", period: "3" },
  { value: "6", period: "9" },
]

export function TimeWeightedAverageCalculator() {
  const [rows, setRows] = useState<PeriodRow[]>(DEFAULT_ROWS)

  const parsed = rows.map((row) => ({
    value: parseNumericInput(row.value),
    period: parseNumericInput(row.period, { min: 0 }),
  }))

  const validPairs = parsed
    .map((p, index) => ({ ...p, index }))
    .filter((p) => p.value.value !== null && p.period.value !== null)
    .map((p) => ({
      value: p.value.value as number,
      weight: p.period.value as number,
    }))

  const periodSum = validPairs.reduce((total, p) => total + p.weight, 0)
  const weightedTotal = validPairs.reduce((total, p) => total + p.value * p.weight, 0)
  const twa = weightedMean(validPairs)

  function updateRow(index: number, key: keyof PeriodRow, value: string) {
    setRows((current) =>
      current.map((row, i) => (i === index ? { ...row, [key]: value } : row))
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Values & periods</CardTitle>
          <CardDescription>
            Each value with how long it held — months, days, or any consistent unit.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {rows.map((row, index) => {
              const valueError =
                parsed[index].value.value === null && row.value !== ""
                  ? parsed[index].value.error
                  : null
              const periodError =
                parsed[index].period.value === null && row.period !== ""
                  ? parsed[index].period.error
                  : null
              return (
                <div key={index} className="flex items-end gap-2">
                  <div className="min-w-0 flex-1">
                    <NumberField
                      label="Value"
                      value={row.value}
                      onChange={(value) => updateRow(index, "value", value)}
                      error={valueError}
                      placeholder="8"
                    />
                  </div>
                  <div className="w-32">
                    <NumberField
                      label="Period"
                      value={row.period}
                      onChange={(value) => updateRow(index, "period", value)}
                      error={periodError}
                      placeholder="3"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mb-0.5 shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() =>
                      setRows((current) =>
                        current.length > 1
                          ? current.filter((_, i) => i !== index)
                          : current
                      )
                    }
                    aria-label={`Remove row ${index + 1}`}
                  >
                    <IconX className="h-4 w-4" />
                  </Button>
                </div>
              )
            })}
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => setRows((current) => [...current, { value: "", period: "" }])}
          >
            <IconPlus className="h-4 w-4" />
            Add another period
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => setRows(DEFAULT_ROWS)}
          >
            <IconRotate className="h-4 w-4" />
            Reset to example
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {twa !== null ? (
          <ResultsRegion>
            <GradientHeroMetric
              label="Time-weighted average"
              value={formatDecimal(twa)}
              sub="Σ(value × period) ÷ Σ(periods)"
            />

            <div className="grid gap-3 sm:grid-cols-3">
              <MetricTile label="Total period" value={formatDecimal(periodSum, 0)} />
              <MetricTile
                label="Σ(value × period)"
                value={formatDecimal(weightedTotal, 1)}
                sub="Unnormalized weighted total"
              />
              <MetricTile
                label="Periods entered"
                value={`${validPairs.length}`}
                sub={`${rows.length - validPairs.length} ignored (invalid or empty)`}
              />
            </div>

            <StepList
              steps={[
                { title: "Formula", body: "TWA = Σ(valueᵢ × periodᵢ) ÷ Σ(periodᵢ)" },
                {
                  title: "Substitute",
                  body: `(${validPairs.map((p) => `${formatDecimal(p.value, 0)}×${formatDecimal(p.weight, 0)}`).join(" + ")}) ÷ ${formatDecimal(periodSum, 0)}`,
                },
                {
                  title: "Result",
                  body: `${formatDecimal(weightedTotal, 1)} ÷ ${formatDecimal(periodSum, 0)} = ${formatDecimal(twa)}`,
                },
              ]}
            />
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter values and period lengths"
            description="The time-weighted average appears here once at least one valid value-period pair exists."
          />
        )}
      </div>
    </div>
  )
}
