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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatDecimal, formatPercent } from "@/lib/format"
import { coefficientOfVariation, parseDataSet } from "@/lib/stats"

const DEFAULT_DATA = "10, 20, 30"

export function CoefficientOfVarianceCalculator() {
  const [raw, setRaw] = useState(DEFAULT_DATA)
  const [sample, setSample] = useState(true)

  const { values, invalid } = parseDataSet(raw)
  const needSample = sample && values.length < 2
  const result =
    values.length >= (sample ? 2 : 1) && !needSample
      ? coefficientOfVariation(values, sample)
      : null
  const valid = result !== null && invalid.length === 0

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Your data</CardTitle>
          <CardDescription>
            Compare volatility relative to the mean — works across different scales.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs
            value={sample ? "sample" : "population"}
            onValueChange={(value) => setSample(value === "sample")}
          >
            <TabsList className="w-full">
              <TabsTrigger value="sample" className="flex-1">
                Sample
              </TabsTrigger>
              <TabsTrigger value="population" className="flex-1">
                Population
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <DataSetField
            label="Data set"
            value={raw}
            onChange={setRaw}
            placeholder="e.g. 10, 20, 30"
          />
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => {
              setRaw(DEFAULT_DATA)
              setSample(true)
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
              label="Coefficient of variance"
              value={formatPercent(result.cvPercent)}
              sub="σ ÷ |mean| × 100 — relative volatility"
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <MetricTile label="Mean (μ)" value={formatDecimal(result.mean)} />
              <MetricTile
                label={sample ? "Sample SD (s)" : "Population SD (σ)"}
                value={formatDecimal(result.sd)}
                sub={sample ? "Divisor n − 1" : "Divisor n"}
              />
              <MetricTile
                label={sample ? "Sample variance (s²)" : "Population variance (σ²)"}
                value={formatDecimal(result.variance)}
              />
              <MetricTile label="Count (n)" value={`${values.length}`} />
            </div>

            <StepList
              steps={[
                { title: "Formula", body: "CV = (σ ÷ |μ|) × 100%" },
                {
                  title: "Substitute",
                  body: `(${formatDecimal(result.sd)} ÷ ${formatDecimal(Math.abs(result.mean))}) × 100%`,
                },
                {
                  title: "Result",
                  body: `CV = ${formatPercent(result.cvPercent)}`,
                },
              ]}
            />
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title={needSample ? "Sample mode needs at least 2 values" : "Enter your data"}
            description={
              needSample
                ? "Sample variance divides by n − 1, which requires two or more values — or switch to Population mode."
                : "The coefficient of variance appears here once your data is valid."
            }
          />
        )}
      </div>
    </div>
  )
}
