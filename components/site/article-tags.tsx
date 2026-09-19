import Link from "next/link"
import slugify from "slugify"

import { cn } from "@/lib/utils"

export function ArticleTags({
  tags,
  className,
}: {
  tags: string[]
  className?: string
}) {
  if (tags.length === 0) {
    return null
  }

  return (
    <footer
      className={cn("mt-8 flex flex-wrap items-center gap-2", className)}
    >
      {tags.map((tag) => {
        const slug = slugify(tag, { lower: true, strict: true, trim: true }) || tag
        return (
          <Link
            key={tag}
            href={`/tags/${slug}`}
            className="rounded-full border px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
          >
            #{tag}
          </Link>
        )
      })}
    </footer>
  )
}
