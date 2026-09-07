"use client"

import { useState } from "react"
import { IconPlus, IconRotate, IconX } from "@tabler/icons-react"

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
import { formatCurrency } from "@/lib/format"
import { simulateStrategy, type DebtRow } from "@/lib/accounting"

interface Row {
  label: string
  balance: string
  apr: string
  minPayment: string
}

const DEFAULT_ROWS: Row[] = [
  { label: "Card A", balance: "2000", apr: "22", minPayment: "60" },
  { label: "Card B", balance: "5000", apr: "18", minPayment: "125" },
  { label: "Loan C", balance: "8000", apr: "6", minPayment: "160" },
]

const DEFAULT_EXTRA = "200"

export function DebtSnowballVsAvalancheCalculator() {
  const [rows, setRows] = useState<Row[]>(DEFAULT_ROWS)
  const [extra, setExtra] = useState(DEFAULT_EXTRA)

  const extraInput = parseNumericInput(extra, { min: 0 })

  const parsed = rows.map((row) => ({
    label: row.label,
    balance: parseNumericInput(row.balance, { min: 0.01 }),
    apr: parseNumericInput(row.apr, { min: 0, max: 100 }),
    minPayment: parseNumericInput(row.minPayment, { min: 1 }),
  }))

  const validRows: DebtRow[] = parsed
    .filter((row) => row.balance.value !== null && row.apr.value !== null && row.minPayment.value !== null)
    .map((row) => ({
      label: row.label,
      balance: row.balance.value!,
      aprPct: row.apr.value!,
      minPayment: row.minPayment.value!,
    }))

  const valid =
    validRows.length >= 2 && extraInput.value !== null && rows.every((_, i) => parsed[i].balance.value !== null)

  const snowball = valid ? simulateStrategy(validRows, extraInput.value!, "snowball") : null
  const avalanche = valid ? simulateStrategy(validRows, extraInput.value!, "avalanche") : null

  const winner =
    snowball && avalanche
      ? avalanche.totalInterest < snowball.totalInterest
        ? "avalanche"
        : snowball.totalInterest < avalanche.totalInterest
          ? "snowball"
          : "tie"
      : null

  function updateRow(index: number, key: keyof Row, value: string) {
    setRows((current) =>
      current.map((row, i) => (i === index ? { ...row, [key]: value } : row))
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Your debts</CardTitle>
          <CardDescription>
            Every debt with its balance, APR and minimum payment — plus the extra you can
            throw at them monthly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {rows.map((row, index) => (
              <div key={index} className="rounded-xl border border-border/70 bg-muted/20 p-3 space-y-2.5">
                <div className="flex items-center gap-2">
                  <input
                    value={row.label}
                    onChange={(event) => updateRow(index, "label", event.target.value)}
                    className="h-8 w-full rounded-md border border-input bg-background px-2.5 text-xs font-medium"
                    placeholder="Debt name"
                    aria-label={`Debt ${index + 1} name`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() =>
                      setRows((current) =>
                        current.length > 2 ? current.filter((_, i) => i !== index) : current
                      )
                    }
                    aria-label={`Remove ${row.label}`}
                  >
                    <IconX className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-end gap-2">
                  <div className="min-w-0 flex-1">
                    <NumberField label="Balance" value={row.balance} onChange={(v) => updateRow(index, "balance", v)} suffix="$" placeholder="2000" />
                  </div>
                  <div className="w-24">
                    <NumberField label="APR" value={row.apr} onChange={(v) => updateRow(index, "apr", v)} suffix="%" placeholder="22" />
                  </div>
                  <div className="w-28">
                    <NumberField label="Min pay" value={row.minPayment} onChange={(v) => updateRow(index, "minPayment", v)} suffix="$" placeholder="60" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() =>
              setRows((current) => [...current, { label: `Debt ${current.length + 1}`, balance: "", apr: "", minPayment: "" }])
            }
          >
            <IconPlus className="h-4 w-4" />
            Add another debt
          </Button>

          <NumberField
            label="Extra monthly budget"
            value={extra}
            onChange={setExtra}
            error={extraInput.error}
            hint="Above all minimums — the strategy fuel"
            suffix="$"
            placeholder="200"
          />

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => {
              setRows(DEFAULT_ROWS)
              setExtra(DEFAULT_EXTRA)
            }}
          >
            <IconRotate className="h-4 w-4" />
            Reset to example
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {snowball && avalanche && winner ? (
          <ResultsRegion>
            <GradientHeroMetric
              label={winner === "tie" ? "Both strategies tie" : `${winner === "snowball" ? "Snowball" : "Avalanche"} wins on cost`}
              value={
                winner === "avalanche"
                  ? `Saves ${formatCurrency(snowball.totalInterest - avalanche.totalInterest, 0)}`
                  : winner === "snowball"
                    ? `Saves ${formatCurrency(avalanche.totalInterest - snowball.totalInterest, 0)}`
                    : "Identical totals"
              }
              sub="Compare the two payoff strategies on your real debts"
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-primary/40 bg-card p-4 shadow-2xs">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Snowball — smallest first
                </p>
                <p className="mt-2 font-mono text-lg font-bold tabular-nums text-foreground">
                  {Math.floor(snowball.months / 12)} yr {snowball.months % 12} mo
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(snowball.totalInterest, 0)} interest · {formatCurrency(snowball.totalPaid, 0)} total
                </p>
                <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                  First payoff: {snowball.payoffs[0]?.label} (month {snowball.payoffs[0]?.month})
                </p>
              </div>
              <div className="rounded-2xl border border-primary/40 bg-card p-4 shadow-2xs">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Avalanche — highest APR first
                </p>
                <p className="mt-2 font-mono text-lg font-bold tabular-nums text-foreground">
                  {Math.floor(avalanche.months / 12)} yr {avalanche.months % 12} mo
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(avalanche.totalInterest, 0)} interest · {formatCurrency(avalanche.totalPaid, 0)} total
                </p>
                <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                  First payoff: {avalanche.payoffs[0]?.label} (month {avalanche.payoffs[0]?.month})
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <MetricTile
                label="Total debt"
                value={formatCurrency(validRows.reduce((t, d) => t + d.balance, 0), 0)}
                sub={`${validRows.length} debts`}
              />
              <MetricTile
                label="Interest difference"
                value={formatCurrency(Math.abs(snowball.totalInterest - avalanche.totalInterest), 0)}
                sub="Avalanche is usually cheaper"
              />
              <MetricTile
                label="Months difference"
                value={`${Math.abs(snowball.months - avalanche.months)}`}
                sub="Timeline gap between strategies"
              />
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground">
              Avalanche saves the most money; snowball delivers quick psychological wins
              that keep people going. The best strategy is the one you finish — this
              calculator shows what each costs so you can choose with open eyes.
            </p>
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter at least two debts"
            description="Both strategies play out on your debts, month by month, and the winner appears here."
          />
        )}
      </div>
    </div>
  )
}
