"use client"

import { useState } from "react"
import { IconCircleCheck, IconPlus, IconRotate, IconX } from "@tabler/icons-react"

import { NumberField } from "@/components/site/calculators/field"
import {
  ResultsPlaceholder,
  ResultsRegion,
} from "@/components/site/calculators/result-metrics"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { parseNumericInput } from "@/lib/calculators"
import { formatCurrency } from "@/lib/format"

interface DebtRow {
  name: string
  balance: string
  rate: string
  min: string
}

const DEFAULT_EXTRA = "200"
const DEFAULT_WINDFALL = "0"
const DEFAULT_WIND_MONTH = "6"
const DEFAULT_ROWS: DebtRow[] = [
  { name: "Credit Card 1", balance: "5000", rate: "18", min: "150" },
  { name: "Auto Finance", balance: "12000", rate: "6", min: "350" },
  { name: "Personal Loan", balance: "3000", rate: "12", min: "100" },
]

interface StrategyResult {
  months: number
  interest: number
}

function simulate(
  debts: { balance: number; rate: number; min: number }[],
  order: "snowball" | "avalanche",
  extra: number,
  windfall: number,
  windfallMonth: number
): StrategyResult {
  let list = debts.map((debt) => ({ ...debt }))
  const totalMins = debts.reduce((sum, debt) => sum + debt.min, 0)
  let months = 0
  let interest = 0

  while (list.length > 0 && months < 600) {
    months++
    list.forEach((debt) => {
      const monthInterest = (debt.balance * debt.rate) / 100 / 12
      debt.balance += monthInterest
      interest += monthInterest
    })

    list.sort((a, b) =>
      order === "snowball" ? a.balance - b.balance : b.rate - a.rate
    )

    let surplus = totalMins + extra + (months === windfallMonth ? windfall : 0)
    for (const debt of list) {
      const pay = Math.min(debt.min, debt.balance)
      debt.balance -= pay
      surplus -= pay
    }
    for (const debt of list) {
      if (surplus <= 0) break
      const pay = Math.min(surplus, debt.balance)
      debt.balance -= pay
      surplus -= pay
    }

    list = list.filter((debt) => debt.balance > 0.005)
  }

  return { months, interest: Math.round(interest) }
}

function durationLabel(totalMonths: number): string {
  if (totalMonths < 12) return `${totalMonths}m`
  return `${Math.floor(totalMonths / 12)}y ${totalMonths % 12}m`
}

