"use client"

import { useState } from "react"

import { AcquisitionTab } from "@/components/dashboard/traffic/acquisition-tab"
import { ArticleViewsLog } from "@/components/dashboard/traffic/article-views-log"
import { AudienceTab } from "@/components/dashboard/traffic/audience-tab"
import { EventsCard } from "@/components/dashboard/traffic/events-card"
import { OverviewTab } from "@/components/dashboard/traffic/overview-tab"
import { PagesTab } from "@/components/dashboard/traffic/pages-tab"
import { QualityTab } from "@/components/dashboard/traffic/quality-tab"
import { RealtimePanel } from "@/components/dashboard/traffic/realtime-panel"
import { ReportControls } from "@/components/dashboard/traffic/report-controls"
import { SessionsTab } from "@/components/dashboard/traffic/sessions-tab"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ReportParams } from "@/lib/queries/analytics"
import {
  browserTimeZone,
  presetRange,
  type DateRange,
  type RangePreset,
} from "@/lib/report-range"
import type { TrafficFilter } from "@/types/api"

const TABS = [
  { value: "realtime", label: "Realtime" },
  { value: "overview", label: "Overview" },
  { value: "pages", label: "Pages" },
  { value: "acquisition", label: "Acquisition" },
  { value: "audience", label: "Audience" },
  { value: "quality", label: "Traffic quality" },
  { value: "sessions", label: "Sessions" },
  { value: "articles", label: "Article views log" },
]

const REPORT_TABS = new Set(["overview", "pages", "acquisition", "audience", "quality", "sessions"])

export function TrafficView() {
  const [tab, setTab] = useState("realtime")
  const [preset, setPreset] = useState<RangePreset>("7d")
  const [range, setRange] = useState<DateRange>(() => presetRange("7d"))
  const [traffic, setTraffic] = useState<TrafficFilter>("clean")
  const [compare, setCompare] = useState(true)
  const [timeZone] = useState(browserTimeZone)

  const params: ReportParams = { from: range.from, to: range.to, tz: timeZone, traffic, compare }

  const changePreset = (next: RangePreset) => {
    setPreset(next)
    if (next !== "custom") setRange(presetRange(next))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Traffic analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground" suppressHydrationWarning>
          First-party session analytics. Times use your timezone ({timeZone}).
        </p>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="gap-4">
        <TabsList className="h-auto flex-wrap justify-start">
          {TABS.map((item) => (
            <TabsTrigger key={item.value} value={item.value}>
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {REPORT_TABS.has(tab) ? (
          <ReportControls
            preset={preset}
            range={range}
            traffic={traffic}
            compare={compare}
            onPresetChange={changePreset}
            onRangeChange={setRange}
            onTrafficChange={setTraffic}
            onCompareChange={setCompare}
          />
        ) : null}

        <TabsContent value="realtime">
          <RealtimePanel />
        </TabsContent>
        <TabsContent value="overview">
          <OverviewTab params={params} />
        </TabsContent>
        <TabsContent value="pages" className="space-y-6">
          <PagesTab params={params} />
          <EventsCard params={params} />
        </TabsContent>
        <TabsContent value="acquisition">
          <AcquisitionTab params={params} />
        </TabsContent>
        <TabsContent value="audience">
          <AudienceTab params={params} />
        </TabsContent>
        <TabsContent value="quality">
          <QualityTab params={params} />
        </TabsContent>
        <TabsContent value="sessions">
          <SessionsTab params={params} />
        </TabsContent>
        <TabsContent value="articles">
          <ArticleViewsLog />
        </TabsContent>
      </Tabs>
    </div>
  )
}
