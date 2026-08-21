import { EmptyState } from "@/components/shared/empty-state"
import { PostCard } from "@/components/site/post-card"
import type { PostListItem } from "@/types/api"

interface PostGridProps {
  posts: PostListItem[]
  emptyTitle?: string
  emptyDescription?: string
}

export function PostGrid({
  posts,
  emptyTitle,
  emptyDescription,
}: PostGridProps) {
  if (posts.length === 0) {
    return (
      <EmptyState
        title={emptyTitle ?? "No articles yet"}
        description={emptyDescription}
      />
    )
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
