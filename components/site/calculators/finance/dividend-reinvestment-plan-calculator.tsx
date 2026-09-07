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
import { formatCurrency, formatPercent } from "@/lib/format"
import { simulateDrip } from "@/lib/finance"

const DEFAULTS = {
  investment: "10000",
  yieldPct: "4",
  contribution: "1000",
  divGrowth: "5",
  priceGrowth: "3",
  years: "10",
}

export function DividendReinvestmentPlanCalculator() {
  const [values, setValues] = useState(DEFAULTS)
  const update = (key: keyof typeof DEFAULTS, value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  const investment = parseNumericInput(values.investment, { min: 1 })
  const yieldPct = parseNumericInput(values.yieldPct, { min: 0, max: 100 })
  const contribution = parseNumericInput(values.contribution, { min: 0 })
  const divGrowth = parseNumericInput(values.divGrowth, { min: 0 })
  const priceGrowth = parseNumericInput(values.priceGrowth, { min: 0 })
  const years = parseNumericInput(values.years, { min: 1, max: 50, integer: true })

  const valid = [
    investment,
    yieldPct,
    contribution,
    divGrowth,
    priceGrowth,
    years,
  ].every((field) => field.value !== null)

  const result = valid
    ? simulateDrip({
        investment: investment.value!,
        yieldPct: yieldPct.value!,
        contribution: contribution.value!,
        divGrowthPct: divGrowth.value!,
        priceGrowthPct: priceGrowth.value!,
        years: years.value!,
      })
    : null

  const copyRows = result
    ? [
        ["Year", "Dividend income", "Portfolio value"],
        ...result.years.map((y) => [
          String(y.year),
          formatCurrency(y.income, 0),
          formatCurrency(y.value, 0),
        ]),
      ]
    : []

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Reinvestment plan</CardTitle>
            <CardDescription>
              Dividends buy more shares, which pay more dividends — the compounding loop.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <NumberField label="Initial investment" value={values.investment} onChange={(v) => update("investment", v)} error={investment.error} suffix="$" placeholder="10000" />
            <NumberField label="Starting dividend yield" value={values.yieldPct} onChange={(v) => update("yieldPct", v)} error={yieldPct.error} suffix="%" placeholder="4" />
            <NumberField label="Annual contribution" value={values.contribution} onChange={(v) => update("contribution", v)} error={contribution.error} suffix="$" placeholder="1000" />
            <NumberField label="Dividend growth / yr" value={values.divGrowth} onChange={(v) => update("divGrowth", v)} error={divGrowth.error} suffix="%" placeholder="5" />
            <NumberField label="Share price growth / yr" value={values.priceGrowth} onChange={(v) => update("priceGrowth", v)} error={priceGrowth.error} suffix="%" placeholder="3" />
            <NumberField label="Years" value={values.years} onChange={(v) => update("years", v)} error={years.error} hint="1–50" placeholder="10" />
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
                label={`Portfolio value after ${years.value} years`}
                value={formatCurrency(result.finalValue, 0)}
                sub={`${formatCurrency(result.totalContributions, 0)} contributed · ${formatCurrency(result.totalDividends, 0)} in dividends collected`}
              />

              <div className="grid gap-3 sm:grid-cols-3">
                <MetricTile
                  label="Final annual income"
                  value={formatCurrency(result.finalIncome, 0)}
                  sub={`Started at ${formatCurrency(result.firstIncome, 0)}/yr`}
                />
                <MetricTile
                  label="Income growth"
                  value={`${result.firstIncome > 0 ? formatPercent(((result.finalIncome / result.firstIncome) - 1) * 100, 0) : "—"}`}
                  sub="Year 1 → final year"
                />
                <MetricTile
                  label="Total dividends"
                  value={formatCurrency(result.totalDividends, 0)}
                  sub="All reinvested along the way"
                />
              </div>
            </ResultsRegion>
          ) : (
            <ResultsPlaceholder
              title="Enter your plan"
              description="Watch reinvested dividends compound your portfolio year by year."
            />
          )}
        </div>
      </div>

      {result ? (
        <div className="overflow-x-auto rounded-2xl border border-primary/50 bg-card shadow-2xs">
          <div className="flex items-center justify-between px-4 pt-4">
            <p className="text-sm font-bold tracking-tight text-foreground">Year by year</p>
            <CopyTableButton rows={copyRows} />
          </div>
          <Table className="mt-2">
            <TableHeader>
              <TableRow>
                <TableHead>Year</TableHead>
                <TableHead className="text-right">Dividend income</TableHead>
                <TableHead className="text-right">Portfolio value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.years.map((y) => (
                <TableRow key={y.year}>
                  <TableCell className="font-medium">{y.year}</TableCell>
                  <TableCell className="text-right font-mono tabular-nums">{formatCurrency(y.income, 0)}</TableCell>
                  <TableCell className="text-right font-mono tabular-nums">{formatCurrency(y.value, 0)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : null}
    </div>
  )
}
