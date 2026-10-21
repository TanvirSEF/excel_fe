"use client"

import {
  IconActivity,
  IconCalendar,
  IconDeviceDesktop,
  IconWorld,
} from "@tabler/icons-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LiveTrafficStats } from "@/types/api"
import { getCountryFlag } from "./country-flag"

interface TrafficKpiCardsProps {
  stats?: LiveTrafficStats
}

export function TrafficKpiCards({ stats }: TrafficKpiCardsProps) {
  const active30m = stats?.active_30m ?? 0
  const todayViews = stats?.today_views ?? 0
  const topCountry = stats?.top_country ?? "None"
  const topCountryCode = stats?.top_country_code
  const topDevice = stats?.top_device
    ? stats.top_device.charAt(0).toUpperCase() + stats.top_device.slice(1)
    : "Desktop"

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* 1. Real-time active visitors */}
      <Card className="relative overflow-hidden border-border/80 shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Article Views (30m)
          </CardTitle>
          <IconActivity className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tracking-tight text-foreground">
            {active30m.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Article page views in the last 30 minutes
          </p>
        </CardContent>
      </Card>

      {/* 2. Today's Views */}
      <Card className="border-border/80 shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Views Today
          </CardTitle>
          <IconCalendar className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tracking-tight text-foreground">
            {todayViews.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Total page views since 00:00 UTC
          </p>
        </CardContent>
      </Card>

      {/* 3. Top Country */}
      <Card className="border-border/80 shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Top Location
          </CardTitle>
          <IconWorld className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground truncate">
            {topCountryCode ? (
              <span className="text-xl select-none" role="img" aria-label={topCountry}>
                {getCountryFlag(topCountryCode)}
              </span>
            ) : null}
            <span className="truncate">{topCountry}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Highest traffic volume today
          </p>
        </CardContent>
      </Card>

      {/* 4. Top Device */}
      <Card className="border-border/80 shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Primary Device
          </CardTitle>
          <IconDeviceDesktop className="h-4 w-4 text-violet-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tracking-tight text-foreground">
            {topDevice}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Most popular visitor form-factor
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
