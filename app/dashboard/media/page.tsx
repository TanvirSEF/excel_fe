import { ComingSoon } from "@/components/dashboard/coming-soon"
import { PageGuard } from "@/components/dashboard/page-guard"

export default function MediaPage() {
  return (
    <PageGuard permission="media:view" title="Media">
      <ComingSoon title="Media" />
    </PageGuard>
  )
}
