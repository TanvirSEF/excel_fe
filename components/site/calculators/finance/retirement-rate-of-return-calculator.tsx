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
import { parseNumericInput } from "@/lib/calculators"
import { formatCurrency, formatPercent } from "@/lib/format"
import { futureValue, requiredRate } from "@/lib/finance"

const DEFAULTS = {
  savings: "100000",
  contribution: "10000",
  years: "20",
  target: "1000000",
  currentRate: "6",
}

export function RetirementRateOfReturnCalculator() {
  const [values, setValues] = useState(DEFAULTS)
  const update = (key: keyof typeof DEFAULTS, value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  const savings = parseNumericInput(values.savings, { min: 0 })
  const contribution = parseNumericInput(values.contribution, { min: 0 })
  const years = parseNumericInput(values.years, { min: 1, max: 60, integer: true })
  const target = parseNumericInput(values.target, { min: 1 })
  const currentRate = parseNumericInput(values.currentRate, { min: 0, max: 50 })

  const valid =
    savings.value !== null &&
    contribution.value !== null &&
    years.value !== null &&
    target.value !== null &&
    currentRate.value !== null

  const required = valid
    ? requiredRate(savings.value!, contribution.value!, years.value!, target.value!)
    : null
  const projected = valid
    ? futureValue(currentRate.value! / 100, savings.value!, contribution.value!, years.value!)
    : null
  const gap = valid && projected !== null ? target.value! - projected : null
  const achievable = required !== null && required <= 0.1

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Retirement plan</CardTitle>
          <CardDescription>
            The return your savings must earn to hit the number by the deadline.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <NumberField label="Current savings" value={values.savings} onChange={(v) => update("savings", v)} error={savings.error} suffix="$" placeholder="100000" />
          <NumberField label="Annual contribution" value={values.contribution} onChange={(v) => update("contribution", v)} error={contribution.error} suffix="$" placeholder="10000" />
          <NumberField label="Years to retirement" value={values.years} onChange={(v) => update("years", v)} error={years.error} placeholder="20" />
          <NumberField label="Retirement target" value={values.target} onChange={(v) => update("target", v)} error={target.error} suffix="$" placeholder="1000000" />
          <NumberField
            label="Your expected return"
            value={values.currentRate}
            onChange={(v) => update("currentRate", v)}
            error={currentRate.error}
            hint="What your portfolio realistically earns"
            suffix="%"
            placeholder="6"
          />
          <Button type="button" variant="outline" className="w-full" onClick={() => setValues(DEFAULTS)}>
            <IconRotate className="h-4 w-4" />
            Reset to example
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {valid && projected !== null && gap !== null ? (
          <ResultsRegion>
            <GradientHeroMetric
              label="Required annual return"
              value={required !== null ? formatPercent(required * 100, 2) : "Out of reach"}
              sub={
                required !== null
                  ? `To turn ${formatCurrency(savings.value!, 0)} + contributions into ${formatCurrency(target.value!, 0)} in ${years.value} years`
                  : "Even a 500% annual return cannot close this gap — contribute more or extend the timeline"
              }
            />

            <div className="grid gap-3 sm:grid-cols-3">
              <MetricTile
                label="Projected at your rate"
                value={formatCurrency(projected, 0)}
                sub={`${formatPercent(currentRate.value!, 1)} assumed return`}
              />
              <MetricTile
                label={gap > 0 ? "Shortfall" : "Surplus"}
                value={formatCurrency(Math.abs(gap), 0)}
                sub={gap > 0 ? "Below your target" : "Above your target"}
              />
              <MetricTile
                label="Risk read"
                value={required === null ? "—" : required <= 0.05 ? "Conservative OK" : achievable ? "Moderate risk" : "Aggressive"}
                sub={
                  required === null
                    ? "Rethink the plan"
                    : required <= 0.05
                      ? "Bonds & savings can get there"
                      : achievable
                        ? "A stock-heavy portfolio is needed"
                        : "Above 10%/yr is very risky to count on"
                }
              />
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground">
              {required !== null && required > currentRate.value! / 100
                ? `You need ${formatPercent((required - currentRate.value! / 100) * 100, 2)} more per year than your current assumption — consider raising contributions instead of chasing risk.`
                : "Your current plan already meets the target at your expected return — you can afford to relax the risk."}
            </p>
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter your retirement numbers"
            description="The required return — and whether your plan needs more risk — appears here."
          />
        )}
      </div>
    </div>
  )
}
