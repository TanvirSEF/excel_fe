import { ComingSoon } from "@/components/dashboard/coming-soon"
import { PageGuard } from "@/components/dashboard/page-guard"

export default function PostsPage() {
  return (
    <PageGuard permission="posts:view" title="Posts">
      <ComingSoon title="Posts" />
    </PageGuard>
  )
}
