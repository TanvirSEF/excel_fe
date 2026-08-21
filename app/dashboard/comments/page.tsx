import { CommentsView } from "@/components/dashboard/comments/comments-view"
import { PageGuard } from "@/components/dashboard/page-guard"

export default function CommentsPage() {
  return (
    <PageGuard permission="comments:moderate" title="Comments">
      <CommentsView />
    </PageGuard>
  )
}
