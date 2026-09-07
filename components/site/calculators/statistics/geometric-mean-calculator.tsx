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
import { geometricMean, mean, parseDataSet } from "@/lib/stats"

const DEFAULT_DATA = "2, 18"

export function GeometricMeanCalculator() {
  const [raw, setRaw] = useState(DEFAULT_DATA)

  const { values, invalid } = parseDataSet(raw)
  const hasNonPositive = values.some((x) => x <= 0)
  const gm = hasNonPositive ? null : geometricMean(values)
  const valid = values.length >= 1 && gm !== null && invalid.length === 0

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Your data</CardTitle>
          <CardDescription>
            Positive numbers only — separate them with commas, spaces or new lines.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <DataSetField
            label="Data set"
            value={raw}
            onChange={setRaw}
            placeholder="e.g. 2, 8, 18, 40"
            invalid={hasNonPositive}
          />
          {hasNonPositive ? (
            <p className="text-[11px] leading-snug text-destructive">
              The geometric mean only exists for positive numbers — every value must be
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
        {valid && gm !== null ? (
          <ResultsRegion>
            <GradientHeroMetric
              label="Geometric mean"
              value={formatDecimal(gm)}
              sub="The n-th root of the product of your numbers"
            />

            <div className="grid gap-3 sm:grid-cols-3">
              <MetricTile label="Count (n)" value={`${values.length}`} />
              <MetricTile
                label="Arithmetic mean"
                value={formatDecimal(mean(values))}
                sub="For comparison — always ≥ GM"
              />
              <MetricTile
                label="GM ÷ AM"
                value={formatDecimal(gm / mean(values))}
                sub="1 when all values are equal"
              />
            </div>

            <StepList
              steps={[
                { title: "Formula", body: "GM = ⁿ√(x₁ · x₂ · … · xₙ)" },
                {
                  title: "Log-domain shortcut",
                  body: `GM = exp( (ln ${values.slice(0, 4).map((x) => formatDecimal(x, 0)).join(" + ln ")}${values.length > 4 ? " + …" : ""}) ÷ ${values.length} )`,
                },
                { title: "Result", body: `GM = ${formatDecimal(gm)}` },
              ]}
            />
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter positive numbers"
            description="The geometric mean is perfect for growth rates and investment returns — enter at least one positive value."
          />
        )}
      </div>
    </div>
  )
}
