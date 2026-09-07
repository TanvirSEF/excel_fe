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
import { simulateWithdrawal } from "@/lib/finance"

const DEFAULTS = { savings: "500000", withdrawal: "3500", returnPct: "6" }

export function SavingsWithdrawalCalculator() {
  const [values, setValues] = useState(DEFAULTS)
  const update = (key: keyof typeof DEFAULTS, value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  const savings = parseNumericInput(values.savings, { min: 1 })
  const withdrawal = parseNumericInput(values.withdrawal, { min: 1 })
  const returnPct = parseNumericInput(values.returnPct, { min: 0, max: 50 })

  const valid =
    savings.value !== null && withdrawal.value !== null && returnPct.value !== null

  const result = valid
    ? simulateWithdrawal(savings.value!, withdrawal.value!, returnPct.value!)
    : null

  const copyRows = result
    ? [
        ["Year", "Start balance", "Withdrawn", "End balance"],
        ...result.years.map((y) => [
          String(y.year),
          formatCurrency(y.startBalance, 0),
          formatCurrency(y.withdrawn, 0),
          formatCurrency(y.endBalance, 0),
        ]),
      ]
    : []

  const summary = result
    ? result.neverDepletes
      ? "Your savings never run out — monthly growth covers the withdrawal."
      : `Your savings last ${Math.floor((result.monthsLasted ?? 0) / 12)} years and ${(result.monthsLasted ?? 0) % 12} months.`
    : ""

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Withdrawal plan</CardTitle>
            <CardDescription>
              How long the money holds out, month by month, with growth working underneath.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <NumberField label="Total savings" value={values.savings} onChange={(v) => update("savings", v)} error={savings.error} suffix="$" placeholder="500000" />
            <NumberField label="Monthly withdrawal" value={values.withdrawal} onChange={(v) => update("withdrawal", v)} error={withdrawal.error} suffix="$" placeholder="3500" />
            <NumberField label="Expected annual return" value={values.returnPct} onChange={(v) => update("returnPct", v)} error={returnPct.error} hint="Balanced portfolios historically return 5–7%" suffix="%" placeholder="6" />
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
                label="Money lasts"
                value={
                  result.neverDepletes
                    ? "Forever"
                    : `${Math.floor((result.monthsLasted ?? 0) / 12)} yr ${(result.monthsLasted ?? 0) % 12} mo`
                }
                sub={summary}
              />

              <div className="grid gap-3 sm:grid-cols-3">
                <MetricTile
                  label="Monthly growth"
                  value={formatPercent(result.monthlyRate * 100, 3)}
                  sub="Equivalent monthly return"
                />
                <MetricTile
                  label="Growth covers"
                  value={formatCurrency(savings.value! * result.monthlyRate, 0)}
                  sub="Interest earned in month 1"
                />
                <MetricTile
                  label="Total withdrawn"
                  value={formatCurrency(result.years.reduce((t, y) => t + y.withdrawn, 0), 0)}
                  sub="Over the whole timeline"
                />
              </div>

              {!result.neverDepletes && result.years.length > 1 ? (
                <p className="text-xs leading-relaxed text-muted-foreground">
                  The safe-withdrawal rule of thumb is about 4% of savings per year (
                  {formatCurrency((savings.value! * 0.04) / 12, 0)}/mo here) — you are
                  withdrawing {formatPercent(((withdrawal.value! * 12) / savings.value!) * 100, 1)} per year.
                </p>
              ) : null}
            </ResultsRegion>
          ) : (
            <ResultsPlaceholder
              title="Enter savings, withdrawal and return"
              description="The month-by-month depletion timeline appears here."
            />
          )}
        </div>
      </div>

      {result ? (
        <div className="overflow-x-auto rounded-2xl border border-primary/50 bg-card shadow-2xs">
          <div className="flex items-center justify-between px-4 pt-4">
            <p className="text-sm font-bold tracking-tight text-foreground">Balance timeline</p>
            <CopyTableButton rows={copyRows} />
          </div>
          {result.years.length > 20 ? (
            <p className="px-4 pt-1 text-[11px] text-muted-foreground">
              Showing the first 20 years of {formatDecimal(result.years.length, 0)} — copy
              for the full timeline.
            </p>
          ) : null}
          <Table className="mt-2">
            <TableHeader>
              <TableRow>
                <TableHead>Year</TableHead>
                <TableHead className="text-right">Start balance</TableHead>
                <TableHead className="text-right">Withdrawn</TableHead>
                <TableHead className="text-right">End balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.years.slice(0, 20).map((y) => (
                <TableRow key={y.year}>
                  <TableCell className="font-medium">{y.year}</TableCell>
                  <TableCell className="text-right font-mono tabular-nums">{formatCurrency(y.startBalance, 0)}</TableCell>
                  <TableCell className="text-right font-mono tabular-nums">{formatCurrency(y.withdrawn, 0)}</TableCell>
                  <TableCell className="text-right font-mono tabular-nums">{formatCurrency(y.endBalance, 0)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : null}
    </div>
  )
}
