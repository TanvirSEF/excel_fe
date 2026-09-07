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
import { parseDataSet, pooledVariance } from "@/lib/stats"

const DEFAULT_A = "1, 2, 3"
const DEFAULT_B = "3, 5, 7"

export function PooledVarianceCalculator() {
  const [rawA, setRawA] = useState(DEFAULT_A)
  const [rawB, setRawB] = useState(DEFAULT_B)

  const a = parseDataSet(rawA)
  const b = parseDataSet(rawB)
  const tooSmall = a.values.length < 2 || b.values.length < 2
  const result = tooSmall ? null : pooledVariance(a.values, b.values)
  const valid = result !== null && a.invalid.length === 0 && b.invalid.length === 0

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Two groups</CardTitle>
          <CardDescription>
            Each group needs at least 2 values — the pooled estimate weights by group
            size.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <DataSetField label="Group 1 (X)" value={rawA} onChange={setRawA} placeholder="e.g. 1, 2, 3" />
          <DataSetField label="Group 2 (Y)" value={rawB} onChange={setRawB} placeholder="e.g. 3, 5, 7" />
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => {
              setRawA(DEFAULT_A)
              setRawB(DEFAULT_B)
            }}
          >
            <IconRotate className="h-4 w-4" />
            Reset to example
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {valid && result ? (
          <ResultsRegion>
            <GradientHeroMetric
              label="Pooled variance (s²p)"
              value={formatDecimal(result.pooled)}
              sub="The weighted average of both group variances"
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <MetricTile
                label="Group 1 variance (s₁²)"
                value={formatDecimal(result.v1)}
                sub={`n₁ = ${result.n1}`}
              />
              <MetricTile
                label="Group 2 variance (s₂²)"
                value={formatDecimal(result.v2)}
                sub={`n₂ = ${result.n2}`}
              />
              <MetricTile
                label="Pooled SD (sp)"
                value={formatDecimal(result.pooledSd)}
                sub="√pooled variance"
              />
              <MetricTile
                label="Total observations"
                value={`${result.n1 + result.n2}`}
                sub={`df = ${result.n1 + result.n2 - 2}`}
              />
            </div>

            <StepList
              steps={[
                {
                  title: "Formula",
                  body: "s²p = ((n₁−1)s₁² + (n₂−1)s₂²) ÷ (n₁+n₂−2)",
                },
                {
                  title: "Substitute",
                  body: `((${result.n1}−1)×${formatDecimal(result.v1)} + (${result.n2}−1)×${formatDecimal(result.v2)}) ÷ (${result.n1}+${result.n2}−2)`,
                },
                {
                  title: "Result",
                  body: `s²p = ${formatDecimal(result.pooled)}`,
                },
              ]}
            />
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title={tooSmall ? "Each group needs at least 2 values" : "Enter two data sets"}
            description="Pooled variance feeds the two-sample T-Test — enter both groups above."
          />
        )}
      </div>
    </div>
  )
}
