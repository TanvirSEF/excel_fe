"use client"

import { useState } from "react"
import { IconRotate } from "@tabler/icons-react"

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
import { parseNumericInput } from "@/lib/calculators"
import { formatCurrency, formatPercent } from "@/lib/format"

const DEFAULTS = { bonus: "5000", months: "8" }

export function ProratedBonusCalculator() {
  const [values, setValues] = useState(DEFAULTS)
  const update = (key: keyof typeof DEFAULTS, value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  const bonus = parseNumericInput(values.bonus, { min: 0.01 })
  const months = parseNumericInput(values.months, { min: 0, max: 12 })

  const valid = bonus.value !== null && months.value !== null
  const prorated = valid ? (bonus.value! * months.value!) / 12 : null

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Part-year employee</CardTitle>
          <CardDescription>
            A fair share of the annual bonus based on months actually worked.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <NumberField
            label="Full annual bonus"
            value={values.bonus}
            onChange={(v) => update("bonus", v)}
            error={bonus.error}
            hint="What a full-year employee receives"
            suffix="$"
            placeholder="5000"
          />
          <NumberField
            label="Months worked"
            value={values.months}
            onChange={(v) => update("months", v)}
            error={months.error}
            hint="Of the 12-month bonus period"
            placeholder="8"
          />
          <Button type="button" variant="outline" className="w-full" onClick={() => setValues(DEFAULTS)}>
            <IconRotate className="h-4 w-4" />
            Reset to example
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {valid && prorated !== null ? (
          <ResultsRegion>
            <GradientHeroMetric
              label="Prorated bonus"
              value={formatCurrency(prorated)}
              sub={`${formatPercent((months.value! / 12) * 100, 0)} of the full ${formatCurrency(bonus.value!, 0)} bonus`}
            />

            <div className="grid gap-3 sm:grid-cols-3">
              <MetricTile
                label="Months worked"
                value={`${months.value} / 12`}
                sub="Of the bonus period"
              />
              <MetricTile
                label="Bonus per month"
                value={formatCurrency(bonus.value! / 12)}
                sub="Full bonus ÷ 12"
              />
              <MetricTile
                label="Forgone share"
                value={formatCurrency(bonus.value! - prorated)}
                sub="The unworked months' portion"
              />
            </div>

            <StepList
              steps={[
                { title: "Formula", body: "Prorated = Full bonus × (months ÷ 12)" },
                {
                  title: "Substitute",
                  body: `${formatCurrency(bonus.value!, 0)} × (${months.value} ÷ 12)`,
                },
                { title: "Result", body: `Prorated = ${formatCurrency(prorated)}` },
              ]}
            />
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter the bonus and months worked"
            description="The fair, prorated amount appears here instantly."
          />
        )}
      </div>
    </div>
  )
}
