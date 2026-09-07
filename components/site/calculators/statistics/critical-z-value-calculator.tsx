"use client"

import { useState } from "react"
import { IconAlertTriangle, IconRotate } from "@tabler/icons-react"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatDecimal, formatPercent } from "@/lib/format"
import { inverseNormalCdf } from "@/lib/stats"

type TailType = "two" | "left" | "right"

function normalPdf(z: number): number {
  return Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI)
}

const W = 520
const H = 200
const PAD_X = 20
const PAD_TOP = 22
const PAD_BOTTOM = 45
const Z_RANGE = 4

function round2(value: number): number {
  return Math.round(value * 100) / 100
}

function zToX(z: number): number {
  return round2(PAD_X + ((z + Z_RANGE) / (2 * Z_RANGE)) * (W - 2 * PAD_X))
}

function pdfToY(pdf: number): number {
  const maxPdf = normalPdf(0)
  return round2(H - PAD_BOTTOM - (pdf / maxPdf) * (H - PAD_BOTTOM - PAD_TOP))
}

function curvePoints(): string[] {
  const pts: string[] = []
  const steps = 120
  for (let i = 0; i <= steps; i++) {
    const z = -Z_RANGE + (i / steps) * 2 * Z_RANGE
    pts.push(`${zToX(z)},${pdfToY(normalPdf(z))}`)
  }
  return pts
}

interface RejectionCurveProps {
  criticalPos: number
  criticalNeg: number | null
  alpha: number
  tail: TailType
}

function RejectionCurve({ criticalPos, criticalNeg, tail }: RejectionCurveProps) {
  const pts = curvePoints()
  const steps = 120

  const leftTail: string[] = []
  const rightTail: string[] = []
  for (let i = 0; i <= steps; i++) {
    const z = -Z_RANGE + (i / steps) * 2 * Z_RANGE
    const point = `${zToX(z)},${pdfToY(normalPdf(z))}`
    if (criticalNeg !== null && z <= criticalNeg) leftTail.push(point)
    if (z >= criticalPos) rightTail.push(point)
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      role="img"
      aria-label="Normal distribution with shaded rejection regions"
    >
      {[-3, -2, -1, 0, 1, 2, 3].map((tick) => (
        <line
          key={`v-${tick}`}
          y1={PAD_TOP}
          y2={H - PAD_BOTTOM}
          x1={zToX(tick)}
          x2={zToX(tick)}
          stroke="currentColor"
          strokeOpacity="0.05"
        />
      ))}
      {[0.33, 0.66].map((frac) => (
        <line
          key={`h-${frac}`}
          x1={PAD_X}
          x2={W - PAD_X}
          y1={PAD_TOP + frac * (H - PAD_BOTTOM - PAD_TOP)}
          y2={PAD_TOP + frac * (H - PAD_BOTTOM - PAD_TOP)}
          stroke="currentColor"
          strokeOpacity="0.05"
        />
      ))}
      <line
        x1={PAD_X}
        x2={W - PAD_X}
        y1={H - PAD_BOTTOM}
        y2={H - PAD_BOTTOM}
        stroke="currentColor"
        strokeOpacity="0.15"
      />

      {leftTail.length > 2 && tail !== "right" ? (
        <polygon
          points={`${zToX(-Z_RANGE)},${H - PAD_BOTTOM} ${leftTail.join(" ")}`}
          fill="var(--destructive)"
          fillOpacity="0.25"
        />
      ) : null}

      {rightTail.length > 2 && tail !== "left" ? (
        <polygon
          points={`${rightTail.join(" ")} ${zToX(Z_RANGE)},${H - PAD_BOTTOM}`}
          fill="var(--destructive)"
          fillOpacity="0.25"
        />
      ) : null}

      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke="var(--chart-2)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {criticalNeg !== null ? (
        <>
          <line
            x1={zToX(criticalNeg)}
            x2={zToX(criticalNeg)}
            y1={PAD_TOP - 2}
            y2={H - PAD_BOTTOM}
            stroke="var(--destructive)"
            strokeWidth="1.5"
            strokeDasharray="5 4"
          />
          <text
            x={zToX(criticalNeg)}
            y={PAD_TOP + 2}
            textAnchor="middle"
            fill="currentColor"
            fontSize="11"
            fontWeight="700"
            className="font-mono"
          >
            {formatDecimal(criticalNeg, 3)}
          </text>
        </>
      ) : null}

      {criticalPos !== null && (tail === "two" || tail === "right") ? (
        <>
          <line
            x1={zToX(criticalPos)}
            x2={zToX(criticalPos)}
            y1={PAD_TOP - 2}
            y2={H - PAD_BOTTOM}
            stroke="var(--destructive)"
            strokeWidth="1.5"
            strokeDasharray="5 4"
          />
          <text
            x={zToX(criticalPos)}
            y={PAD_TOP + 2}
            textAnchor="middle"
            fill="currentColor"
            fontSize="11"
            fontWeight="700"
            className="font-mono"
          >
            {formatDecimal(criticalPos, 3)}
          </text>
        </>
      ) : null}

      {[-3, -2, -1, 0, 1, 2, 3].map((tick) => (
        <text
          key={`label-${tick}`}
          x={zToX(tick)}
          y={H - PAD_BOTTOM + 14}
          textAnchor="middle"
          fill="currentColor"
          fontSize="10"
          opacity="0.5"
          className="font-mono"
        >
          {tick > 0 ? `+${tick}` : tick}
        </text>
      ))}

      <text
        x={W - PAD_X}
        y={H - PAD_BOTTOM + 28}
        textAnchor="end"
        fontSize="10"
        fill="var(--destructive)"
        fontWeight="600"
      >
        Red Area = Rejection Region
      </text>
    </svg>
  )
}

