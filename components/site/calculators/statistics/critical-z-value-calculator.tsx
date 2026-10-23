"use client"

import { useState } from "react"
import { IconAlertTriangle, IconRotate } from "@tabler/icons-react"

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
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatDecimal, formatPercent } from "@/lib/format"
import { inverseNormalCdf } from "@/lib/stats"

type TailType = "two" | "left" | "right"

export function CriticalZValueCalculator() {
  const [alpha, setAlpha] = useState(0.05)
  const [tail, setTail] = useState<TailType>("two")

  const tailArea = tail === "two" ? alpha / 2 : alpha
  const upper = inverseNormalCdf(1 - tailArea)
  const lower = tail === "two" ? inverseNormalCdf(tailArea) : null
  const valid = upper !== null
  const confidence = (1 - alpha) * 100

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Enter confidence parameters</CardTitle>
          <CardDescription>
            Pick your risk tolerance and test direction — the critical value appears
            with the rejection region on the curve.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Significance level (α)
            </Label>
            <Select value={String(alpha)} onValueChange={(v) => setAlpha(Number(v))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pick α" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.1">0.10 (90% Confidence)</SelectItem>
                <SelectItem value="0.05">0.05 (95% Confidence)</SelectItem>
                <SelectItem value="0.01">0.01 (99% Confidence)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-primary">Test type</Label>
            <Select value={tail} onValueChange={(v) => setTail(v as TailType)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pick test type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="two">Two-Tailed (Standard)</SelectItem>
                <SelectItem value="left">One-Tailed (Left)</SelectItem>
                <SelectItem value="right">One-Tailed (Right)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => {
              setAlpha(0.05)
              setTail("two")
            }}
          >
            <IconRotate className="h-4 w-4" />
            Reset
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {valid && upper !== null ? (
          <ResultsRegion>
            <GradientHeroMetric
              label="Critical z-value"
              value={
                tail === "two"
                  ? `± ${formatDecimal(Math.abs(upper), 3)}`
                  : formatDecimal(upper, 3)
              }
              sub={
                tail === "two"
                  ? `Reject H₀ when |z| > ${formatDecimal(Math.abs(upper), 3)}`
                  : tail === "right"
                    ? `Reject H₀ when z > ${formatDecimal(upper, 3)}`
                    : `Reject H₀ when z < ${formatDecimal(upper, 3)}`
              }
            />

            <div className="flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs leading-relaxed text-red-700 dark:text-red-400">
              <IconAlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>
                Rejection Region: Area = {alpha} ({tail === "two" ? `${formatPercent(alpha / 2)} in each tail` : `${formatPercent(alpha)} in one tail`}) — reject the null hypothesis if your test statistic falls in the red zone.
              </p>
            </div>

            <div className="rounded-2xl border border-primary/50 bg-card p-4 shadow-2xs">
              <NormalCurveChart
                label="Normal distribution with shaded rejection regions"
                shade={(point) =>
                  tail === "right"
                    ? point >= upper
                    : tail === "left"
                      ? point <= upper
                      : point >= upper || (lower !== null && point <= lower)
                }
                markers={[upper, lower]
                  .filter((point) => point !== null)
                  .map((point) => ({ z: point, digits: 3 }))}
                caption="Red Area = Rejection Region"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <MetricTile
                label="Confidence level"
                value={formatPercent(confidence, 0)}
                sub="Your chosen level of certainty"
              />
              <MetricTile
                label="Upper critical z"
                value={formatDecimal(tail === "left" ? 0 : upper, 3)}
                sub="Right boundary of acceptance"
              />
              <MetricTile
                label="Lower critical z"
                value={tail === "two" && lower !== null ? formatDecimal(lower, 3) : tail === "left" ? formatDecimal(upper, 3) : "—"}
                sub="Left boundary of acceptance"
              />
            </div>
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Pick a significance level"
            description="The critical z-value and rejection region appear here instantly."
          />
        )}
      </div>
    </div>
  )
}
