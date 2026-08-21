import { PageGuard } from "@/components/dashboard/page-guard"
import { PostsView } from "@/components/dashboard/posts-view"

export default function PostsPage() {
  return (
    <PageGuard permission="posts:view" title="Posts">
      <PostsView />
    </PageGuard>
  )
}
