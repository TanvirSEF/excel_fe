import { ComingSoon } from "@/components/dashboard/coming-soon"
import { PageGuard } from "@/components/dashboard/page-guard"

export default function EditPostPage() {
  return (
    <PageGuard permission="posts:view" title="Edit post">
      <ComingSoon title="Edit post" />
    </PageGuard>
  )
}
