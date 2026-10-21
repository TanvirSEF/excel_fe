import { IconArrowDownRight, IconArrowUpRight, IconMinus } from "@tabler/icons-react"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface MetricCardProps {
  label: string
  value: string
  hint?: string
  change?: number | null
  changeUnit?: "%" | "pp"
}

function ChangeBadge({ change, unit }: { change: number; unit: "%" | "pp" }) {
  const Icon = change > 0 ? IconArrowUpRight : change < 0 ? IconArrowDownRight : IconMinus
  const tone =
    change > 0 ? "text-emerald-600 dark:text-emerald-400" : change < 0 ? "text-rose-600 dark:text-rose-400" : "text-muted-foreground"
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-medium tabular-nums ${tone}`}>
      <Icon className="h-3.5 w-3.5" />
      {Math.abs(change).toFixed(1)}
      {unit === "pp" ? " pp" : "%"}
    </span>
  )
}

export function MetricCard({ label, value, hint, change, changeUnit = "%" }: MetricCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums">{value}</CardTitle>
        <div className="flex items-center gap-2">
          {change !== null && change !== undefined ? (
            <ChangeBadge change={change} unit={changeUnit} />
          ) : null}
          {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
        </div>
      </CardHeader>
    </Card>
  )
}
