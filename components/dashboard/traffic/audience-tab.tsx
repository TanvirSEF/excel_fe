import { BreakdownCard } from "@/components/dashboard/traffic/breakdown-card"
import type { ReportParams } from "@/lib/queries/analytics"

export function AudienceTab({ params }: { params: ReportParams }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <BreakdownCard title="Device category" dimension="device" params={params} />
      <BreakdownCard
        title="Countries"
        description="From CDN headers or a GeoIP lookup at the first pageview"
        dimension="country"
        params={params}
        limit={15}
      />
      <BreakdownCard title="Browsers" dimension="browser" params={params} />
      <BreakdownCard title="Operating systems" dimension="os" params={params} />
    </div>
  )
}
