import { BreakdownCard } from "@/components/dashboard/traffic/breakdown-card"
import type { ReportParams } from "@/lib/queries/analytics"

export function AcquisitionTab({ params }: { params: ReportParams }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <BreakdownCard
        title="Traffic sources"
        description="Source and medium of the first pageview in each session"
        dimension="source"
        params={params}
        limit={15}
      />
      <BreakdownCard
        title="Referring websites"
        description="External sites that sent visitors"
        dimension="referrer"
        params={params}
        limit={15}
      />
    </div>
  )
}
