"use client"

import { useState } from "react"
import { IconCircleCheck, IconRotate, IconX } from "@tabler/icons-react"

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
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { parseNumericInput } from "@/lib/calculators"
import { formatDecimal, formatPValue, formatPercent } from "@/lib/format"
import { pValueFromZ } from "@/lib/stats"

type TailType = "two" | "left" | "right"

const W = 520
const H = 200
const PAD_X = 20
const PAD_TOP = 22
const PAD_BOTTOM = 45
const Z_RANGE = 4

function round2(value: number): number {
  return Math.round(value * 100) / 100
}

function normalPdf(z: number): number {
  return Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI)
}

function zToX(z: number): number {
  return round2(PAD_X + ((z + Z_RANGE) / (2 * Z_RANGE)) * (W - 2 * PAD_X))
}

function pdfToY(pdf: number): number {
  const maxPdf = normalPdf(0)
  return round2(H - PAD_BOTTOM - (pdf / maxPdf) * (H - PAD_BOTTOM - PAD_TOP))
}

interface PValueCurveProps {
  z: number
  tail: TailType
}

function PValueCurve({ z, tail }: PValueCurveProps) {
  const clampedZ = Math.max(-Z_RANGE, Math.min(Z_RANGE, z))
  const steps = 120
  const allPts: string[] = []
  for (let i = 0; i <= steps; i++) {
    const zVal = -Z_RANGE + (i / steps) * 2 * Z_RANGE
    allPts.push(`${zToX(zVal)},${pdfToY(normalPdf(zVal))}`)
  }

  const absZ = Math.abs(clampedZ)

  const leftTailPts = allPts.filter((_, i) => {
    const zVal = -Z_RANGE + (i / steps) * 2 * Z_RANGE
    return tail === "two"
      ? zVal <= -absZ
      : tail === "left"
        ? zVal <= clampedZ
        : false
  })

  const rightTailPts = allPts.filter((_, i) => {
    const zVal = -Z_RANGE + (i / steps) * 2 * Z_RANGE
    return tail === "two"
      ? zVal >= absZ
      : tail === "right"
        ? zVal >= clampedZ
        : false
  })

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      role="img"
      aria-label="Normal distribution with shaded p-value regions"
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

      {leftTailPts.length > 2 ? (
        <polygon
          points={`${zToX(-Z_RANGE)},${H - PAD_BOTTOM} ${leftTailPts.join(" ")} ${
            tail === "two"
              ? `${zToX(-absZ)},${H - PAD_BOTTOM}`
              : `${zToX(clampedZ)},${H - PAD_BOTTOM}`
          }`}
          fill="var(--destructive)"
          fillOpacity="0.25"
        />
      ) : null}

      {rightTailPts.length > 2 ? (
        <polygon
          points={`${rightTailPts.join(" ")} ${zToX(Z_RANGE)},${H - PAD_BOTTOM} ${
            tail === "two"
              ? `${zToX(absZ)},${H - PAD_BOTTOM}`
              : `${zToX(clampedZ)},${H - PAD_BOTTOM}`
          }`}
          fill="var(--destructive)"
          fillOpacity="0.25"
        />
      ) : null}

      <polyline
        points={allPts.join(" ")}
        fill="none"
        stroke="var(--chart-2)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {tail === "two" ? (
        <>
          <line x1={zToX(-absZ)} x2={zToX(-absZ)} y1={PAD_TOP - 2} y2={H - PAD_BOTTOM} stroke="var(--destructive)" strokeWidth="1.5" strokeDasharray="5 4" />
          <text x={zToX(-absZ)} y={PAD_TOP + 2} textAnchor="middle" fill="currentColor" fontSize="11" fontWeight="700" className="font-mono">
            {formatDecimal(-absZ, 2)}
          </text>
          <line x1={zToX(absZ)} x2={zToX(absZ)} y1={PAD_TOP - 2} y2={H - PAD_BOTTOM} stroke="var(--destructive)" strokeWidth="1.5" strokeDasharray="5 4" />
          <text x={zToX(absZ)} y={PAD_TOP + 2} textAnchor="middle" fill="currentColor" fontSize="11" fontWeight="700" className="font-mono">
            {formatDecimal(absZ, 2)}
          </text>
        </>
      ) : (
        <>
          <line x1={zToX(clampedZ)} x2={zToX(clampedZ)} y1={PAD_TOP - 2} y2={H - PAD_BOTTOM} stroke="var(--destructive)" strokeWidth="1.5" strokeDasharray="5 4" />
          <text x={zToX(clampedZ)} y={PAD_TOP + 2} textAnchor="middle" fill="currentColor" fontSize="11" fontWeight="700" className="font-mono">
            {formatDecimal(clampedZ, 2)}
          </text>
        </>
      )}

      {[-3, -2, -1, 0, 1, 2, 3].map((tick) => (
        <text key={`label-${tick}`} x={zToX(tick)} y={H - PAD_BOTTOM + 14} textAnchor="middle" fill="currentColor" fontSize="10" opacity="0.5" className="font-mono">
          {tick > 0 ? `+${tick}` : tick}
        </text>
      ))}

      <text x={W - PAD_X} y={H - PAD_BOTTOM + 28} textAnchor="end" fontSize="10" fill="var(--destructive)" fontWeight="600">
        Red Area = P-Value
      </text>
    </svg>
  )
}

