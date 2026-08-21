import { ComingSoon } from "@/components/dashboard/coming-soon"
import { PageGuard } from "@/components/dashboard/page-guard"

export default function CommentsPage() {
  return (
    <PageGuard permission="comments:moderate" title="Comments">
      <ComingSoon title="Comments" />
    </PageGuard>
  )
}
