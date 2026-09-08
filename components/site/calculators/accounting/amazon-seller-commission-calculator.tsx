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
import { parseNumericInput } from "@/lib/calculators"
import { formatCurrency, formatPercent } from "@/lib/format"

const DEFAULTS = {
  price: "29.99",
  referral: "15",
  closing: "0",
  fulfillment: "5.40",
  storage: "0.20",
  inbound: "0.50",
  cogs: "6.00",
  prep: "0.50",
}

function marginVerdict(margin: number): {
  kind: "healthy" | "viable" | "thin"
  text: string
} {
  if (margin >= 25) return { kind: "healthy", text: "Healthy Product: Margin is excellent (25%+)." }
  if (margin >= 15) return { kind: "viable", text: "Viable Product: Margin is workable." }
  return { kind: "thin", text: "Thin Product: Margin is too thin." }
}

export function AmazonSellerCommissionCalculator() {
  const [values, setValues] = useState(DEFAULTS)
  const update = (key: keyof typeof DEFAULTS, value: string) =>
    setValues((current) => ({ ...current, [key]: value }))

  const price = parseNumericInput(values.price, { min: 0.000001 })
  const referral = parseNumericInput(values.referral, { min: 0, max: 100 })
  const closing = parseNumericInput(values.closing, { min: 0 })
  const fulfillment = parseNumericInput(values.fulfillment, { min: 0 })
  const storage = parseNumericInput(values.storage, { min: 0 })
  const inbound = parseNumericInput(values.inbound, { min: 0 })
  const cogs = parseNumericInput(values.cogs, { min: 0 })
  const prep = parseNumericInput(values.prep, { min: 0 })

  const valid = [price, referral, closing, fulfillment, storage, inbound, cogs, prep].every(
    (field) => field.value !== null
  )

  const referralAmount = valid ? price.value! * (referral.value! / 100) : 0
  const totalAmazonFees = valid
    ? referralAmount + closing.value! + fulfillment.value! + storage.value!
    : 0
  const investedPerUnit = valid ? cogs.value! + prep.value! + inbound.value! : 0
  const netProfit = valid
    ? price.value! - totalAmazonFees - inbound.value! - cogs.value! - prep.value!
    : 0
  const netMargin = valid && price.value! > 0 ? (netProfit / price.value!) * 100 : null
  const returnOnCapital =
    valid && investedPerUnit > 0 ? (netProfit / investedPerUnit) * 100 : null
  const verdict = netMargin !== null ? marginVerdict(netMargin) : null

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Enter product economics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            1. Sale price &amp; commission
          </p>
          <NumberField label="Selling price ($)" value={values.price} onChange={(v) => update("price", v)} error={price.error} suffix="$" placeholder="29.99" />
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <NumberField label="Referral fee (%)" value={values.referral} onChange={(v) => update("referral", v)} error={referral.error} hint="Usually 15%" suffix="%" placeholder="15" />
            </div>
            <div className="min-w-0 flex-1">
              <NumberField label="Closing fee ($)" value={values.closing} onChange={(v) => update("closing", v)} error={closing.error} hint="For Books/Media" suffix="$" placeholder="0" />
            </div>
          </div>

          <p className="pt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            2. FBA &amp; logistics fees
          </p>
          <NumberField label="Fulfillment fee ($)" value={values.fulfillment} onChange={(v) => update("fulfillment", v)} error={fulfillment.error} hint="Pick & Pack" suffix="$" placeholder="5.40" />
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <NumberField label="Monthly storage ($)" value={values.storage} onChange={(v) => update("storage", v)} error={storage.error} suffix="$" placeholder="0.20" />
            </div>
            <div className="min-w-0 flex-1">
              <NumberField label="Inbound shipping ($)" value={values.inbound} onChange={(v) => update("inbound", v)} error={inbound.error} hint="Ship to Warehouse" suffix="$" placeholder="0.50" />
            </div>
          </div>

          <p className="pt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            3. Manufacturing &amp; prep
          </p>
          <NumberField label="Unit cost (COGS)" value={values.cogs} onChange={(v) => update("cogs", v)} error={cogs.error} suffix="$" placeholder="6.00" />
          <NumberField label="Prep &amp; labeling ($)" value={values.prep} onChange={(v) => update("prep", v)} error={prep.error} suffix="$" placeholder="0.50" />

          <Button type="button" variant="outline" className="w-full" onClick={() => setValues(DEFAULTS)}>
            <IconRotate className="h-4 w-4" />
            Reset
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {valid && netMargin !== null && verdict ? (
          <ResultsRegion>
            <GradientHeroMetric
              label="Net profit per unit"
              value={formatCurrency(netProfit)}
            />

            {verdict.kind === "thin" ? (
              <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs leading-relaxed text-amber-700 dark:text-amber-400">
                <IconAlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>{verdict.text}</p>
              </div>
            ) : (
              <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs leading-relaxed text-emerald-700 dark:text-emerald-400">
                {verdict.kind === "viable" ? (
                  <IconInfoCircle className="mt-0.5 h-4 w-4 shrink-0" />
                ) : (
                  <IconCircleCheck className="mt-0.5 h-4 w-4 shrink-0" />
                )}
                <p>{verdict.text}</p>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <MetricTile label="Net margin" value={formatPercent(netMargin, 2)} sub="Profit ÷ selling price" />
              <MetricTile label="Return on capital" value={returnOnCapital !== null ? formatPercent(returnOnCapital, 0) : "—"} sub="Profit ÷ cash invested per unit" />
              <MetricTile label="Total Amazon fees" value={formatCurrency(totalAmazonFees)} sub="Referral + closing + FBA + storage" />
              <MetricTile label="Referral amt" value={formatCurrency(referralAmount)} sub={`${referral.value}% of selling price`} />
            </div>
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter your product economics"
            description="Net profit, margin and total Amazon fees appear here instantly."
          />
        )}
      </div>
    </div>
  )
}
