import type { PostListItem } from "@/types/api"

import { PostGrid } from "./post-grid"
import { SectionHeading } from "./section-heading"

import { cn } from "@/lib/utils"

interface PostSectionProps {
  title: string
  posts: PostListItem[]
  emptyDescription?: string
  hideIfEmpty?: boolean
  className?: string
}

export function PostSection({
  title,
  posts,
  emptyDescription,
  hideIfEmpty,
  className,
}: PostSectionProps) {
  if (hideIfEmpty && posts.length === 0) {
    return null
  }

  return (
    <section className={cn(className)}>
      <SectionHeading title={title} />
      <PostGrid posts={posts} emptyDescription={emptyDescription} />
    </section>
  )
}
