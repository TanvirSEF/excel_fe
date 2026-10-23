"use client"

import { useState } from "react"
import { IconCircleCheck, IconRotate, IconX } from "@tabler/icons-react"

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
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { parseNumericInput } from "@/lib/calculators"
import { formatDecimal, formatPValue } from "@/lib/format"
import { pValueFromZ } from "@/lib/stats"

type TailType = "two" | "left" | "right"

export function PValueFromZScoreCalculator() {
  const [z, setZ] = useState("1.96")
  const [tail, setTail] = useState<TailType>("two")
  const [alpha, setAlpha] = useState(0.05)

  const zInput = parseNumericInput(z)
  const zValue = zInput.value
  const valid = zValue !== null
  const p = valid ? pValueFromZ(zValue, tail === "two") : null
  const significant = p !== null && p < alpha

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Enter z-score parameters</CardTitle>
          <CardDescription>
            Your test statistic, the hypothesis direction, and the significance cutoff.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <NumberField
            label="Z-score"
            value={z}
            onChange={setZ}
            error={zInput.error}
            hint="Preset loaded (95th Perc.)"
            placeholder="1.96"
          />

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Hypothesis type
            </Label>
            <Select value={tail} onValueChange={(v) => setTail(v as TailType)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pick test type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="two">Two-tailed (≠)</SelectItem>
                <SelectItem value="left">Left-tailed (&lt;)</SelectItem>
                <SelectItem value="right">Right-tailed (&gt;)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-primary">
              Sig. Level (α)
            </Label>
            <Select value={String(alpha)} onValueChange={(v) => setAlpha(Number(v))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pick α" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.1">0.10 (10%)</SelectItem>
                <SelectItem value="0.05">0.05 (5%)</SelectItem>
                <SelectItem value="0.01">0.01 (1%)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => {
              setZ("1.96")
              setTail("two")
              setAlpha(0.05)
            }}
          >
            <IconRotate className="h-4 w-4" />
            Reset
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {valid && zValue !== null && p !== null ? (
          <ResultsRegion>
            <GradientHeroMetric
              label="P-value result"
              value={formatPValue(p)}
              sub={
                tail === "two"
                  ? `Two-tailed · z = ${formatDecimal(zValue, 2)}`
                  : `${tail === "left" ? "Left" : "Right"}-tailed · z = ${formatDecimal(zValue, 2)}`
              }
            />

            <div
              className={`flex items-start gap-2.5 rounded-xl border p-3.5 text-xs leading-relaxed ${
                significant
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                  : "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400"
              }`}
            >
              {significant ? (
                <IconCircleCheck className="mt-0.5 h-4 w-4 shrink-0" />
              ) : (
                <IconX className="mt-0.5 h-4 w-4 shrink-0" />
              )}
              <p>
                {significant
                  ? `Significant — p = ${formatPValue(p)} < α = ${alpha}. Null hypothesis rejected: the result likely did not happen by chance.`
                  : `Not significant — p = ${formatPValue(p)} ≥ α = ${alpha}. Fail to reject the null hypothesis: random chance may explain this result.`}
              </p>
            </div>

            <div className="rounded-2xl border border-primary/50 bg-card p-4 shadow-2xs">
              <NormalCurveChart
                label="Normal distribution with shaded p-value regions"
                shade={(point) =>
                  tail === "two"
                    ? Math.abs(point) >= Math.abs(zValue)
                    : tail === "left"
                      ? point <= zValue
                      : point >= zValue
                }
                markers={(tail === "two"
                  ? [-Math.abs(zValue), Math.abs(zValue)]
                  : [zValue]
                ).map((point) => ({ z: point, digits: 2 }))}
                caption="Red Area = P-Value"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <MetricTile
                label="Statistically significant?"
                value={significant ? "Yes" : "No"}
                sub={`p ${significant ? "<" : "≥"} α = ${alpha}`}
              />
              <MetricTile
                label={`One-tailed p`}
                value={formatPValue(pValueFromZ(zValue, false))}
                sub="Area in one tail"
              />
              <MetricTile
                label={`Two-tailed p`}
                value={formatPValue(pValueFromZ(zValue, true))}
                sub="Both tails combined"
              />
            </div>
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter your z-score"
            description="The p-value, significance verdict and bell curve appear here instantly."
          />
        )}
      </div>
    </div>
  )
}
