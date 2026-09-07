"use client"

import { useState } from "react"
import { IconInfoCircle, IconRotate } from "@tabler/icons-react"

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
import { geometricMean, mean, parseDataSet } from "@/lib/stats"

const DEFAULT_DATA = "1, 3, 9, 27, 81"

export function GeometricMeanCalculator() {
  const [raw, setRaw] = useState(DEFAULT_DATA)

  const { values, invalid } = parseDataSet(raw)
  const negatives = values.filter((x) => x < 0).length
  const zeros = values.filter((x) => x === 0).length
  const positives = values.filter((x) => x > 0)

  const gm = negatives === 0 ? geometricMean(positives) : null
  const product = positives.reduce((total, x) => total * x, 1)
  const productFinite = Number.isFinite(product)
  const am = positives.length > 0 ? mean(positives) : null
  const valid = positives.length >= 1 && gm !== null && invalid.length === 0

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Enter data series</CardTitle>
          <CardDescription>
            Works with small ratios and large number sequences without overflow errors.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <DataSetField
            label="Data set (comma separated)"
            value={raw}
            onChange={setRaw}
            hint="Preset loaded. Supports integers & decimals."
            placeholder="e.g. 1, 3, 9, 27, 81"
            invalid={negatives > 0}
          />
          {negatives > 0 ? (
            <p className="text-[11px] leading-snug text-destructive">
              The geometric mean needs positive numbers — {negatives} negative{" "}
              {negatives === 1 ? "value" : "values"} in your data make the root
              undefined.
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
        {valid && gm !== null && am !== null ? (
          <ResultsRegion>
            <GradientHeroMetric
              label="Geometric mean"
              value={formatNumber(gm)}
              sub="Calculated with the logarithmic method — no overflow, full precision"
            />

            {zeros > 0 ? (
              <div className="flex items-start gap-2.5 rounded-xl border border-blue-500/30 bg-blue-500/10 p-3.5 text-xs leading-relaxed text-blue-700 dark:text-blue-400">
                <IconInfoCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  {zeros} zero{zeros === 1 ? "" : "s"} removed automatically. Mathematically,
                  any zero makes the full product — and the geometric mean — exactly 0.
                </p>
              </div>
            ) : null}

            <div className="grid gap-3 sm:grid-cols-3">
              <MetricTile
                label="Arithmetic mean"
                value={formatNumber(am)}
                sub="For comparison — GM is always ≤ AM"
              />
              <MetricTile label="Count (n)" value={`${positives.length}`} />
              <MetricTile
                label="Total product"
                value={productFinite ? formatNumber(product) : "Too large to show"}
                sub={productFinite ? "x₁ × x₂ × … × xₙ" : "Log method still computes the GM"}
              />
            </div>

            <StepList
              steps={[
                { title: "Formula", body: "GM = ⁿ√(x₁ · x₂ · … · xₙ)" },
                {
                  title: "Log method (what this tool runs)",
                  body: `GM = exp( (ln ${positives.slice(0, 4).map((x) => formatDecimal(x, 0)).join(" + ln ")}${positives.length > 4 ? " + …" : ""}) ÷ ${positives.length} )`,
                },
                { title: "Result", body: `GM = ${formatNumber(gm)}` },
              ]}
            />

            <p className="text-xs leading-relaxed text-muted-foreground">
              The arithmetic mean of the same data is {formatNumber(am)} — much higher,
              because addition-based averages get pulled up by large values while the
              geometric mean stays true to multiplicative growth.
            </p>
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter positive numbers"
            description="The geometric mean, arithmetic mean and total product appear here instantly."
          />
        )}
      </div>
    </div>
  )
}
