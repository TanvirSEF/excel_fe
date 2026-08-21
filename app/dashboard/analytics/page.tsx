import { ComingSoon } from "@/components/dashboard/coming-soon"
import { PageGuard } from "@/components/dashboard/page-guard"

export default function AnalyticsPage() {
  return (
    <PageGuard permission="analytics:view" title="Analytics">
      <ComingSoon title="Analytics" />
    </PageGuard>
  )
}
