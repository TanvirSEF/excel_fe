"use client"

import { useState } from "react"
import { IconAlertTriangle, IconRotate } from "@tabler/icons-react"

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
import { payoffSingleDebt, payoffMonths, totalInterestPaid } from "@/lib/accounting"

const DEFAULTS = { balance: "10000", apr: "12", minPayment: "250", extra: "150" }

export function DebtPayoffExtraPaymentsCalculator() {
  const [values, setValues] = useState(DEFAULTS)
  const update = (key: keyof typeof DEFAULTS, value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  const balance = parseNumericInput(values.balance, { min: 1 })
  const apr = parseNumericInput(values.apr, { min: 0, max: 100 })
  const minPayment = parseNumericInput(values.minPayment, { min: 1 })
  const extra = parseNumericInput(values.extra, { min: 0 })

  const valid = balance.value !== null && apr.value !== null && minPayment.value !== null && extra.value !== null

  const debt = valid
    ? { balance: balance.value!, aprPct: apr.value!, minPayment: minPayment.value! }
    : null

  const minOnlyMonths = debt ? payoffMonths(debt.balance, debt.aprPct, debt.minPayment) : null
  const minOnlyInterest = debt ? totalInterestPaid(debt.balance, debt.aprPct, debt.minPayment) : null
  const withExtra = debt && extra.value !== null ? payoffSingleDebt(debt, extra.value!) : null

  const tooSmall = minOnlyMonths === null
  const monthsSaved = withExtra && minOnlyMonths ? minOnlyMonths - withExtra.months : null
  const interestSaved =
    withExtra && minOnlyInterest !== null ? minOnlyInterest - withExtra.totalInterest : null

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Your debt</CardTitle>
          <CardDescription>
            One debt, your minimum payment, and the extra you can add each month.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <NumberField label="Current balance" value={values.balance} onChange={(v) => update("balance", v)} error={balance.error} suffix="$" placeholder="10000" />
          <NumberField label="APR" value={values.apr} onChange={(v) => update("apr", v)} error={apr.error} suffix="%" placeholder="12" />
          <NumberField label="Minimum payment" value={values.minPayment} onChange={(v) => update("minPayment", v)} error={minPayment.error} suffix="$" placeholder="250" />
          <NumberField label="Extra payment / month" value={values.extra} onChange={(v) => update("extra", v)} error={extra.error} suffix="$" placeholder="150" />
          <Button type="button" variant="outline" className="w-full" onClick={() => setValues(DEFAULTS)}>
            <IconRotate className="h-4 w-4" />
            Reset to example
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {valid && withExtra && !withExtra.neverPaidOff ? (
          <ResultsRegion>
            <GradientHeroMetric
              label="Debt-free in"
              value={`${Math.floor(withExtra.months / 12)} yr ${withExtra.months % 12} mo`}
              sub={`With the extra payment — down from ${Math.floor((minOnlyMonths ?? 0) / 12)} yr ${(minOnlyMonths ?? 0) % 12} mo on minimums`}
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <MetricTile
                label="Months saved"
                value={monthsSaved !== null ? `${monthsSaved}` : "—"}
                sub={`${Math.floor((monthsSaved ?? 0) / 12)} yr ${(monthsSaved ?? 0) % 12} mo faster`}
              />
              <MetricTile
                label="Interest saved"
                value={interestSaved !== null ? formatCurrency(interestSaved, 0) : "—"}
                sub="Extra payments attack principal directly"
              />
              <MetricTile
                label="Interest on minimums"
                value={minOnlyInterest !== null ? formatCurrency(minOnlyInterest, 0) : "—"}
                sub={`${minOnlyMonths} months of payments`}
              />
              <MetricTile
                label="Interest with extra"
                value={formatCurrency(withExtra.totalInterest, 0)}
                sub={`${withExtra.months} months of payments`}
              />
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground">
              Extra payments go straight to principal, so every future month&apos;s
              interest shrinks too — that snowball is why ${extra.value} extra cuts years,
              not months, off long debts.
            </p>
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title={
              tooSmall
                ? "Payment too small — interest grows faster than you pay"
                : "Enter the debt details"
            }
            description={
              tooSmall
                ? "The payment must beat the monthly interest charge. Increase the minimum payment to make progress."
                : "Your debt-free date with and without extra payments appears here."
            }
          />
        )}
        {tooSmall ? (
          <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs leading-relaxed text-amber-700 dark:text-amber-400">
            <IconAlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              At this APR, the debt accrues {formatCurrency((balance.value ?? 0) * ((apr.value ?? 0) / 100 / 12))} of
              interest per month — payments below that never pay the debt down.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
