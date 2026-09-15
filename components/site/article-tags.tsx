import Link from "next/link"

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
      className={cn("mt-10 flex flex-wrap items-center gap-2 border-t pt-6", className)}
    >
      {tags.map((tag) => (
        <Link
          key={tag}
          href={`/tags/${tag}`}
          className="rounded-full border px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
        >
          #{tag}
        </Link>
      ))}
    </footer>
  )
}