export function CriticalZValueCalculator() {
  const [alpha, setAlpha] = useState(0.05)
  const [tail, setTail] = useState<TailType>("two")

  const tailArea = tail === "two" ? alpha / 2 : alpha
  const upper = inverseNormalCdf(1 - tailArea)
  const lower = tail === "two" ? inverseNormalCdf(tailArea) : null
  const valid = upper !== null
  const confidence = (1 - alpha) * 100

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Enter confidence parameters</CardTitle>
          <CardDescription>
            Pick your risk tolerance and test direction — the critical value appears
            with the rejection region on the curve.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Significance level (α)
            </Label>
            <Select value={String(alpha)} onValueChange={(v) => setAlpha(Number(v))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pick α" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.1">0.10 (90% Confidence)</SelectItem>
                <SelectItem value="0.05">0.05 (95% Confidence)</SelectItem>
                <SelectItem value="0.01">0.01 (99% Confidence)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-primary">Test type</Label>
            <Select value={tail} onValueChange={(v) => setTail(v as TailType)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pick test type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="two">Two-Tailed (Standard)</SelectItem>
                <SelectItem value="left">One-Tailed (Left)</SelectItem>
                <SelectItem value="right">One-Tailed (Right)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => {
              setAlpha(0.05)
              setTail("two")
            }}
          >
            <IconRotate className="h-4 w-4" />
            Reset
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {valid && upper !== null ? (
          <ResultsRegion>
            <GradientHeroMetric
              label="Critical z-value"
              value={
                tail === "two"
                  ? `± ${formatDecimal(Math.abs(upper), 3)}`
                  : formatDecimal(upper, 3)
              }
              sub={
                tail === "two"
                  ? `Reject H₀ when |z| > ${formatDecimal(Math.abs(upper), 3)}`
                  : tail === "right"
                    ? `Reject H₀ when z > ${formatDecimal(upper, 3)}`
                    : `Reject H₀ when z < ${formatDecimal(upper, 3)}`
              }
            />

            <div className="flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs leading-relaxed text-red-700 dark:text-red-400">
              <IconAlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>
                Rejection Region: Area = {alpha} ({tail === "two" ? `${formatPercent(alpha / 2)} in each tail` : `${formatPercent(alpha)} in one tail`}) — reject the null hypothesis if your test statistic falls in the red zone.
              </p>
            </div>

            <div className="rounded-2xl border border-primary/50 bg-card p-4 shadow-2xs">
              <RejectionCurve
                criticalPos={tail === "left" ? 0 : upper}
                criticalNeg={tail === "two" ? lower : tail === "left" ? upper : null}
                alpha={alpha}
                tail={tail}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <MetricTile
                label="Confidence level"
                value={formatPercent(confidence, 0)}
                sub="Your chosen level of certainty"
              />
              <MetricTile
                label="Upper critical z"
                value={formatDecimal(tail === "left" ? 0 : upper, 3)}
                sub="Right boundary of acceptance"
              />
              <MetricTile
                label="Lower critical z"
                value={tail === "two" && lower !== null ? formatDecimal(lower, 3) : tail === "left" ? formatDecimal(upper, 3) : "—"}
                sub="Left boundary of acceptance"
              />
            </div>
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Pick a significance level"
            description="The critical z-value and rejection region appear here instantly."
          />
        )}
      </div>
    </div>
  )
}
