"use client"

import { useState } from "react"
import { IconAlertTriangle, IconCircleCheck, IconRotate } from "@tabler/icons-react"

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
import { parseNumericInput } from "@/lib/calculators"
import { formatCurrency, formatDecimal, formatPercent } from "@/lib/format"

const DEFAULTS = {
  leads: "500",
  leadToSql: "25",
  sqlToWin: "15",
  dealValue: "15000",
  adSpend: "5000",
  personnel: "3500",
  software: "500",
}

export function B2bRoiCalculator() {
  const [values, setValues] = useState(DEFAULTS)
  const update = (key: keyof typeof DEFAULTS, value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  const leads = parseNumericInput(values.leads, { min: 0 })
  const leadToSql = parseNumericInput(values.leadToSql, { min: 0, max: 100 })
  const sqlToWin = parseNumericInput(values.sqlToWin, { min: 0, max: 100 })
  const dealValue = parseNumericInput(values.dealValue, { min: 0 })
  const adSpend = parseNumericInput(values.adSpend, { min: 0 })
  const personnel = parseNumericInput(values.personnel, { min: 0 })
  const software = parseNumericInput(values.software, { min: 0 })

  const valid = [leads, leadToSql, sqlToWin, dealValue, adSpend, personnel, software].every(
    (field) => field.value !== null
  )

  const sqls = valid ? leads.value! * (leadToSql.value! / 100) : 0
  const monthlyWins = valid ? sqls * (sqlToWin.value! / 100) : 0
  const monthlyRevenue = valid ? monthlyWins * dealValue.value! : 0
  const monthlySpend = valid ? adSpend.value! + personnel.value! + software.value! : 0
  const monthlyNet = valid ? monthlyRevenue - monthlySpend : 0
  const annualNet = monthlyNet * 12
  const roi = valid && monthlySpend > 0 ? (monthlyNet / monthlySpend) * 100 : null
  const cac = valid && monthlyWins > 0 ? monthlySpend / monthlyWins : null
  const profitable = monthlyNet > 0

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Enter B2B campaign metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            1. Funnel &amp; sales metrics
          </p>
          <NumberField label="Marketing leads / month" value={values.leads} onChange={(v) => update("leads", v)} error={leads.error} placeholder="500" />
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <NumberField label="Lead-to-SQL (%)" value={values.leadToSql} onChange={(v) => update("leadToSql", v)} error={leadToSql.error} suffix="%" placeholder="25" />
            </div>
            <div className="min-w-0 flex-1">
              <NumberField label="SQL-to-win (%)" value={values.sqlToWin} onChange={(v) => update("sqlToWin", v)} error={sqlToWin.error} suffix="%" placeholder="15" />
            </div>
          </div>
          <NumberField label="Average deal value ($)" value={values.dealValue} onChange={(v) => update("dealValue", v)} error={dealValue.error} suffix="$" placeholder="15000" />

          <p className="pt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            2. Campaign costs
          </p>
          <NumberField label="Advertising and marketing spend ($)" value={values.adSpend} onChange={(v) => update("adSpend", v)} error={adSpend.error} suffix="$" placeholder="5000" />
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <NumberField label="Sales operations &amp; personnel ($)" value={values.personnel} onChange={(v) => update("personnel", v)} error={personnel.error} suffix="$" placeholder="3500" />
            </div>
            <div className="min-w-0 flex-1">
              <NumberField label="Software and misc cost ($)" value={values.software} onChange={(v) => update("software", v)} error={software.error} suffix="$" placeholder="500" />
            </div>
          </div>

          <Button type="button" variant="outline" className="w-full" onClick={() => setValues(DEFAULTS)}>
            <IconRotate className="h-4 w-4" />
            Reset
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {valid && roi !== null ? (
          <ResultsRegion>
            <GradientHeroMetric
              label="Annual return yield"
              value={formatPercent(roi, 0)}
              sub={`${formatCurrency(annualNet, 0)}/yr`}
            />

            {profitable ? (
              <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs leading-relaxed text-emerald-700 dark:text-emerald-400">
                <IconCircleCheck className="mt-0.5 h-4 w-4 shrink-0" />
                <p>Positive Yield: Campaign is scaling effectively.</p>
              </div>
            ) : (
              <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs leading-relaxed text-amber-700 dark:text-amber-400">
                <IconAlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>Negative Yield: Campaign is losing money.</p>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <MetricTile label="Customer acquisition cost" value={cac !== null ? formatCurrency(cac) : "—"} sub="Spend ÷ monthly wins" />
              <MetricTile label="Monthly wins" value={formatDecimal(monthlyWins, 1)} sub="SQLs × win rate" />
              <MetricTile label="Monthly revenue" value={formatCurrency(monthlyRevenue, 0)} sub="Wins × deal value" />
              <MetricTile label="Monthly campaign spend" value={formatCurrency(monthlySpend, 0)} sub="Ads + personnel + software" />
            </div>
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter your B2B campaign metrics"
            description="Annual yield, CAC, wins and revenue appear here instantly."
          />
        )}
      </div>
    </div>
  )
}
