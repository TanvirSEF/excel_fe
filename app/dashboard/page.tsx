import { OverviewView } from "@/components/dashboard/overview-view"
import { PageGuard } from "@/components/dashboard/page-guard"

export default function DashboardPage() {
  return (
    <PageGuard permission="overview:view" title="Overview">
      <OverviewView />
    </PageGuard>
  )
}
