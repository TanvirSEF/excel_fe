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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { parseNumericInput } from "@/lib/calculators"
import {
  calculateMargin,
  calculateRequiredPrice,
} from "@/lib/calc-margin"
import {
  formatCurrency,
  formatMultiple,
  formatPercent,
} from "@/lib/format"

const DEFAULTS = {
  cost: "60",
  price: "100",
  targetMargin: "40",
}

export function ProfitMarginCalculator() {
  const [mode, setMode] = useState<"forward" | "reverse">("forward")
  const [cost, setCost] = useState(DEFAULTS.cost)
  const [price, setPrice] = useState(DEFAULTS.price)
  const [targetMargin, setTargetMargin] = useState(DEFAULTS.targetMargin)

  const costInput = parseNumericInput(cost, { min: 0 })
  const priceInput = parseNumericInput(price, { min: 0.01 })
  const targetMarginInput = parseNumericInput(targetMargin, {
    min: 0.01,
    max: 99.99,
  })

  const result =
    costInput.value === null
      ? null
      : mode === "forward"
        ? priceInput.value === null
          ? null
          : calculateMargin(costInput.value, priceInput.value)
        : targetMarginInput.value === null
          ? null
          : calculateRequiredPrice(costInput.value, targetMarginInput.value)

  const invalid =
    costInput.error !== null ||
    (mode === "forward" && priceInput.error !== null) ||
    (mode === "reverse" && targetMarginInput.error !== null)

  const sellingAtLoss = mode === "forward" && result !== null && result.grossProfit < 0

  function reset() {
    setCost(DEFAULTS.cost)
    setPrice(DEFAULTS.price)
    setTargetMargin(DEFAULTS.targetMargin)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Pricing inputs</CardTitle>
          <CardDescription>
            {mode === "forward"
              ? "Margin and markup from a known cost and selling price."
              : "The selling price that hits your target margin on a given cost."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs
            value={mode}
            onValueChange={(value) =>
              setMode(value === "reverse" ? "reverse" : "forward")
            }
          >
            <TabsList className="w-full">
              <TabsTrigger value="forward" className="flex-1">
                Margin from price
              </TabsTrigger>
              <TabsTrigger value="reverse" className="flex-1">
                Price from margin
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <NumberField
            label="Unit cost"
            value={cost}
            onChange={setCost}
            error={costInput.error}
            hint="What one unit costs you to produce or buy"
            suffix="$"
            placeholder="60"
          />

          {mode === "forward" ? (
            <NumberField
              label="Selling price"
              value={price}
              onChange={setPrice}
              error={priceInput.error}
              hint="What you charge the customer"
              suffix="$"
              placeholder="100"
            />
          ) : (
            <NumberField
              label="Target gross margin"
              value={targetMargin}
              onChange={setTargetMargin}
              error={targetMarginInput.error}
              hint="Margin below 100% — higher is mathematically impossible"
              suffix="%"
              placeholder="40"
            />
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={reset}
            className="w-full gap-1.5"
          >
            <IconRotate className="h-3.5 w-3.5" />
            Reset to example
          </Button>
        </CardContent>
      </Card>

      <div className="lg:col-span-3">
        {result && !invalid ? (
          <div className="space-y-3 lg:sticky lg:top-24">
            <ResultsRegion>
              {mode === "forward" ? (
                <GradientHeroMetric
                  label="Gross profit margin"
                  value={formatPercent(result.marginPercent)}
                  sub="(Price − Cost) ÷ Price — the share of revenue you keep"
                />
              ) : (
                <GradientHeroMetric
                  label="Required selling price"
                  value={formatCurrency(costInput.value !== null && targetMarginInput.value !== null
                    ? costInput.value / (1 - targetMarginInput.value / 100)
                    : 0)}
                  sub={`Cost ÷ (1 − ${targetMarginInput.value ?? 0}%) to hit your target margin`}
                />
              )}

              <div className="grid grid-cols-2 gap-3">
                <MetricTile
                  label="Markup on cost"
                  value={
                    result.markupPercent === null
                      ? "—"
                      : formatPercent(result.markupPercent)
                  }
                  sub="(Price − Cost) ÷ Cost — how much you add on top"
                />
                <MetricTile
                  label="Gross profit per unit"
                  value={formatCurrency(result.grossProfit)}
                  sub="Price − Cost"
                />
                <MetricTile
                  label="Price-to-cost multiple"
                  value={formatMultiple(result.multiple)}
                  sub="Price ÷ Cost"
                />
                <MetricTile
                  label={mode === "forward" ? "Margin (check)" : "Achieved margin"}
                  value={formatPercent(result.marginPercent)}
                  sub={mode === "forward" ? "Same as the headline figure" : "Matches your target by construction"}
                />
              </div>
            </ResultsRegion>

            {sellingAtLoss ? (
              <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs leading-relaxed text-amber-700 dark:text-amber-400">
                <IconAlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  The selling price is below unit cost — margin and markup are
                  negative. Double-check the two values.
                </p>
              </div>
            ) : null}
          </div>
        ) : (
          <ResultsPlaceholder
            title={invalid ? "Fix the highlighted fields" : "Enter cost and price"}
            description="Margin, markup and per-unit profit appear here as soon as the inputs are valid."
          />
        )}
      </div>
    </div>
  )
}
