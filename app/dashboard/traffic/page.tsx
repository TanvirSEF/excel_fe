import { PageGuard } from "@/components/dashboard/page-guard"
import { TrafficView } from "@/components/dashboard/traffic/traffic-view"

export const metadata = {
  title: "Live Traffic & Real-Time Visitors | Dashboard",
  description: "Real-time reader traffic, visitor locations, devices, and article views.",
}

export default function TrafficPage() {
  return (
    <PageGuard permission="analytics:view" title="Live Traffic">
      <TrafficView />
    </PageGuard>
  )
}
