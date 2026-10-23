"use client"

import { useState } from "react"
import { IconRotate } from "@tabler/icons-react"

import { NumberField } from "@/components/site/calculators/field"
import { NormalCurveChart } from "@/components/site/calculators/normal-curve-chart"
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
  const [z, setZ] = useState("1.645")
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

  const verdict =
    percentile !== null
      ? percentile > 0.5
        ? { kind: "above" as const, text: "Above Average: You outperformed the mean." }
        : percentile < 0.5
          ? { kind: "below" as const, text: "Below Average: You fell short of the mean." }
          : { kind: "at" as const, text: "Exactly Average: You are at the mean." }
      : null

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Enter z-score value</CardTitle>
            <CardDescription>
              Or switch to Raw Score mode to derive z from a score, mean and SD.
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
                hint="Preset loaded (95th Perc.)"
                placeholder="1.645"
              />
            ) : (
              <>
                <NumberField label="Raw score (x)" value={score} onChange={setScore} error={scoreInput.error} placeholder="130" />
                <NumberField label="Mean (μ)" value={mean} onChange={setMean} error={meanInput.error} placeholder="100" />
                <NumberField label="Standard deviation (σ)" value={sd} onChange={setSd} error={sdInput.error} hint="Must be greater than zero" placeholder="15" />
              </>
            )}

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                setMode("direct")
                setZ("1.645")
                setScore("130")
                setMean("100")
                setSd("15")
              }}
            >
              <IconRotate className="h-4 w-4" />
              Reset
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4 lg:col-span-3">
          {valid && zValue !== null && percentile !== null && verdict ? (
            <ResultsRegion>
              <GradientHeroMetric
                label="Percentile rank"
                value={formatPercent(percentile * 100, 2)}
                sub={`z = ${formatDecimal(zValue, 3)} — area shaded on the curve below`}
              />

              <div
                className={`flex items-start gap-2.5 rounded-xl border p-3 text-xs leading-relaxed ${
                  verdict.kind === "above"
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                    : verdict.kind === "below"
                      ? "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400"
                      : "border-border/70 bg-muted/20 text-muted-foreground"
                }`}
              >
                <span>{verdict.kind === "above" ? "✅" : verdict.kind === "below" ? "⚠️" : "📊"}</span>
                <p>{verdict.text}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <MetricTile
                  label="Probability (0–1)"
                  value={formatDecimal(percentile, 5)}
                  sub="The CDF value"
                />
                <MetricTile
                  label="Inverse (right tail)"
                  value={`Top ${formatPercent((1 - percentile) * 100, 2)}`}
                  sub="How exclusive your score is"
                />
                <MetricTile
                  label="Z-score used"
                  value={formatDecimal(zValue, 3)}
                  sub={mode === "raw" ? "(x − μ) ÷ σ" : "Direct input"}
                />
              </div>

              <div className="rounded-2xl border border-primary/50 bg-card p-4 shadow-2xs">
                <NormalCurveChart
                  label="Normal distribution curve with shaded area up to z"
                  shade={(point) => point <= zValue}
                  markers={[{ z: Math.max(-4, Math.min(4, zValue)), digits: 3 }]}
                  caption="Standard deviations"
                  shadeColor="primary"
                />
              </div>
            </ResultsRegion>
          ) : (
            <ResultsPlaceholder
              title="Enter a z-score"
              description="Your percentile, probability and the bell curve visualization appear here."
            />
          )}
        </div>
      </div>
    </div>
  )
}
