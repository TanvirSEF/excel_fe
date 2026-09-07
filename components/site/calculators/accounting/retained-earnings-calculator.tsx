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
import { formatCurrency } from "@/lib/format"

const DEFAULTS = { beginning: "100000", netIncome: "50000", dividends: "20000" }

export function RetainedEarningsCalculator() {
  const [values, setValues] = useState(DEFAULTS)
  const update = (key: keyof typeof DEFAULTS, value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  const beginning = parseNumericInput(values.beginning, { min: 0 })
  const netIncome = parseNumericInput(values.netIncome, { min: 0 })
  const dividends = parseNumericInput(values.dividends, { min: 0 })

  const valid = beginning.value !== null && netIncome.value !== null && dividends.value !== null
  const ending = valid ? beginning.value! + netIncome.value! - dividends.value! : null
  const retentionRatio =
    valid && netIncome.value! > 0 ? ((netIncome.value! - dividends.value!) / netIncome.value!) * 100 : null

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Statement of retained earnings</CardTitle>
          <CardDescription>
            The profit kept in the company across its whole life, updated for this year.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <NumberField
            label="Beginning retained earnings"
            value={values.beginning}
            onChange={(v) => update("beginning", v)}
            error={beginning.error}
            hint="Last period's ending balance"
            suffix="$"
            placeholder="100000"
          />
          <NumberField label="Net income this year" value={values.netIncome} onChange={(v) => update("netIncome", v)} error={netIncome.error} suffix="$" placeholder="50000" />
          <NumberField label="Dividends paid" value={values.dividends} onChange={(v) => update("dividends", v)} error={dividends.error} suffix="$" placeholder="20000" />
          <Button type="button" variant="outline" className="w-full" onClick={() => setValues(DEFAULTS)}>
            <IconRotate className="h-4 w-4" />
            Reset to example
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {valid && ending !== null ? (
          <ResultsRegion>
            <GradientHeroMetric
              label="Ending retained earnings"
              value={formatCurrency(ending, 0)}
              sub="The company's cumulative savings after paying owners"
            />

            <div className="grid gap-3 sm:grid-cols-3">
              <MetricTile label="Profit added" value={formatCurrency(netIncome.value!, 0)} sub="This year's net income" />
              <MetricTile label="Paid to owners" value={formatCurrency(dividends.value!, 0)} sub="Dividends distributed" />
              <MetricTile
                label="Retention ratio"
                value={retentionRatio !== null ? `${retentionRatio.toFixed(1)}%` : "—"}
                sub="Share of profit kept in the business"
              />
            </div>

            <StepList
              steps={[
                { title: "Formula", body: "RE(end) = RE(begin) + Net income − Dividends" },
                {
                  title: "Substitute",
                  body: `${formatCurrency(beginning.value!, 0)} + ${formatCurrency(netIncome.value!, 0)} − ${formatCurrency(dividends.value!, 0)}`,
                },
                { title: "Result", body: `RE(end) = ${formatCurrency(ending, 0)}` },
              ]}
            />
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter the three figures"
            description="Ending retained earnings and the retention ratio appear here."
          />
        )}
      </div>
    </div>
  )
}