export function PValueFromZScoreCalculator() {
  const [z, setZ] = useState("1.96")
  const [tail, setTail] = useState<TailType>("two")
  const [alpha, setAlpha] = useState(0.05)

  const zInput = parseNumericInput(z)
  const zValue = zInput.value
  const valid = zValue !== null
  const p = valid ? pValueFromZ(zValue, tail === "two") : null
  const significant = p !== null && p < alpha

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Enter z-score parameters</CardTitle>
          <CardDescription>
            Your test statistic, the hypothesis direction, and the significance cutoff.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <NumberField
            label="Z-score"
            value={z}
            onChange={setZ}
            error={zInput.error}
            hint="Preset loaded (95th Perc.)"
            placeholder="1.96"
          />

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Hypothesis type
            </Label>
            <Select value={tail} onValueChange={(v) => setTail(v as TailType)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pick test type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="two">Two-tailed (≠)</SelectItem>
                <SelectItem value="left">Left-tailed (&lt;)</SelectItem>
                <SelectItem value="right">Right-tailed (&gt;)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-primary">
              Sig. Level (α)
            </Label>
            <Select value={String(alpha)} onValueChange={(v) => setAlpha(Number(v))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pick α" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.1">0.10 (10%)</SelectItem>
                <SelectItem value="0.05">0.05 (5%)</SelectItem>
                <SelectItem value="0.01">0.01 (1%)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => {
              setZ("1.96")
              setTail("two")
              setAlpha(0.05)
            }}
          >
            <IconRotate className="h-4 w-4" />
            Reset
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-3">
        {valid && zValue !== null && p !== null ? (
          <ResultsRegion>
            <GradientHeroMetric
              label="P-value result"
              value={formatPValue(p)}
              sub={
                tail === "two"
                  ? `Two-tailed · z = ${formatDecimal(zValue, 2)}`
                  : `${tail === "left" ? "Left" : "Right"}-tailed · z = ${formatDecimal(zValue, 2)}`
              }
            />

            <div
              className={`flex items-start gap-2.5 rounded-xl border p-3.5 text-xs leading-relaxed ${
                significant
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                  : "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400"
              }`}
            >
              {significant ? (
                <IconCircleCheck className="mt-0.5 h-4 w-4 shrink-0" />
              ) : (
                <IconX className="mt-0.5 h-4 w-4 shrink-0" />
              )}
              <p>
                {significant
                  ? `Significant — p = ${formatPValue(p)} < α = ${alpha}. Null hypothesis rejected: the result likely did not happen by chance.`
                  : `Not significant — p = ${formatPValue(p)} ≥ α = ${alpha}. Fail to reject the null hypothesis: random chance may explain this result.`}
              </p>
            </div>

            <div className="rounded-2xl border border-primary/50 bg-card p-4 shadow-2xs">
              <PValueCurve z={zValue} tail={tail} />
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <MetricTile
                label="Statistically significant?"
                value={significant ? "Yes" : "No"}
                sub={`p ${significant ? "<" : "≥"} α = ${alpha}`}
              />
              <MetricTile
                label={`One-tailed p`}
                value={formatPValue(pValueFromZ(zValue, false))}
                sub="Area in one tail"
              />
              <MetricTile
                label={`Two-tailed p`}
                value={formatPValue(pValueFromZ(zValue, true))}
                sub="Both tails combined"
              />
            </div>
          </ResultsRegion>
        ) : (
          <ResultsPlaceholder
            title="Enter your z-score"
            description="The p-value, significance verdict and bell curve appear here instantly."
          />
        )}
      </div>
    </div>
  )
}
