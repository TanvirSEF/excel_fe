"use client"

import { useState } from "react"
import { IconAlertTriangle, IconCircleCheck, IconRotate } from "@tabler/icons-react"

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
import { NumberField } from "@/components/site/calculators/field"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { parseNumericInput } from "@/lib/calculators"
import { formatDecimal, formatPercent } from "@/lib/format"
import { parseDataSet, sd } from "@/lib/stats"

const DEFAULT_DATA = "10, 15, 12, 18, 20, 14, 16"
const DEFAULT_STATS = { mean: "15", sd: "3.42" }

function cvVerdict(cv: number): {
  kind: "precision" | "moderate" | "volatile"
  text: string
} {
  if (cv < 10)
    return {
      kind: "precision",
      text: `High Precision — ${formatPercent(cv)} means your data points sit very close to the average.`,
    }
  if (cv < 30)
    return {
      kind: "moderate",
      text: `Moderate Spread — ${formatPercent(cv)} is standard variability, common in biological data or weather patterns.`,
    }
  return {
    kind: "volatile",
    text: `High Volatility — ${formatPercent(cv)} means your data is spread out widely and hard to predict.`,
  }
}

export function CoefficientOfVarianceCalculator() {
  const [mode, setMode] = useState<"raw" | "stats">("raw")
  const [raw, setRaw] = useState(DEFAULT_DATA)
  const [sample, setSample] = useState(true)
  const [known, setKnown] = useState(DEFAULT_STATS)

  const parsed = parseDataSet(raw)
  const values = parsed.values
  const rawMean = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : null
  const rawSd = values.length >= (sample ? 2 : 1) ? sd(values, sample) : null
  const rawCv = rawMean !== null && rawMean !== 0 && rawSd !== null ? (rawSd / Math.abs(rawMean)) * 100 : null

  const meanInput = parseNumericInput(known.mean)
  const sdInput = parseNumericInput(known.sd, { min: 0.000001 })
  const statsCv =
    meanInput.value !== null && meanInput.value !== 0 && sdInput.value !== null
      ? (sdInput.value! / Math.abs(meanInput.value!)) * 100
      : null

  const valid = mode === "raw" ? rawCv !== null && parsed.invalid.length === 0 : statsCv !== null
  const cv = mode === "raw" ? rawCv : statsCv
  const verdict = cv !== null ? cvVerdict(cv) : null

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Analyze data consistency</CardTitle>
          <CardDescription>
            Raw Data for a list of numbers — Known Statistics when the textbook already
            gives you the mean and standard deviation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs
            value={mode}
            onValueChange={(value) => setMode(value === "stats" ? "stats" : "raw")}
          >
            <TabsList className="w-full">
              <TabsTrigger value="raw" className="flex-1">
                Raw Data
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex-1">
                Known Stats
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {mode === "raw" ? (
            <>
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
                label="Enter data points"
                value={raw}
                onChange={setRaw}
                hint="Separate numbers with commas or spaces."
                placeholder="e.g. 10, 15, 12, 18, 20, 14, 16"
                invalid={rawMean === 0}
              />
              {rawMean === 0 ? (
                <p className="text-[11px] leading-snug text-destructive">
                  The mean of your data is zero — CV = σ ÷ mean is undefined. CV works
                  best with data that is always positive, like height, weight or prices.
                </p>
              ) : null}
            </>
          ) : (
            <>
              <NumberField
                label="Mean (μ)"
                value={known.mean}
                onChange={(value) => setKnown((k) => ({ ...k, mean: value }))}
                error={meanInput.error}
                hint="Cannot be zero"
                placeholder="15"
              />
              <NumberField
                label="Standard deviation (σ)"
                value={known.sd}
                onChange={(value) => setKnown((k) => ({ ...k, sd: value }))}
                error={sdInput.error}
                placeholder="3.42"
              />
            </>
          )}

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => {
              setRaw(DEFAULT_DATA)
              setSample(true)
              setKnown(DEFAULT_STATS)
            }}
          >
            <IconRotate className="h-4 w-4" />
            Reset
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {valid && cv !== null && verdict ? (
          <ResultsRegion>
            <GradientHeroMetric
              label="Coefficient of variation"
              value={formatPercent(cv)}
              sub="σ ÷ |μ| × 100 — relative volatility of your data"
            />

            <div
              className={`flex items-start gap-2.5 rounded-xl border p-3.5 text-xs leading-relaxed ${
                verdict.kind === "precision"
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                  : verdict.kind === "moderate"
                    ? "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400"
                    : "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400"
              }`}
            >
              {verdict.kind === "precision" ? (
                <IconCircleCheck className="mt-0.5 h-4 w-4 shrink-0" />
              ) : (
                <IconAlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              )}
              <p>{verdict.text}</p>
            </div>

            {mode === "raw" && rawMean !== null && rawSd !== null ? (
              <>
                <div className="grid gap-3 sm:grid-cols-3">
                  <MetricTile label="Mean (μ)" value={formatDecimal(rawMean)} />
                  <MetricTile
                    label={sample ? "Sample SD (s)" : "Population SD (σ)"}
                    value={formatDecimal(rawSd)}
                    sub={sample ? "Divisor n − 1" : "Divisor n"}
                  />
                  <MetricTile label="Count (n)" value={`${values.length}`} />
                </div>

                <StepList
                  steps={[
                    { title: "Mean", body: `Σx ÷ n = ${formatDecimal(rawMean)}` },
                    {
                      title: "Deviation & variance",
                      body: `Σ(x − μ)² ÷ ${sample ? "(n − 1)" : "n"} = ${formatDecimal(rawSd ** 2)} → σ = ${formatDecimal(rawSd)}`,
                    },
                    {
                      title: "CV",
                      body: `${formatDecimal(rawSd)} ÷ ${formatDecimal(Math.abs(rawMean))} × 100 = ${formatPercent(cv)}`,
                    },
                  ]}
                />
              </>
            ) : mode === "stats" && meanInput.value !== null && sdInput.value !== null ? (
              <div className="grid gap-3 sm:grid-cols-3">
                <MetricTile label="Mean (μ)" value={formatDecimal(meanInput.value)} sub="Your input" />
                <MetricTile
                  label="Standard deviation"
                  value={formatDecimal(sdInput.value)}
                  sub="Your input"
                />
                <MetricTile
                  label="CV"
                  value={formatPercent(statsCv ?? 0)}
                  sub="σ ÷ |μ| × 100"
                />
              </div>
            ) : null}
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title={
              mode === "raw"
                ? rawMean === 0
                  ? "Mean is zero — CV is undefined"
                  : sample && values.length < 2
                    ? "Sample mode needs at least 2 values"
                    : "Enter your data points"
                : "Enter the mean and standard deviation"
            }
            description={
              mode === "raw"
                ? "CV, mean, standard deviation and the volatility verdict appear here instantly."
                : "The CV and its volatility verdict appear here instantly."
            }
          />
        )}
      </div>
    </div>
  )
}
