"use client"

import { useState } from "react"
import { IconAlertTriangle, IconCircleCheck, IconInfoCircle, IconRotate } from "@tabler/icons-react"

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
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { parseNumericInput } from "@/lib/calculators"
import { formatCurrency, formatPercent } from "@/lib/format"

const DEFAULTS = {
  bonus: "10000",
  payout: "100",
  periodStart: "2026-01-01",
  periodEnd: "2026-12-31",
  empStart: "2026-07-01",
  empEnd: "",
}

function dayNumber(dateString: string): number | null {
  const date = new Date(`${dateString}T00:00:00Z`)
  if (Number.isNaN(date.getTime())) return null
  return Math.floor(date.getTime() / 86400000)
}

export function ProratedBonusCalculator() {
  const [values, setValues] = useState(DEFAULTS)
  const update = (key: keyof typeof DEFAULTS, value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  const bonus = parseNumericInput(values.bonus, { min: 0 })
  const payout = parseNumericInput(values.payout, { min: 0, max: 1000 })

  const periodStart = dayNumber(values.periodStart)
  const periodEnd = dayNumber(values.periodEnd)
  const empStart = dayNumber(values.empStart)
  const empEnd = values.empEnd === "" ? null : dayNumber(values.empEnd)

  const valid =
    bonus.value !== null &&
    payout.value !== null &&
    periodStart !== null &&
    periodEnd !== null &&
    empStart !== null &&
    periodEnd > periodStart &&
    (empEnd === null || empEnd >= empStart)

  const periodDays = valid ? periodEnd! - periodStart! + 1 : 0
  const overlapStart = valid ? Math.max(empStart!, periodStart!) : 0
  const overlapEnd = valid ? Math.min(empEnd ?? periodEnd!, periodEnd!) : 0
  const eligibleDays = valid ? Math.max(0, overlapEnd - overlapStart + 1) : 0
  const proration = valid && periodDays > 0 ? (eligibleDays / periodDays) * 100 : 0
  const proratedBonus =
    valid ? (bonus.value! * proration) / 100 * (payout.value! / 100) : 0

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Enter bonus details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            1. Target amounts
          </p>
          <NumberField label="Full bonus amount ($)" value={values.bonus} onChange={(v) => update("bonus", v)} error={bonus.error} suffix="$" placeholder="10000" />
          <NumberField label="Payout percentage" value={values.payout} onChange={(v) => update("payout", v)} error={payout.error} hint="Performance Factor" suffix="%" placeholder="100" />

          <p className="pt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            2. Fiscal period (e.g. Jan – Dec)
          </p>
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">Period start</p>
              <Input type="date" value={values.periodStart} onChange={(e) => update("periodStart", e.target.value)} aria-label="Period start" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">Period end</p>
              <Input type="date" value={values.periodEnd} onChange={(e) => update("periodEnd", e.target.value)} aria-label="Period end" />
            </div>
          </div>

          <p className="pt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            3. Employment dates
          </p>
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">Start date</p>
              <Input type="date" value={values.empStart} onChange={(e) => update("empStart", e.target.value)} aria-label="Employment start" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">End date (optional)</p>
              <Input type="date" value={values.empEnd} onChange={(e) => update("empEnd", e.target.value)} aria-label="Employment end" />
              <p className="mt-1 text-[11px] text-muted-foreground">Leave blank if active</p>
            </div>
          </div>

          <Button type="button" variant="outline" className="w-full" onClick={() => setValues(DEFAULTS)}>
            <IconRotate className="h-4 w-4" />
            Reset
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {valid ? (
          <ResultsRegion>
            <GradientHeroMetric
              label="Prorated bonus pay"
              value={formatCurrency(proratedBonus)}
            />

            {eligibleDays === 0 ? (
              <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs leading-relaxed text-amber-700 dark:text-amber-400">
                <IconAlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>No Eligible Days: Employment falls outside the bonus period.</p>
              </div>
            ) : proration >= 99.95 ? (
              <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs leading-relaxed text-emerald-700 dark:text-emerald-400">
                <IconCircleCheck className="mt-0.5 h-4 w-4 shrink-0" />
                <p>Full Reward: Complete period worked.</p>
              </div>
            ) : (
              <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs leading-relaxed text-emerald-700 dark:text-emerald-400">
                <IconInfoCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>Partial Reward: Adjusted for time worked.</p>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-3">
              <MetricTile label="Eligible days" value={`${eligibleDays} days`} sub="Your overlap with the period" />
              <MetricTile label="Period length" value={`${periodDays} days`} sub="Full bonus period" />
              <MetricTile label="Proration %" value={formatPercent(proration, 2)} sub="Eligible ÷ total days" />
            </div>
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter your bonus details"
            description="Your prorated bonus and eligible days appear here instantly."
          />
        )}
      </div>
    </div>
  )
}
