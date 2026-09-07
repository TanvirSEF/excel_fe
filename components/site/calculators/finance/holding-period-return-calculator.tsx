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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { parseNumericInput } from "@/lib/calculators"
import { formatCurrency, formatDecimal, formatPercent } from "@/lib/format"

const DEFAULTS = { start: "10000", end: "12500", income: "200", years: "2" }

export function HoldingPeriodReturnCalculator() {
  const [values, setValues] = useState(DEFAULTS)
  const [showAnnualized, setShowAnnualized] = useState(false)
  const update = (key: keyof typeof DEFAULTS, value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  const start = parseNumericInput(values.start, { min: 0.000001 })
  const end = parseNumericInput(values.end, { min: 0 })
  const income = parseNumericInput(values.income, { min: 0 })
  const years = parseNumericInput(values.years, { min: 0.01 })

  const valid =
    start.value !== null && end.value !== null && income.value !== null && years.value !== null

  const totalGain = valid ? end.value! - start.value! + income.value! : 0
  const hpr = valid ? (totalGain / start.value!) * 100 : null
  const annualized =
    valid && totalGain > -start.value!
      ? ((1 + totalGain / start.value!) ** (1 / years.value!) - 1) * 100
      : null

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Your holding period</CardTitle>
          <CardDescription>
            The total return over the whole time you owned the asset.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <NumberField label="Starting value" value={values.start} onChange={(v) => update("start", v)} error={start.error} suffix="$" placeholder="10000" />
          <NumberField label="Ending value" value={values.end} onChange={(v) => update("end", v)} error={end.error} suffix="$" placeholder="12500" />
          <NumberField label="Income received" value={values.income} onChange={(v) => update("income", v)} error={income.error} hint="Dividends, interest or rent along the way" suffix="$" placeholder="200" />
          <NumberField label="Years held" value={values.years} onChange={(v) => update("years", v)} error={years.error} hint="Used for the annualized figure" placeholder="2" />
          <Tabs
            value={showAnnualized ? "annual" : "total"}
            onValueChange={(value) => setShowAnnualized(value === "annual")}
          >
            <TabsList className="w-full">
              <TabsTrigger value="total" className="flex-1">
                Total HPR
              </TabsTrigger>
              <TabsTrigger value="annual" className="flex-1">
                Annualized
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button type="button" variant="outline" className="w-full" onClick={() => { setValues(DEFAULTS); setShowAnnualized(false) }}>
            <IconRotate className="h-4 w-4" />
            Reset to example
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {valid && hpr !== null ? (
          <ResultsRegion>
            <GradientHeroMetric
              label={showAnnualized ? "Annualized return" : "Holding period return"}
              value={
                showAnnualized && annualized !== null
                  ? formatPercent(annualized)
                  : formatPercent(hpr)
              }
              sub={
                showAnnualized
                  ? `The ${formatPercent(hpr)} total spread over ${formatDecimal(years.value!, 1)} years`
                  : `Total gain ${formatCurrency(totalGain)} on ${formatCurrency(start.value!)} invested`
              }
            />

            <div className="grid gap-3 sm:grid-cols-3">
              <MetricTile label="Total gain" value={formatCurrency(totalGain)} sub="Price change + income" />
              <MetricTile label="Total HPR" value={formatPercent(hpr)} sub="Whole period, unannualized" />
              <MetricTile
                label="Annualized"
                value={annualized !== null ? formatPercent(annualized) : "—"}
                sub="Per-year equivalent"
              />
            </div>

            <StepList
              steps={[
                {
                  title: "Formula",
                  body: "HPR = (ending − starting + income) ÷ starting",
                },
                {
                  title: "Substitute",
                  body: `(${formatCurrency(end.value!, 0)} − ${formatCurrency(start.value!, 0)} + ${formatCurrency(income.value!, 0)}) ÷ ${formatCurrency(start.value!, 0)}`,
                },
                { title: "Result", body: `HPR = ${formatPercent(hpr)}` },
              ]}
            />
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter start and end values"
            description="Total and annualized holding period returns appear here."
          />
        )}
      </div>
    </div>
  )
}
