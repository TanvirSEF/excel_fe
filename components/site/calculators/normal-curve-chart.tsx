"use client"

import { Area, ComposedChart, ReferenceLine, XAxis } from "recharts"

import { ChartContainer } from "@/components/ui/chart"
import { formatDecimal } from "@/lib/format"

const Z_RANGE = 4
const STEP = 0.04
const TICKS = [-3, -2, -1, 0, 1, 2, 3]

function normalPdf(z: number): number {
  return Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI)
}

const CURVE = Array.from({ length: (2 * Z_RANGE) / STEP + 1 }, (_, i) => {
  const z = Math.round((-Z_RANGE + i * STEP) * 100) / 100
  return { z, pdf: normalPdf(z) }
})

interface NormalCurveChartProps {
  label: string
  shade: (z: number) => boolean
  markers: { z: number; digits: number }[]
  caption?: string
  shadeColor?: "primary" | "destructive"
}

export function NormalCurveChart({
  label,
  shade,
  markers,
  caption,
  shadeColor = "destructive",
}: NormalCurveChartProps) {
  const data = CURVE.map((point) => ({
    ...point,
    shaded: shade(point.z) ? point.pdf : null,
  }))
  const fill = shadeColor === "destructive" ? "var(--destructive)" : "var(--chart-1)"

  return (
    <figure role="img" aria-label={label}>
      <ChartContainer config={{}} className="aspect-[520/200] w-full">
        <ComposedChart data={data} margin={{ top: 22, right: 20, bottom: 0, left: 20 }}>
          <XAxis
            dataKey="z"
            type="number"
            domain={[-Z_RANGE, Z_RANGE]}
            ticks={TICKS}
            tickFormatter={(tick: number) => (tick > 0 ? `+${tick}` : `${tick}`)}
            tickLine={false}
            className="font-mono"
          />
          <Area
            dataKey="shaded"
            type="monotone"
            stroke="none"
            fill={fill}
            fillOpacity={0.3}
            isAnimationActive={false}
            connectNulls={false}
          />
          <Area
            dataKey="pdf"
            type="monotone"
            stroke="var(--chart-2)"
            strokeWidth={2.5}
            fill="none"
            isAnimationActive={false}
          />
          {markers.map(({ z, digits }) => (
            <ReferenceLine
              key={z}
              x={z}
              stroke="var(--destructive)"
              strokeWidth={1.5}
              strokeDasharray="5 4"
              label={{
                value: formatDecimal(z, digits),
                position: "top",
                fill: "currentColor",
                fontSize: 11,
                fontWeight: 700,
              }}
            />
          ))}
        </ComposedChart>
      </ChartContainer>
      {caption ? (
        <figcaption className="text-right text-[10px] font-semibold text-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}
