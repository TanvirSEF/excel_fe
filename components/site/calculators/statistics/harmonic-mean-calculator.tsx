"use client"

import { useState } from "react"
import { IconRotate } from "@tabler/icons-react"

import { DataSetField } from "@/components/site/calculators/statistics/data-set-field"
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
import { formatDecimal } from "@/lib/format"
import { geometricMean, harmonicMean, mean, parseDataSet } from "@/lib/stats"

const DEFAULT_DATA = "40, 60"

export function HarmonicMeanCalculator() {
  const [raw, setRaw] = useState(DEFAULT_DATA)

  const { values, invalid } = parseDataSet(raw)
  const hasNonPositive = values.some((x) => x <= 0)
  const hm = hasNonPositive ? null : harmonicMean(values)
  const gm = hasNonPositive ? null : geometricMean(values)
  const valid = values.length >= 1 && hm !== null && invalid.length === 0

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Your rates</CardTitle>
          <CardDescription>
            Positive numbers only — ideal for speeds, prices per unit and other rates.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <DataSetField
            label="Data set (rates)"
            value={raw}
            onChange={setRaw}
            placeholder="e.g. 40, 60"
            invalid={hasNonPositive}
          />
          {hasNonPositive ? (
            <p className="text-[11px] leading-snug text-destructive">
              The harmonic mean only exists for positive numbers — every value must be
              greater than zero.
            </p>
          ) : null}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => setRaw(DEFAULT_DATA)}
          >
            <IconRotate className="h-4 w-4" />
            Reset to example
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {valid && hm !== null ? (
          <ResultsRegion>
            <GradientHeroMetric
              label="Harmonic mean"
              value={formatDecimal(hm)}
              sub="n ÷ Σ(1 ÷ xᵢ) — the correct average for rates"
            />

            <div className="grid gap-3 sm:grid-cols-3">
              <MetricTile label="Count (n)" value={`${values.length}`} />
              <MetricTile
                label="Arithmetic mean"
                value={formatDecimal(mean(values))}
                sub="For comparison — always ≥ HM"
              />
              <MetricTile
                label="Geometric mean"
                value={gm !== null ? formatDecimal(gm) : "—"}
                sub="Sits between AM and HM"
              />
            </div>

            <StepList
              steps={[
                { title: "Formula", body: "HM = n ÷ (1/x₁ + 1/x₂ + … + 1/xₙ)" },
                {
                  title: "Substitute",
                  body: `${values.length} ÷ (${values.slice(0, 4).map((x) => `1/${formatDecimal(x, 0)}`).join(" + ")}${values.length > 4 ? " + …" : ""})`,
                },
                { title: "Result", body: `HM = ${formatDecimal(hm)}` },
              ]}
            />

            <p className="text-xs leading-relaxed text-muted-foreground">
              Example: driving 100 km at 40 km/h and then 100 km back at 60 km/h
              averages exactly {formatDecimal(hm)} km/h — not 50. The harmonic mean
              weights each rate by the time it takes.
            </p>
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter positive rates"
            description="The harmonic mean appears here as soon as you enter one or more positive values."
          />
        )}
      </div>
    </div>
  )
}
