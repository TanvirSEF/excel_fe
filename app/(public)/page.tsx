import Link from "next/link"

import { PostCard } from "@/components/site/post-card"
import { getCategories } from "@/lib/api/categories"
import { getPosts } from "@/lib/api/posts"

export const revalidate = 300

export default async function HomePage() {
  const [trending, latest, categories] = await Promise.all([
    getPosts({ trending: true, page_size: 6 }, 300),
    getPosts({ page_size: 9 }, 300),
    getCategories(300),
  ])

  const featuredCategories = categories.filter((c) => c.is_featured)

  return (
    <div className="mx-auto w-full max-w-6xl px-4">
      <section className="flex flex-col items-center gap-5 py-16 text-center sm:py-24">
        <span className="rounded-full border bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
          Formulas · Shortcuts · Deep dives
        </span>
        <h1 className="max-w-2xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
          Master Excel, one formula at a time
        </h1>
        <p className="max-w-xl text-balance text-base text-muted-foreground sm:text-lg">
          Practical, example-driven guides for Excel — from everyday shortcuts
          to advanced formulas, Power Query and VBA.
        </p>

        <form action="/search" className="mt-2 flex w-full max-w-md">
          <input
            type="search"
            name="q"
            placeholder="Search articles, formulas, tricks…"
            minLength={2}
            className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-ring/50"
          />
        </form>

        {featuredCategories.length > 0 ? (
          <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
            {featuredCategories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
              >
                {category.name}
              </Link>
            ))}
          </div>
        ) : null}
      </section>

      {trending.items.length > 0 ? (
        <section className="pb-4">
          <SectionHeading title="Trending now" />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {trending.items.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="py-10">
        <SectionHeading title="Latest articles" />
        {latest.items.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {latest.items.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed px-6 py-16 text-center text-sm text-muted-foreground">
            No articles yet — the first ones are on their way.
          </div>
        )}
      </section>
    </div>
  )
}

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="mb-5 flex items-center gap-2.5">
      <span className="h-5 w-1 rounded-full bg-primary" aria-hidden />
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
    </div>
  )
}
