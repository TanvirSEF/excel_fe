"use client"

import { useState } from "react"
import { IconRotate } from "@tabler/icons-react"

import { NumberField } from "@/components/site/calculators/field"
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
import { parseNumericInput } from "@/lib/calculators"
import { formatDecimal, formatPercent } from "@/lib/format"
import { normalCdf } from "@/lib/stats"

export function ZScoreToPercentileCalculator() {
  const [mode, setMode] = useState<"direct" | "raw">("direct")
  const [z, setZ] = useState("1.96")
  const [score, setScore] = useState("130")
  const [mean, setMean] = useState("100")
  const [sd, setSd] = useState("15")

  const zInput = parseNumericInput(z)
  const scoreInput = parseNumericInput(score)
  const meanInput = parseNumericInput(mean)
  const sdInput = parseNumericInput(sd, { min: 0.000001 })

  const zValue =
    mode === "direct"
      ? zInput.value
      : scoreInput.value !== null && meanInput.value !== null && sdInput.value !== null
        ? (scoreInput.value - meanInput.value) / sdInput.value
        : null
  const valid = zValue !== null && Number.isFinite(zValue)
  const percentile = valid ? normalCdf(zValue) : null

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Z-score input</CardTitle>
          <CardDescription>
            Convert a Z-score into its percentile rank on the standard normal curve.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs
            value={mode}
            onValueChange={(value) => setMode(value === "raw" ? "raw" : "direct")}
          >
            <TabsList className="w-full">
              <TabsTrigger value="direct" className="flex-1">
                Direct z
              </TabsTrigger>
              <TabsTrigger value="raw" className="flex-1">
                Raw score
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {mode === "direct" ? (
            <NumberField
              label="Z-score"
              value={z}
              onChange={setZ}
              error={zInput.error}
              hint="Standard deviations from the mean"
              placeholder="1.96"
            />
          ) : (
            <>
              <NumberField
                label="Raw score (x)"
                value={score}
                onChange={setScore}
                error={scoreInput.error}
                placeholder="130"
              />
              <NumberField
                label="Mean (μ)"
                value={mean}
                onChange={setMean}
                error={meanInput.error}
                placeholder="100"
              />
              <NumberField
                label="Standard deviation (σ)"
                value={sd}
                onChange={setSd}
                error={sdInput.error}
                hint="Must be greater than zero"
                placeholder="15"
              />
            </>
          )}

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => {
              setMode("direct")
              setZ("1.96")
              setScore("130")
              setMean("100")
              setSd("15")
            }}
          >
            <IconRotate className="h-4 w-4" />
            Reset to example
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {valid && zValue !== null && percentile !== null ? (
          <ResultsRegion>
            <GradientHeroMetric
              label="Percentile rank"
              value={formatPercent(percentile, 2)}
              sub={`z = ${formatDecimal(zValue, 2)} — area below on the bell curve`}
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <MetricTile
                label="Area below (Φ(z))"
                value={formatDecimal(percentile)}
                sub="Share of the population under this score"
              />
              <MetricTile
                label="Area above"
                value={formatPercent(1 - percentile)}
                sub={`Top ${formatPercent(1 - percentile, 2)}`}
              />
              <MetricTile
                label="Between ±|z|"
                value={formatPercent(2 * percentile - 1)}
                sub="Central area of the curve"
              />
              <MetricTile
                label="Z-score used"
                value={formatDecimal(zValue, 2)}
                sub={mode === "raw" ? "(x − μ) ÷ σ" : "Direct input"}
              />
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground">
              A percentile of {formatPercent(percentile, 2)} means{" "}
              {formatPercent(percentile, 0)} of the population scores below this value —
              roughly the top {formatPercent(Math.max(1 - percentile, 0.0001), 2)}.
            </p>
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter a Z-score"
            description="Switch to Raw score mode to derive z from a score, mean and standard deviation."
          />
        )}
      </div>
    </div>
  )
}
