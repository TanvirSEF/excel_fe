import { ComingSoon } from "@/components/dashboard/coming-soon"
import { PageGuard } from "@/components/dashboard/page-guard"

export default function TagsPage() {
  return (
    <PageGuard permission="tags:view" title="Tags">
      <ComingSoon title="Tags" />
    </PageGuard>
  )
}
