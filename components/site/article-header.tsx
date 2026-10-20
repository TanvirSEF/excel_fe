import Link from "next/link"

import { ShareButtons } from "@/components/site/share-buttons"
import type { PostDetail } from "@/types/api"

export function ArticleHeader({ post }: { post: PostDetail }) {
  return (
    <header className="mb-8">
      {post.category_name && post.category_slug ? (
        <Link
          href={`/${post.category_slug}/`}
          className="inline-flex items-center rounded-full bg-primary px-3.5 py-1.5 text-xs sm:text-[13px] font-bold uppercase tracking-wider text-primary-foreground shadow-xs transition-colors hover:bg-primary/90"
        >
          {post.category_name}
        </Link>
      ) : null}
      <h1 className="mt-4 text-balance text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
        {post.title}
      </h1>
      <div className="mt-5 border-t border-border/60 pt-4">
        <ShareButtons title={post.title} />
      </div>
    </header>
  )
}
