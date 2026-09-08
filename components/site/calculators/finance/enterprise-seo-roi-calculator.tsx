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
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format"

const DEFAULTS = {
  traffic: "50000",
  cvr: "2.5",
  closeRate: "20",
  aov: "1500",
  agency: "4000",
  salary: "5000",
  software: "5000",
}

export function EnterpriseSeoRoiCalculator() {
  const [values, setValues] = useState(DEFAULTS)
  const update = (key: keyof typeof DEFAULTS, value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  const traffic = parseNumericInput(values.traffic, { min: 0 })
  const cvr = parseNumericInput(values.cvr, { min: 0, max: 100 })
  const closeRate = parseNumericInput(values.closeRate, { min: 0, max: 100 })
  const aov = parseNumericInput(values.aov, { min: 0 })
  const agency = parseNumericInput(values.agency, { min: 0 })
  const salary = parseNumericInput(values.salary, { min: 0 })
  const software = parseNumericInput(values.software, { min: 0 })

  const valid = [traffic, cvr, closeRate, aov, agency, salary, software].every(
    (field) => field.value !== null
  )

  const leads = valid ? traffic.value! * (cvr.value! / 100) : 0
  const customers = valid ? leads * (closeRate.value! / 100) : 0
  const monthlyRevenue = valid ? customers * aov.value! : 0
  const monthlySpend = valid ? agency.value! + salary.value! + software.value! : 0
  const netProfit = valid ? monthlyRevenue - monthlySpend : 0
  const roi = valid && monthlySpend > 0 ? (netProfit / monthlySpend) * 100 : null
  const cac = valid && customers > 0 ? monthlySpend / customers : null
  const profitable = netProfit > 0

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Enter campaign metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            1. Traffic &amp; performance
          </p>
          <NumberField label="Monthly traffic" value={values.traffic} onChange={(v) => update("traffic", v)} error={traffic.error} placeholder="50000" />
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <NumberField label="Conversion rate (%)" value={values.cvr} onChange={(v) => update("cvr", v)} error={cvr.error} suffix="%" placeholder="2.5" />
            </div>
            <div className="min-w-0 flex-1">
              <NumberField label="Lead-to-close rate" value={values.closeRate} onChange={(v) => update("closeRate", v)} error={closeRate.error} suffix="%" placeholder="20" />
            </div>
          </div>
          <NumberField label="Average sale ($)" value={values.aov} onChange={(v) => update("aov", v)} error={aov.error} suffix="$" placeholder="1500" />

          <p className="pt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            2. Monthly investment
          </p>
          <NumberField label="Agency fee ($)" value={values.agency} onChange={(v) => update("agency", v)} error={agency.error} suffix="$" placeholder="4000" />
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <NumberField label="Internal team salary ($)" value={values.salary} onChange={(v) => update("salary", v)} error={salary.error} suffix="$" placeholder="5000" />
            </div>
            <div className="min-w-0 flex-1">
              <NumberField label="Software and tools ($)" value={values.software} onChange={(v) => update("software", v)} error={software.error} suffix="$" placeholder="5000" />
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
              label="Monthly ROI"
              value={formatPercent(roi, 0)}
              sub={formatCurrency(netProfit, 0)}
            />

            {profitable ? (
              <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs leading-relaxed text-emerald-700 dark:text-emerald-400">
                <IconCircleCheck className="mt-0.5 h-4 w-4 shrink-0" />
                <p>Profitable Campaign: Strategy is working.</p>
              </div>
            ) : (
              <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs leading-relaxed text-amber-700 dark:text-amber-400">
                <IconAlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>Unprofitable Campaign: Strategy needs review.</p>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <MetricTile label="Monthly revenue" value={formatCurrency(monthlyRevenue, 0)} sub="Sales × average sale" />
              <MetricTile label="Monthly spend" value={formatCurrency(monthlySpend, 0)} sub="Agency + salary + tools" />
              <MetricTile label="Leads generated" value={formatNumber(leads)} sub="Traffic × conversion rate" />
              <MetricTile label="Customer acquisition cost" value={cac !== null ? formatCurrency(cac) : "—"} sub="Spend ÷ closed customers" />
            </div>
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter your campaign metrics"
            description="Monthly ROI, revenue, leads and CAC appear here instantly."
          />
        )}
      </div>
    </div>
  )
}
