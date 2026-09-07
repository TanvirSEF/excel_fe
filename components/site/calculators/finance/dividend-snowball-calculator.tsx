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
import { formatCurrency, formatDecimal } from "@/lib/format"
import { simulateDrip } from "@/lib/finance"

const DEFAULTS = {
  investment: "10000",
  yieldPct: "4",
  contribution: "1000",
  divGrowth: "6",
  priceGrowth: "2",
  years: "15",
}

export function DividendSnowballCalculator() {
  const [values, setValues] = useState(DEFAULTS)
  const update = (key: keyof typeof DEFAULTS, value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  const investment = parseNumericInput(values.investment, { min: 1 })
  const yieldPct = parseNumericInput(values.yieldPct, { min: 0, max: 100 })
  const contribution = parseNumericInput(values.contribution, { min: 0 })
  const divGrowth = parseNumericInput(values.divGrowth, { min: 0 })
  const priceGrowth = parseNumericInput(values.priceGrowth, { min: 0 })
  const years = parseNumericInput(values.years, { min: 1, max: 50, integer: true })

  const valid = [investment, yieldPct, contribution, divGrowth, priceGrowth, years].every(
    (field) => field.value !== null
  )

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

  const multiple =
    result && result.firstIncome > 0 ? result.finalIncome / result.firstIncome : null

  const copyRows = result
    ? [
        ["Year", "Passive income", "Monthly", "Portfolio value"],
        ...result.years.map((y) => [
          String(y.year),
          formatCurrency(y.income, 0),
          formatCurrency(y.income / 12, 0),
          formatCurrency(y.value, 0),
        ]),
      ]
    : []

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Snowball setup</CardTitle>
            <CardDescription>
              The same money, working harder every year — your income timeline.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <NumberField label="Initial investment" value={values.investment} onChange={(v) => update("investment", v)} error={investment.error} suffix="$" placeholder="10000" />
            <NumberField label="Starting dividend yield" value={values.yieldPct} onChange={(v) => update("yieldPct", v)} error={yieldPct.error} suffix="%" placeholder="4" />
            <NumberField label="Annual contribution" value={values.contribution} onChange={(v) => update("contribution", v)} error={contribution.error} suffix="$" placeholder="1000" />
            <NumberField label="Dividend growth / yr" value={values.divGrowth} onChange={(v) => update("divGrowth", v)} error={divGrowth.error} suffix="%" placeholder="6" />
            <NumberField label="Share price growth / yr" value={values.priceGrowth} onChange={(v) => update("priceGrowth", v)} error={priceGrowth.error} suffix="%" placeholder="2" />
            <NumberField label="Years" value={values.years} onChange={(v) => update("years", v)} error={years.error} hint="1–50" placeholder="15" />
            <Button type="button" variant="outline" className="w-full" onClick={() => setValues(DEFAULTS)}>
              <IconRotate className="h-4 w-4" />
              Reset to example
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4 lg:col-span-3">
          {result && multiple !== null ? (
            <ResultsRegion>
              <GradientHeroMetric
                label={`Passive income in year ${years.value}`}
                value={formatCurrency(result.finalIncome, 0)}
                sub={`Grew ${formatDecimal(multiple, 1)}× from ${formatCurrency(result.firstIncome, 0)} in year 1`}
              />

              <div className="grid gap-3 sm:grid-cols-3">
                <MetricTile
                  label="Monthly income"
                  value={formatCurrency(result.finalIncome / 12, 0)}
                  sub="By the final year"
                />
                <MetricTile
                  label="Portfolio value"
                  value={formatCurrency(result.finalValue, 0)}
                  sub="The snowball itself"
                />
                <MetricTile
                  label="Total dividends"
                  value={formatCurrency(result.totalDividends, 0)}
                  sub="Rolled in along the way"
                />
              </div>

              <p className="text-xs leading-relaxed text-muted-foreground">
                Notice the curve: the income gains stay small for the first years, then
                accelerate — that is the snowball. Every reinvested dividend starts
                earning its own dividends.
              </p>
            </ResultsRegion>
          ) : (
            <ResultsPlaceholder
              title="Enter your snowball"
              description="Your growing passive-income timeline appears here year by year."
            />
          )}
        </div>
      </div>

      {result ? (
        <div className="overflow-x-auto rounded-2xl border border-primary/50 bg-card shadow-2xs">
          <div className="flex items-center justify-between px-4 pt-4">
            <p className="text-sm font-bold tracking-tight text-foreground">Income timeline</p>
            <CopyTableButton rows={copyRows} />
          </div>
          <Table className="mt-2">
            <TableHeader>
              <TableRow>
                <TableHead>Year</TableHead>
                <TableHead className="text-right">Passive income</TableHead>
                <TableHead className="text-right">Monthly</TableHead>
                <TableHead className="text-right">Portfolio value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.years.map((y) => (
                <TableRow key={y.year}>
                  <TableCell className="font-medium">{y.year}</TableCell>
                  <TableCell className="text-right font-mono tabular-nums">{formatCurrency(y.income, 0)}</TableCell>
                  <TableCell className="text-right font-mono tabular-nums">{formatCurrency(y.income / 12, 0)}</TableCell>
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
