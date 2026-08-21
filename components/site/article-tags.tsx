import Link from "next/link"

export function ArticleTags({ tags }: { tags: string[] }) {
  if (tags.length === 0) {
    return null
  }

  return (
    <footer className="mt-10 flex flex-wrap items-center gap-2 border-t pt-6">
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
