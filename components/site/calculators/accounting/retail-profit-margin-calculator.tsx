"use client"

import { useState } from "react"
import { IconRotate } from "@tabler/icons-react"

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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { parseNumericInput } from "@/lib/calculators"
import { formatCurrency, formatPercent } from "@/lib/format"

const ANALYZE_DEFAULTS = { cost: "50", price: "100", quantity: "1", tax: "0" }
const PRICE_DEFAULTS = { cost: "4.50", margin: "60" }

export function RetailProfitMarginCalculator() {
  const [mode, setMode] = useState<"analyze" | "price">("analyze")
  const [analyze, setAnalyze] = useState(ANALYZE_DEFAULTS)
  const [price, setPrice] = useState(PRICE_DEFAULTS)

  const cost = parseNumericInput(analyze.cost, { min: 0.000001 })
  const sellPrice = parseNumericInput(analyze.price, { min: 0.000001 })
  const quantity = parseNumericInput(analyze.quantity, { min: 1, integer: true })
  const tax = parseNumericInput(analyze.tax, { min: 0, max: 100 })

  const analyzeValid = [cost, sellPrice, quantity, tax].every((f) => f.value !== null)

  const profitPerUnit = analyzeValid ? sellPrice.value! - cost.value! : 0
  const netProfit = analyzeValid ? profitPerUnit * quantity.value! : 0
  const markup = analyzeValid ? (profitPerUnit / cost.value!) * 100 : null
  const margin = analyzeValid ? (profitPerUnit / sellPrice.value!) * 100 : null
  const totalWithTax = analyzeValid
    ? sellPrice.value! * quantity.value! * (1 + tax.value! / 100)
    : 0

  const targetCost = parseNumericInput(price.cost, { min: 0.000001 })
  const targetMargin = parseNumericInput(price.margin, { min: 0.01, max: 99.99 })

  const priceValid = targetCost.value !== null && targetMargin.value !== null
  const suggestedPrice =
    priceValid ? targetCost.value! / (1 - targetMargin.value! / 100) : 0
  const profitAtPrice = priceValid ? suggestedPrice - targetCost.value! : 0
  const markupAtPrice =
    priceValid ? (profitAtPrice / targetCost.value!) * 100 : null

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Retail profit analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs
            value={mode}
            onValueChange={(value) => setMode(value === "price" ? "price" : "analyze")}
          >
            <TabsList className="w-full">
              <TabsTrigger value="analyze" className="flex-1">
                Analyze Profit
              </TabsTrigger>
              <TabsTrigger value="price" className="flex-1">
                Calculate Price
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {mode === "analyze" ? (
            <>
              <div className="flex items-start gap-2">
                <div className="min-w-0 flex-1">
                  <NumberField label="Unit cost ($)" value={analyze.cost} onChange={(v) => setAnalyze((c) => ({ ...c, cost: v }))} error={cost.error} suffix="$" placeholder="50" />
                </div>
                <div className="min-w-0 flex-1">
                  <NumberField label="Selling price ($)" value={analyze.price} onChange={(v) => setAnalyze((c) => ({ ...c, price: v }))} error={sellPrice.error} suffix="$" placeholder="100" />
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="min-w-0 flex-1">
                  <NumberField label="Quantity" value={analyze.quantity} onChange={(v) => setAnalyze((c) => ({ ...c, quantity: v }))} error={quantity.error} placeholder="1" />
                </div>
                <div className="min-w-0 flex-1">
                  <NumberField label="Sales tax (%)" value={analyze.tax} onChange={(v) => setAnalyze((c) => ({ ...c, tax: v }))} error={tax.error} suffix="%" placeholder="0" />
                </div>
              </div>
              <Button type="button" variant="outline" className="w-full" onClick={() => setAnalyze(ANALYZE_DEFAULTS)}>
                <IconRotate className="h-4 w-4" />
                Reset
              </Button>
            </>
          ) : (
            <>
              <NumberField label="Unit cost ($)" value={price.cost} onChange={(v) => setPrice((c) => ({ ...c, cost: v }))} error={targetCost.error} suffix="$" placeholder="4.50" />
              <NumberField label="Target margin (%)" value={price.margin} onChange={(v) => setPrice((c) => ({ ...c, margin: v }))} error={targetMargin.error} suffix="%" placeholder="60" />
              <Button type="button" variant="outline" className="w-full" onClick={() => setPrice(PRICE_DEFAULTS)}>
                <IconRotate className="h-4 w-4" />
                Reset
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {mode === "analyze" && analyzeValid ? (
          <ResultsRegion>
            <GradientHeroMetric
              label="Total net profit"
              value={formatCurrency(netProfit)}
            />

            <div className="grid gap-3 sm:grid-cols-3">
              <MetricTile label="Markup" value={markup !== null ? formatPercent(markup, 2) : "—"} sub="Profit ÷ cost" />
              <MetricTile label="Gross margin" value={margin !== null ? formatPercent(margin, 2) : "—"} sub="Profit ÷ price" />
              <MetricTile label="Total + tax" value={formatCurrency(totalWithTax)} sub="What customers pay" />
            </div>
          </ResultsRegion>
        ) : mode === "price" && priceValid ? (
          <ResultsRegion>
            <GradientHeroMetric
              label="Suggested selling price"
              value={formatCurrency(suggestedPrice)}
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <MetricTile label="Profit per unit" value={formatCurrency(profitAtPrice)} sub="Price − cost" />
              <MetricTile label="Implied markup" value={markupAtPrice !== null ? formatPercent(markupAtPrice, 2) : "—"} sub="Profit ÷ cost" />
            </div>
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter your numbers"
            description="Profit, margin, markup and the right selling price appear here instantly."
          />
        )}
      </div>
    </div>
  )
}
