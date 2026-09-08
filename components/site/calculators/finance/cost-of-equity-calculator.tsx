"use client"

import { useState } from "react"
import {
  IconAlertTriangle,
  IconCircleCheck,
  IconInfoCircle,
  IconRotate,
} from "@tabler/icons-react"

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
import { formatPercent } from "@/lib/format"

const CAPM_DEFAULTS = { rf: "4.2", beta: "1.2", market: "10" }
const DCM_DEFAULTS = { d1: "2", p0: "40", g: "5" }

function keVerdict(ke: number): { kind: "low" | "moderate" | "high"; text: string } {
  if (ke < 8) return { kind: "low", text: "Low: Below the typical market range." }
  if (ke <= 13)
    return { kind: "moderate", text: "Moderate: Standard market risk." }
  return { kind: "high", text: "High: Above the typical market range." }
}

export function CostOfEquityCalculator() {
  const [mode, setMode] = useState<"capm" | "dcm">("capm")
  const [capm, setCapm] = useState(CAPM_DEFAULTS)
  const [dcm, setDcm] = useState(DCM_DEFAULTS)

  const rf = parseNumericInput(capm.rf, { min: 0, max: 100 })
  const beta = parseNumericInput(capm.beta, { min: 0 })
  const market = parseNumericInput(capm.market, { min: 0, max: 100 })

  const d1 = parseNumericInput(dcm.d1, { min: 0.000001 })
  const p0 = parseNumericInput(dcm.p0, { min: 0.000001 })
  const g = parseNumericInput(dcm.g, { min: 0, max: 100 })

  const capmValid =
    rf.value !== null && beta.value !== null && market.value !== null
  const dcmValid = d1.value !== null && p0.value !== null && g.value !== null

  const premium = capmValid ? market.value! - rf.value! : null
  const capmKe =
    capmValid && premium !== null ? rf.value! + beta.value! * premium : null
  const dividendYield = dcmValid ? (d1.value! / p0.value!) * 100 : null
  const dcmKe = dividendYield !== null ? dividendYield + g.value! : null

  const ke = mode === "capm" ? capmKe : dcmKe
  const verdict = ke !== null ? keVerdict(ke) : null

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Enter equity parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs
            value={mode}
            onValueChange={(value) => setMode(value === "dcm" ? "dcm" : "capm")}
          >
            <TabsList className="w-full">
              <TabsTrigger value="capm" className="flex-1">
                CAPM Method
              </TabsTrigger>
              <TabsTrigger value="dcm" className="flex-1">
                Dividend Model
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {mode === "capm" ? (
            <>
              <NumberField
                label="Benchmark return (%)"
                value={capm.rf}
                onChange={(v) => setCapm((c) => ({ ...c, rf: v }))}
                error={rf.error}
                hint="e.g. 10y Government Benchmark"
                suffix="%"
                placeholder="4.2"
              />
              <NumberField
                label="Beta (β)"
                value={capm.beta}
                onChange={(v) => setCapm((c) => ({ ...c, beta: v }))}
                error={beta.error}
                hint="Volatility Measure"
                placeholder="1.2"
              />
              <NumberField
                label="Market return (%)"
                value={capm.market}
                onChange={(v) => setCapm((c) => ({ ...c, market: v }))}
                error={market.error}
                hint="Expected Market Average"
                suffix="%"
                placeholder="10"
              />
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setCapm(CAPM_DEFAULTS)}
              >
                <IconRotate className="h-4 w-4" />
                Reset
              </Button>
            </>
          ) : (
            <>
              <NumberField
                label="Dividend next year — D1 ($)"
                value={dcm.d1}
                onChange={(v) => setDcm((c) => ({ ...c, d1: v }))}
                error={d1.error}
                suffix="$"
                placeholder="2"
              />
              <NumberField
                label="Current stock price — P0 ($)"
                value={dcm.p0}
                onChange={(v) => setDcm((c) => ({ ...c, p0: v }))}
                error={p0.error}
                suffix="$"
                placeholder="40"
              />
              <NumberField
                label="Dividend growth rate — g (%)"
                value={dcm.g}
                onChange={(v) => setDcm((c) => ({ ...c, g: v }))}
                error={g.error}
                suffix="%"
                placeholder="5"
              />
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setDcm(DCM_DEFAULTS)}
              >
                <IconRotate className="h-4 w-4" />
                Reset
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {ke !== null && verdict ? (
          <ResultsRegion>
            <GradientHeroMetric
              label="Cost of equity (Ke)"
              value={formatPercent(ke, 2)}
              sub={mode === "capm" ? "CAPM Approach" : "Dividend Model"}
            />

            {verdict.kind === "high" ? (
              <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs leading-relaxed text-amber-700 dark:text-amber-400">
                <IconAlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>{verdict.text}</p>
              </div>
            ) : (
              <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs leading-relaxed text-emerald-700 dark:text-emerald-400">
                {verdict.kind === "low" ? (
                  <IconCircleCheck className="mt-0.5 h-4 w-4 shrink-0" />
                ) : (
                  <IconInfoCircle className="mt-0.5 h-4 w-4 shrink-0" />
                )}
                <p>{verdict.text}</p>
              </div>
            )}

            {mode === "capm" && premium !== null ? (
              <div className="grid gap-3 sm:grid-cols-3">
                <MetricTile label="Risk-free rate" value={formatPercent(rf.value!, 2)} sub="The baseline return" />
                <MetricTile label="Equity risk premium" value={formatPercent(premium, 2)} sub="Rm − Rf" />
                <MetricTile label="Beta-adjusted premium" value={formatPercent(beta.value! * premium, 2)} sub={`β × premium`} />
              </div>
            ) : null}

            {mode === "dcm" && dividendYield !== null ? (
              <div className="grid gap-3 sm:grid-cols-3">
                <MetricTile label="Dividend yield" value={formatPercent(dividendYield, 2)} sub="D1 ÷ P0" />
                <MetricTile label="Dividend growth" value={formatPercent(g.value!, 2)} sub="g" />
                <MetricTile label="Cost of equity" value={formatPercent(ke, 2)} sub="Yield + growth" />
              </div>
            ) : null}
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter the parameters"
            description="The cost of equity — the return shareholders expect — appears here instantly."
          />
        )}
      </div>
    </div>
  )
}
