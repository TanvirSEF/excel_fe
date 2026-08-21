import Link from "next/link"

import type { Category } from "@/types/api"

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group flex flex-col gap-3 rounded-xl border bg-card p-5 transition-colors hover:border-primary/40"
    >
      <div className="flex items-center gap-2.5">
        {category.color_hex ? (
          <span
            className="size-2.5 rounded-full"
            style={{ backgroundColor: category.color_hex }}
            aria-hidden
          />
        ) : null}
        <h2 className="font-semibold tracking-tight transition-colors group-hover:text-primary">
          {category.name}
        </h2>
        {category.is_featured ? (
          <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-[0.675rem] font-medium text-primary">
            Featured
          </span>
        ) : null}
      </div>
      {category.description ? (
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {category.description}
        </p>
      ) : null}
      {category.children.length > 0 ? (
        <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
          {category.children.map((child) => (
            <span
              key={child.id}
              className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground"
            >
              {child.name}
            </span>
          ))}
        </div>
      ) : null}
    </Link>
  )
}
