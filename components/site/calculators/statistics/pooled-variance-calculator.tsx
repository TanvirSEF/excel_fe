"use client"

import { useState } from "react"
import { IconRotate } from "@tabler/icons-react"

import { StepList } from "@/components/site/calculators/statistics/step-list"
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
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { formatDecimal } from "@/lib/format"

const DEFAULT_GROUPS = "10, 2.5\n15, 3.1\n20, 2.8"

interface ParsedGroup {
  n: number
  value: number
  variance: number
}

function parseGroups(raw: string, valueIsSd: boolean): {
  groups: ParsedGroup[]
  invalid: string[]
} {
  const groups: ParsedGroup[] = []
  const invalid: string[] = []
  for (const line of raw.split("\n")) {
    const trimmed = line.trim()
    if (!trimmed) continue
    const parts = trimmed.split(/[,;\t\s]+/).filter(Boolean)
    if (parts.length !== 2) {
      invalid.push(trimmed)
      continue
    }
    const n = Number(parts[0])
    const value = Number(parts[1])
    if (!Number.isInteger(n) || n < 2 || !Number.isFinite(value) || value < 0) {
      invalid.push(trimmed)
      continue
    }
    groups.push({ n, value, variance: valueIsSd ? value * value : value })
  }
  return { groups, invalid }
}

export function PooledVarianceCalculator() {
  const [raw, setRaw] = useState(DEFAULT_GROUPS)
  const [valueIsSd, setValueIsSd] = useState(true)

  const { groups, invalid } = parseGroups(raw, valueIsSd)
  const numerator = groups.reduce((total, g) => total + (g.n - 1) * g.variance, 0)
  const df = groups.reduce((total, g) => total + g.n - 1, 0)
  const totalN = groups.reduce((total, g) => total + g.n, 0)
  const pooled = groups.length > 0 && df > 0 ? numerator / df : null
  const valid = groups.length >= 2 && pooled !== null && invalid.length === 0

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Enter sample group data</CardTitle>
          <CardDescription>
            One group per line — unlimited groups. Size first, then the value.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Value type</Label>
            <Tabs
              value={valueIsSd ? "sd" : "variance"}
              onValueChange={(value) => setValueIsSd(value === "sd")}
            >
              <TabsList className="w-full">
                <TabsTrigger value="sd" className="flex-1">
                  Std Dev (s)
                </TabsTrigger>
                <TabsTrigger value="variance" className="flex-1">
                  Variance (s²)
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="pooled-groups"
              className="text-xs font-medium text-muted-foreground"
            >
              Group data (one group per line)
            </Label>
            <Textarea
              id="pooled-groups"
              value={raw}
              onChange={(event) => setRaw(event.target.value)}
              placeholder={"10, 2.5\n15, 3.1\n20, 2.8"}
              rows={6}
              spellCheck={false}
              aria-invalid={invalid.length > 0 ? true : undefined}
              className={cn(
                "min-h-32 bg-background font-mono text-sm tabular-nums",
                invalid.length > 0 && "border-destructive/60 focus-visible:ring-destructive/30"
              )}
            />
            <p className="text-[11px] leading-snug text-muted-foreground/80">
              Format: Size, Value — e.g. 10, 2.5. You can paste directly from Excel
              (sample size column, then value column).
            </p>
            {invalid.length > 0 ? (
              <p className="text-[11px] leading-snug text-destructive">
                Invalid {invalid.length === 1 ? "line" : "lines"}:{" "}
                {invalid.slice(0, 3).join(" · ")}
                {invalid.length > 3 ? "…" : ""}. Each line needs a size of 2+ and a
                non-negative value.
              </p>
            ) : null}
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => {
              setRaw(DEFAULT_GROUPS)
              setValueIsSd(true)
            }}
          >
            <IconRotate className="h-4 w-4" />
            Reset
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {valid && pooled !== null ? (
          <ResultsRegion>
            <GradientHeroMetric
              label="Pooled variance (s²p)"
              value={formatDecimal(pooled)}
              sub="Weighted average computed across all your groups"
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <MetricTile
                label="Pooled standard deviation"
                value={formatDecimal(Math.sqrt(pooled))}
                sub="√s²p — for t-tests and confidence intervals"
              />
              <MetricTile
                label="Degrees of freedom"
                value={formatDecimal(df, 0)}
                sub="N − k, combined automatically"
              />
              <MetricTile label="Total groups (k)" value={`${groups.length}`} />
              <MetricTile label="Total sample size" value={formatDecimal(totalN, 0)} />
            </div>

            <StepList
              steps={[
                {
                  title: valueIsSd ? "Squared your SD values" : "Variances used as entered",
                  body: groups
                    .slice(0, 3)
                    .map((g) =>
                      valueIsSd
                        ? `${formatDecimal(g.value, 2)}² = ${formatDecimal(g.variance, 2)}`
                        : `s² = ${formatDecimal(g.variance, 2)}`
                    )
                    .join(" · "),
                },
                {
                  title: "Weighted sum",
                  body: groups
                    .slice(0, 3)
                    .map((g) => `(${g.n}−1)×${formatDecimal(g.variance, 2)}`)
                    .join(" + ") + ` = ${formatDecimal(numerator, 2)}`,
                },
                {
                  title: "Divide by df",
                  body: `${formatDecimal(numerator, 2)} ÷ ${df} = ${formatDecimal(pooled)}`,
                },
              ]}
            />
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title={
              invalid.length > 0
                ? "Fix the highlighted lines"
                : groups.length < 2
                  ? "Enter at least two groups"
                  : "Enter your group data"
            }
            description="Pooled variance, pooled SD and degrees of freedom appear here instantly."
          />
        )}
      </div>
    </div>
  )
}
