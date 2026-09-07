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
import { formatDecimal, formatNumber } from "@/lib/format"
import { harmonicMean, mean, parseDataSet } from "@/lib/stats"

const DEFAULT_DATA = "30, 60"

export function HarmonicMeanCalculator() {
  const [raw, setRaw] = useState(DEFAULT_DATA)

  const { values, invalid } = parseDataSet(raw)
  const hasNonPositive = values.some((x) => x <= 0)
  const hm = hasNonPositive ? null : harmonicMean(values)
  const valid = values.length >= 1 && hm !== null && invalid.length === 0
  const am = values.length > 0 ? mean(values) : null
  const reciprocalSum =
    values.length > 0 && !hasNonPositive
      ? values.reduce((total, x) => total + 1 / x, 0)
      : null

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Enter rate or ratio data</CardTitle>
          <CardDescription>
            Speeds, rates, ratios — data where a regular average quietly lies to you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <DataSetField
            label="Data set (comma separated)"
            value={raw}
            onChange={setRaw}
            hint="Preset loaded. Ideal for speeds & rates."
            placeholder="e.g. 30, 60"
            invalid={hasNonPositive}
          />
          {hasNonPositive ? (
            <p className="text-[11px] leading-snug text-destructive">
              The harmonic mean divides by each number — zero and negative values make
              the result undefined. Enter positive rates only.
            </p>
          ) : null}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => setRaw(DEFAULT_DATA)}
          >
            <IconRotate className="h-4 w-4" />
            Reset
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {valid && hm !== null && am !== null && reciprocalSum !== null ? (
          <ResultsRegion>
            <GradientHeroMetric
              label="Harmonic mean"
              value={formatNumber(hm)}
              sub="The true average of your rates — not the misleading arithmetic one"
            />

            <div className="grid gap-3 sm:grid-cols-3">
              <MetricTile
                label="Arithmetic mean"
                value={formatNumber(am)}
                sub="For comparison — always ≥ HM"
              />
              <MetricTile label="Count (n)" value={`${values.length}`} />
              <MetricTile
                label="Sum of reciprocals"
                value={formatDecimal(reciprocalSum, 4)}
                sub="Σ(1 ÷ xᵢ) — the denominator"
              />
            </div>

            <StepList
              steps={[
                { title: "Formula", body: "HM = n ÷ Σ(1 ÷ xᵢ)" },
                {
                  title: "Reciprocals",
                  body: values
                    .slice(0, 4)
                    .map((x) => `1/${formatDecimal(x, 0)} = ${formatDecimal(1 / x, 4)}`)
                    .join(" · ") + (values.length > 4 ? " · …" : ""),
                },
                {
                  title: "Result",
                  body: `${values.length} ÷ ${formatDecimal(reciprocalSum, 4)} = ${formatNumber(hm)}`,
                },
              ]}
            />

            <p className="text-xs leading-relaxed text-muted-foreground">
              The arithmetic mean of the same data is {formatNumber(am)} — but rates
              average by time, not by trip. The harmonic mean weighs every value by how
              long it holds, which is why it is always the lower, truer number.
            </p>
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter positive rates"
            description="The true average of your rates appears here instantly."
          />
        )}
      </div>
    </div>
  )
}
