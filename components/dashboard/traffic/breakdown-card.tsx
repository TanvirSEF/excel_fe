"use client"

import { ViewsBarList } from "@/components/dashboard/analytics/views-bar-list"
import { ErrorState } from "@/components/shared/error-state"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatRate } from "@/lib/analytics-format"
import { useBreakdownReport, type ReportParams } from "@/lib/queries/analytics"
import type { BreakdownDimension } from "@/types/api"

interface BreakdownCardProps {
  title: string
  description?: string
  dimension: BreakdownDimension
  params: ReportParams
  limit?: number
}

export function BreakdownCard({ title, description, dimension, params, limit = 10 }: BreakdownCardProps) {
  const { data, isPending, isError } = useBreakdownReport(dimension, params, limit)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>
        {isError ? (
          <ErrorState title="Could not load this report" message="Try refreshing in a moment." />
        ) : isPending || !data ? (
          <Skeleton className="h-40 w-full" />
        ) : (
          <ViewsBarList
            valueLabel="sessions"
            items={data.rows.map((row) => ({
              id: `${row.label}-${row.secondary ?? ""}`,
              label: `${row.label}${row.secondary ? ` / ${row.secondary}` : ""} · ${formatRate(row.engagement_rate)} engaged`,
              value: row.sessions,
            }))}
          />
        )}
      </CardContent>
    </Card>
  )
}