export function DebtSnowballVsAvalancheCalculator() {
  const [rows, setRows] = useState<DebtRow[]>(DEFAULT_ROWS)
  const [extra, setExtra] = useState(DEFAULT_EXTRA)
  const [windfall, setWindfall] = useState(DEFAULT_WINDFALL)
  const [windMonth, setWindMonth] = useState(DEFAULT_WIND_MONTH)

  const parsedExtra = parseNumericInput(extra, { min: 0 })
  const parsedWindfall = parseNumericInput(windfall, { min: 0 })
  const parsedWindMonth = parseNumericInput(windMonth, { min: 1, integer: true })
  const parsedRows = rows.map((row) => ({
    balance: parseNumericInput(row.balance, { min: 0.000001 }),
    rate: parseNumericInput(row.rate, { min: 0, max: 100 }),
    min: parseNumericInput(row.min, { min: 0.000001 }),
  }))

  const valid =
    parsedExtra.value !== null &&
    parsedWindfall.value !== null &&
    parsedWindMonth.value !== null &&
    parsedRows.every((row) => row.balance.value !== null && row.rate.value !== null && row.min.value !== null)

  const debts = valid
    ? parsedRows.map((row) => ({
        balance: row.balance.value!,
        rate: row.rate.value!,
        min: row.min.value!,
      }))
    : []

  const snowball = valid
    ? simulate(debts, "snowball", parsedExtra.value!, parsedWindfall.value!, parsedWindMonth.value!)
    : null
  const avalanche = valid
    ? simulate(debts, "avalanche", parsedExtra.value!, parsedWindfall.value!, parsedWindMonth.value!)
    : null

  const avalancheWins = snowball !== null && avalanche !== null && avalanche.interest < snowball.interest
  const saved = snowball !== null && avalanche !== null ? Math.abs(snowball.interest - avalanche.interest) : 0

  const updateRow = (index: number, key: keyof DebtRow, value: string) =>
    setRows((current) =>
      current.map((row, i) => (i === index ? { ...row, [key]: value } : row))
    )

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Liability payoff strategy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            1. Acceleration power
          </p>
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <NumberField label="Monthly extra payment ($)" value={extra} onChange={setExtra} error={parsedExtra.error} hint="Added to minimums" suffix="$" placeholder="200" />
            </div>
            <div className="min-w-0 flex-1">
              <NumberField label="One-time windfall ($)" value={windfall} onChange={setWindfall} error={parsedWindfall.error} hint="Bonus, Tax Return, etc." suffix="$" placeholder="0" />
            </div>
          </div>
          <NumberField label="Apply in month #" value={windMonth} onChange={setWindMonth} error={parsedWindMonth.error} placeholder="6" />

          <p className="pt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            2. Liability list
          </p>
          {rows.map((row, index) => (
            <div key={index} className="space-y-2 rounded-xl border border-border/70 bg-muted/20 p-3">
              <div className="flex items-center gap-2">
                <input
                  value={row.name}
                  onChange={(e) => updateRow(index, "name", e.target.value)}
                  placeholder={`Debt ${index + 1}`}
                  aria-label={`Debt ${index + 1} name`}
                  className="h-8 w-full min-w-0 rounded-md border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring md:text-sm"
                />
                {rows.length > 1 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => setRows((current) => current.filter((_, i) => i !== index))}
                    aria-label={`Remove debt ${index + 1}`}
                  >
                    <IconX className="h-4 w-4" />
                  </Button>
                ) : null}
              </div>
              <NumberField label="Balance ($)" value={row.balance} onChange={(v) => updateRow(index, "balance", v)} error={parsedRows[index].balance.error} suffix="$" placeholder="5000" />
              <div className="flex items-start gap-2">
                <div className="min-w-0 flex-1">
                  <NumberField label="Rate (%)" value={row.rate} onChange={(v) => updateRow(index, "rate", v)} error={parsedRows[index].rate.error} suffix="%" placeholder="18" />
                </div>
                <div className="min-w-0 flex-1">
                  <NumberField label="Min payment ($)" value={row.min} onChange={(v) => updateRow(index, "min", v)} error={parsedRows[index].min.error} suffix="$" placeholder="150" />
                </div>
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() =>
              setRows((current) => [
                ...current,
                { name: "", balance: "1000", rate: "10", min: "50" },
              ])
            }
          >
            <IconPlus className="h-4 w-4" />
            Add Row
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => {
              setRows(DEFAULT_ROWS)
              setExtra(DEFAULT_EXTRA)
              setWindfall(DEFAULT_WINDFALL)
              setWindMonth(DEFAULT_WIND_MONTH)
            }}
          >
            <IconRotate className="h-4 w-4" />
            Reset
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {valid && snowball && avalanche ? (
          <ResultsRegion>
            <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs leading-relaxed text-emerald-700 dark:text-emerald-400">
              <IconCircleCheck className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="font-semibold">
                  {avalancheWins ? "Avalanche Wins: Mathematically superior." : "Snowball Wins: Lower total cost."}
                </p>
                <p className="mt-0.5">
                  {avalancheWins ? "Avalanche" : "Snowball"} saves {formatCurrency(saved, 0)} in markup costs.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border/70 bg-muted/20 p-4">
                <p className="text-sm font-bold tracking-tight text-foreground">Snowball Method</p>
                <div className="mt-3 space-y-2">
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Time to freedom</p>
                    <p className="font-mono text-lg font-bold tabular-nums text-foreground">{durationLabel(snowball.months)}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Total markup paid</p>
                    <p className="font-mono text-lg font-bold tabular-nums text-foreground">{formatCurrency(snowball.interest, 0)}</p>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">Focus: Smallest Balance first. Best for psychological momentum.</p>
              </div>
              <div className="rounded-xl border border-primary/40 bg-card p-4 shadow-2xs">
                <p className="text-sm font-bold tracking-tight text-primary">Avalanche Method</p>
                <div className="mt-3 space-y-2">
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Time to freedom</p>
                    <p className="font-mono text-lg font-bold tabular-nums text-foreground">{durationLabel(avalanche.months)}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Total markup paid</p>
                    <p className="font-mono text-lg font-bold tabular-nums text-foreground">{formatCurrency(avalanche.interest, 0)}</p>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">Focus: Highest Rate first. Mathematically saves the most money.</p>
              </div>
            </div>
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter your debts and extra payment"
            description="A side-by-side Snowball vs Avalanche comparison appears here instantly."
          />
        )}
      </div>
    </div>
  )
}
