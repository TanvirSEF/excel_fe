import { ComingSoon } from "@/components/dashboard/coming-soon"
import { PageGuard } from "@/components/dashboard/page-guard"

export default function NewPostPage() {
  return (
    <PageGuard permission="posts:view" title="New post">
      <ComingSoon title="New post" />
    </PageGuard>
  )
}
