"use client"

import { useState } from "react"
import { IconCircleCheck, IconRotate, IconX } from "@tabler/icons-react"

import { NumberField } from "@/components/site/calculators/field"
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
import { parseNumericInput } from "@/lib/calculators"
import { formatDecimal, formatPValue } from "@/lib/format"
import { pValueFromZ } from "@/lib/stats"

export function PValueFromZScoreCalculator() {
  const [z, setZ] = useState("1.96")
  const [twoTailed, setTwoTailed] = useState(true)

  const zInput = parseNumericInput(z)
  const zValue = zInput.value
  const valid = zValue !== null
  const p = valid ? pValueFromZ(zValue, twoTailed) : null
  const significant = p !== null && p < 0.05

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Your test result</CardTitle>
          <CardDescription>
            The z statistic from your hypothesis test — sign matters only for direction.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <NumberField
            label="Z-score"
            value={z}
            onChange={setZ}
            error={zInput.error}
            hint="e.g. 1.96, −2.33, 0.84"
            placeholder="1.96"
          />

          <Tabs
            value={twoTailed ? "two" : "one"}
            onValueChange={(value) => setTwoTailed(value === "two")}
          >
            <TabsList className="w-full">
              <TabsTrigger value="one" className="flex-1">
                One-tailed
              </TabsTrigger>
              <TabsTrigger value="two" className="flex-1">
                Two-tailed
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => {
              setZ("1.96")
              setTwoTailed(true)
            }}
          >
            <IconRotate className="h-4 w-4" />
            Reset to example
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {valid && zValue !== null && p !== null ? (
          <ResultsRegion>
            <GradientHeroMetric
              label={`${twoTailed ? "Two" : "One"}-tailed P-value`}
              value={formatPValue(p)}
              sub={significant ? "Significant at α = 0.05" : "Not significant at α = 0.05"}
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
                  ? `P = ${formatPValue(p)} < 0.05 — reject the null hypothesis. Your result is statistically significant.`
                  : `P = ${formatPValue(p)} ≥ 0.05 — fail to reject the null hypothesis. The result could plausibly be chance.`}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <MetricTile
                label="One-tailed P"
                value={formatPValue(pValueFromZ(zValue, false))}
                sub="Area in one tail"
              />
              <MetricTile
                label="Two-tailed P"
                value={formatPValue(pValueFromZ(zValue, true))}
                sub="Both tails combined"
              />
              <MetricTile label="|z|" value={formatDecimal(Math.abs(zValue), 2)} sub="Magnitude of evidence" />
            </div>

            <StepList
              steps={[
                {
                  title: "Formula",
                  body: twoTailed ? "P = 2 × (1 − Φ(|z|))" : "P = 1 − Φ(z)",
                },
                {
                  title: "Substitute",
                  body: twoTailed
                    ? `2 × (1 − Φ(${formatDecimal(Math.abs(zValue), 2)}))`
                    : `1 − Φ(${formatDecimal(zValue, 2)})`,
                },
                { title: "Result", body: `P = ${formatPValue(p)}` },
              ]}
            />
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter your z-score"
            description="The P-value and its verdict against α = 0.05 appear here instantly."
          />
        )}
      </div>
    </div>
  )
}
