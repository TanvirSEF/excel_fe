import Link from "next/link"

import type { Category } from "@/types/api"

export function HomeHero({ categories }: { categories: Category[] }) {
  return (
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

      {categories.length > 0 ? (
        <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
          {categories.map((category) => (
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
  )
}
