"use client"

import { useState } from "react"
import { IconRotate } from "@tabler/icons-react"

import { NumberField } from "@/components/site/calculators/field"
import { CopyTableButton } from "@/components/site/calculators/copy-table-button"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { parseNumericInput } from "@/lib/calculators"
import { formatCurrency, formatDecimal, formatPercent } from "@/lib/format"
import { simulateSolar } from "@/lib/finance"

const DEFAULTS = {
  cost: "20000",
  incentive: "30",
  rate: "0.15",
  kwh: "10000",
  degradation: "0.5",
  escalation: "2.5",
  lifetime: "25",
}

export function SolarRoiCalculator() {
  const [values, setValues] = useState(DEFAULTS)
  const update = (key: keyof typeof DEFAULTS, value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  const cost = parseNumericInput(values.cost, { min: 1 })
  const incentive = parseNumericInput(values.incentive, { min: 0, max: 100 })
  const rate = parseNumericInput(values.rate, { min: 0.000001 })
  const kwh = parseNumericInput(values.kwh, { min: 1 })
  const degradation = parseNumericInput(values.degradation, { min: 0, max: 10 })
  const escalation = parseNumericInput(values.escalation, { min: 0, max: 20 })
  const lifetime = parseNumericInput(values.lifetime, { min: 1, max: 40, integer: true })

  const valid = [cost, incentive, rate, kwh, degradation, escalation, lifetime].every(
    (field) => field.value !== null
  )

  const result = valid
    ? simulateSolar({
        cost: cost.value!,
        incentivePct: incentive.value!,
        ratePerKwh: rate.value!,
        annualKwh: kwh.value!,
        degradationPct: degradation.value!,
        escalationPct: escalation.value!,
        lifetimeYears: lifetime.value!,
      })
    : null

  const copyRows = result
    ? [
        ["Year", "Savings", "Cumulative"],
        ...result.years.map((y) => [
          String(y.year),
          formatCurrency(y.savings, 0),
          formatCurrency(y.cumulative, 0),
        ]),
      ]
    : []

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Solar system</CardTitle>
            <CardDescription>
              Industry-standard inputs — the 30% US federal tax credit is the default.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <NumberField label="Installed cost" value={values.cost} onChange={(v) => update("cost", v)} error={cost.error} suffix="$" placeholder="20000" />
            <NumberField label="Incentives / tax credit" value={values.incentive} onChange={(v) => update("incentive", v)} error={incentive.error} hint="US federal ITC covers 30%" suffix="%" placeholder="30" />
            <NumberField label="Electricity rate" value={values.rate} onChange={(v) => update("rate", v)} error={rate.error} hint="Per kWh — US average is around $0.16" suffix="$" placeholder="0.15" />
            <NumberField label="Annual consumption" value={values.kwh} onChange={(v) => update("kwh", v)} error={kwh.error} hint="Check your utility bill" suffix="kWh" placeholder="10000" />
            <NumberField label="Panel degradation / yr" value={values.degradation} onChange={(v) => update("degradation", v)} error={degradation.error} hint="Industry standard ~0.5%" suffix="%" placeholder="0.5" />
            <NumberField label="Rate escalation / yr" value={values.escalation} onChange={(v) => update("escalation", v)} error={escalation.error} hint="Utility prices rise — 2–3% is typical" suffix="%" placeholder="2.5" />
            <NumberField label="System lifetime" value={values.lifetime} onChange={(v) => update("lifetime", v)} error={lifetime.error} hint="Panels are warranted 25+ years" suffix="yr" placeholder="25" />
            <Button type="button" variant="outline" className="w-full" onClick={() => setValues(DEFAULTS)}>
              <IconRotate className="h-4 w-4" />
              Reset to example
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4 lg:col-span-3">
          {result ? (
            <ResultsRegion>
              <GradientHeroMetric
                label="Payback period"
                value={result.paybackYears !== null ? `${formatDecimal(result.paybackYears, 1)} years` : "No payback"}
                sub={`${formatCurrency(result.netCost, 0)} net cost recovered by electricity savings`}
              />

              <div className="grid gap-3 sm:grid-cols-3">
                <MetricTile
                  label="First-year savings"
                  value={formatCurrency(result.firstYearSavings, 0)}
                  sub="kWh × rate, year one"
                />
                <MetricTile
                  label={`${lifetime.value}-year savings`}
                  value={formatCurrency(result.lifetimeSavings, 0)}
                  sub="After degradation & escalation"
                />
                <MetricTile
                  label="Lifetime net ROI"
                  value={formatPercent(result.netRoiPercent, 0)}
                  sub="(Savings − net cost) ÷ net cost"
                />
              </div>

              <p className="text-xs leading-relaxed text-muted-foreground">
                Typical US systems pay back in 6–12 years. After that, every kWh your
                panels produce is free electricity for the rest of their 25+ year life.
              </p>
            </ResultsRegion>
          ) : (
            <ResultsPlaceholder
              title="Enter your system details"
              description="Payback period, lifetime savings and ROI appear here instantly."
            />
          )}
        </div>
      </div>

      {result ? (
        <div className="overflow-x-auto rounded-2xl border border-primary/50 bg-card shadow-2xs">
          <div className="flex items-center justify-between px-4 pt-4">
            <p className="text-sm font-bold tracking-tight text-foreground">Savings timeline</p>
            <CopyTableButton rows={copyRows} />
          </div>
          <Table className="mt-2">
            <TableHeader>
              <TableRow>
                <TableHead>Year</TableHead>
                <TableHead className="text-right">Savings</TableHead>
                <TableHead className="text-right">Cumulative</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.years.map((y) => (
                <TableRow key={y.year}>
                  <TableCell className="font-medium">{y.year}</TableCell>
                  <TableCell className="text-right font-mono tabular-nums">{formatCurrency(y.savings, 0)}</TableCell>
                  <TableCell className="text-right font-mono tabular-nums">{formatCurrency(y.cumulative, 0)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : null}
    </div>
  )
}
