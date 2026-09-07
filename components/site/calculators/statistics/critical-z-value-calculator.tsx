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
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { parseNumericInput } from "@/lib/calculators"
import { formatDecimal, formatPercent } from "@/lib/format"
import { inverseNormalCdf } from "@/lib/stats"

const CONFIDENCE_LEVELS = [
  { label: "80%", value: 80 },
  { label: "85%", value: 85 },
  { label: "90%", value: 90 },
  { label: "95%", value: 95 },
  { label: "98%", value: 98 },
  { label: "99%", value: 99 },
  { label: "99.5%", value: 99.5 },
  { label: "99.9%", value: 99.9 },
]

export function CriticalZValueCalculator() {
  const [confidence, setConfidence] = useState("95")
  const [customAlpha, setCustomAlpha] = useState("")
  const [twoTailed, setTwoTailed] = useState(true)

  const customAlphaInput = parseNumericInput(customAlpha, { min: 0.000001, max: 0.5 })
  const customAlphaActive = customAlphaInput.value !== null

  const alpha = customAlphaActive
    ? customAlphaInput.value!
    : (100 - Number(confidence)) / 100
  const tailArea = twoTailed ? alpha / 2 : alpha
  const zCritical = inverseNormalCdf(1 - tailArea)
  const valid = zCritical !== null && alpha > 0 && alpha < 1

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Test settings</CardTitle>
          <CardDescription>
            The cut-off z beyond which you reject the null hypothesis.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">Confidence level</p>
            <Select
              value={confidence}
              onValueChange={(value) => {
                setConfidence(value)
                setCustomAlpha("")
              }}
              disabled={customAlphaActive}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pick a level" />
              </SelectTrigger>
              <SelectContent>
                {CONFIDENCE_LEVELS.map((level) => (
                  <SelectItem key={level.value} value={String(level.value)}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <NumberField
            label="Or custom significance (α)"
            value={customAlpha}
            onChange={setCustomAlpha}
            error={customAlpha !== "" ? customAlphaInput.error : null}
            hint="Overrides the dropdown — e.g. 0.05 or 0.01"
            placeholder="0.05"
          />

          <Tabs
            value={twoTailed ? "two" : "one"}
            onValueChange={(value) => setTwoTailed(value === "two")}
          >
            <TabsList className="w-full">
              <TabsTrigger value="one" className="flex-1">
                One-tailed
              </TabsTrigger>
              <TabsTrigger value="two" className="flex-1">
                Two-tailed
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => {
              setConfidence("95")
              setCustomAlpha("")
              setTwoTailed(true)
            }}
          >
            <IconRotate className="h-4 w-4" />
            Reset to example
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {valid && zCritical !== null ? (
          <ResultsRegion>
            <GradientHeroMetric
              label={twoTailed ? "Critical z values" : "Critical z value"}
              value={twoTailed ? `± ${formatDecimal(zCritical)}` : formatDecimal(zCritical)}
              sub={`α = ${formatDecimal(alpha, 4)} · ${twoTailed ? "two" : "one"}-tailed`}
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <MetricTile
                label="Upper critical z"
                value={formatDecimal(zCritical)}
                sub={twoTailed ? `Area above = ${formatPercent(alpha / 2)}` : `Area above = ${formatPercent(alpha)}`}
              />
              <MetricTile
                label="Lower critical z"
                value={twoTailed ? formatDecimal(-zCritical) : "—"}
                sub={twoTailed ? "Symmetric lower bound" : "One-tailed: no lower bound"}
              />
              <MetricTile
                label="Middle area"
                value={formatPercent(1 - alpha)}
                sub="Confidence region"
              />
              <MetricTile
                label="Tail area(s)"
                value={formatPercent(tailArea)}
                sub={twoTailed ? "α ÷ 2 in each tail" : "Full α in one tail"}
              />
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground">
              Reject the null hypothesis when your test statistic falls beyond{" "}
              {twoTailed
                ? `−${formatDecimal(zCritical)} or +${formatDecimal(zCritical)}`
                : formatDecimal(zCritical)}
              . At 95% two-tailed this is the classic ±1.96.
            </p>
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Pick a confidence level"
            description="Critical z values appear here — e.g. 95% two-tailed gives ±1.9600."
          />
        )}
      </div>
    </div>
  )
}
