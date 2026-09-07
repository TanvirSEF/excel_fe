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

const DEFAULTS = { visitors: "5000", cvr: "2", aov: "100", cost: "5000" }

export function EnterpriseSeoRoiCalculator() {
  const [values, setValues] = useState(DEFAULTS)
  const update = (key: keyof typeof DEFAULTS, value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  const visitors = parseNumericInput(values.visitors, { min: 0 })
  const cvr = parseNumericInput(values.cvr, { min: 0, max: 100 })
  const aov = parseNumericInput(values.aov, { min: 0 })
  const cost = parseNumericInput(values.cost, { min: 0.000001 })

  const valid =
    visitors.value !== null && cvr.value !== null && aov.value !== null && cost.value !== null

  const monthlyRevenue = valid
    ? visitors.value! * (cvr.value! / 100) * aov.value!
    : 0
  const annualRevenue = monthlyRevenue * 12
  const annualCost = valid ? cost.value! * 12 : 0
  const annualRoi = valid ? ((annualRevenue - annualCost) / annualCost) * 100 : null
  const netMonthly = valid ? monthlyRevenue - cost.value! : 0

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>SEO program</CardTitle>
          <CardDescription>
            The extra organic traffic an SEO engagement is expected to bring, and what it costs.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <NumberField
            label="Added visitors / month"
            value={values.visitors}
            onChange={(v) => update("visitors", v)}
            error={visitors.error}
            hint="Projected monthly organic traffic growth"
            placeholder="5000"
          />
          <NumberField
            label="Conversion rate"
            value={values.cvr}
            onChange={(v) => update("cvr", v)}
            error={cvr.error}
            hint="Share of visitors who buy or convert"
            suffix="%"
            placeholder="2"
          />
          <NumberField
            label="Average order value"
            value={values.aov}
            onChange={(v) => update("aov", v)}
            error={aov.error}
            suffix="$"
            placeholder="100"
          />
          <NumberField
            label="SEO cost / month"
            value={values.cost}
            onChange={(v) => update("cost", v)}
            error={cost.error}
            suffix="$"
            placeholder="5000"
          />
          <Button type="button" variant="outline" className="w-full" onClick={() => setValues(DEFAULTS)}>
            <IconRotate className="h-4 w-4" />
            Reset to example
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {valid && annualRoi !== null ? (
          <ResultsRegion>
            <GradientHeroMetric
              label="Added monthly revenue"
              value={formatCurrency(monthlyRevenue)}
              sub={`${formatCurrency(annualRevenue)} per year from SEO traffic`}
            />

            <div className="grid gap-3 sm:grid-cols-3">
              <MetricTile
                label="Annual ROI"
                value={formatPercent(annualRoi)}
                sub={`${formatCurrency(annualRevenue)} revenue vs ${formatCurrency(annualCost)} cost`}
              />
              <MetricTile
                label="Net monthly value"
                value={formatCurrency(netMonthly)}
                sub="Added revenue minus SEO cost"
              />
              <MetricTile
                label="Monthly conversions"
                value={`${(visitors.value! * (cvr.value! / 100)).toFixed(0)}`}
                sub={`Visitors × ${formatPercent(cvr.value!, 1)}`}
              />
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground">
              SEO compounds: unlike paid ads, rankings you earn keep sending traffic after
              the engagement ends — the true ROI of a good program grows every year.
            </p>
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter traffic, conversion and cost"
            description="Projected revenue, ROI and payback for the SEO program appear here."
          />
        )}
      </div>
    </div>
  )
}
