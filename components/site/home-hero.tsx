import Link from "next/link"
import Image from "next/image"
import { IconArrowRight, IconFileSpreadsheet } from "@tabler/icons-react"

import type { Category } from "@/types/api"
import { Button } from "@/components/ui/button"

export function HomeHero({ categories }: { categories: Category[] }) {
  const topCategories = categories.slice(0, 5)

  return (
    <section className="mx-auto max-w-5xl px-4 pt-16 pb-0 text-center sm:pt-24">

      {/* Eyebrow */}
      <p className="mb-6 text-sm font-medium text-muted-foreground">
        1,600+ free tutorials for Excel &amp; Google Sheets
      </p>

      {/* H1 — let typography do the work */}
      <h1 className="mx-auto max-w-3xl text-[2.75rem] font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
        Spreadsheets, finally{" "}
        <em className="not-italic text-emerald-600 dark:text-emerald-400">
          made simple.
        </em>
      </h1>

      {/* Subtitle */}
      <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg leading-relaxed">
        Step-by-step formula guides, VBA automation, Pivot Tables, and ready-to-use business templates — written by practitioners, not bots.
      </p>

      {/* CTA Row */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button
          asChild
          size="lg"
          className="rounded-lg bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold h-11 px-6 text-sm shadow-none"
        >
          <Link href="/blog" className="flex items-center gap-2">
            Start Learning
            <IconArrowRight className="h-4 w-4" />
          </Link>
        </Button>

        <Button
          asChild
          variant="ghost"
          size="lg"
          className="rounded-lg h-11 px-5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <Link href="/pricing" className="flex items-center gap-2">
            <IconFileSpreadsheet className="h-4 w-4" />
            Free Templates
          </Link>
        </Button>
      </div>

      {/* Category tags — minimal underlined links */}
      {topCategories.length > 0 && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          <span className="text-xs text-muted-foreground/60 font-medium">Topics:</span>
          {topCategories.map((c) => (
            <Link
              key={c.id}
              href={`/categories/${c.slug}`}
              className="text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline transition-colors"
            >
              {c.name}
            </Link>
          ))}
        </div>
      )}

      {/* Product Screenshot — anchored below, full-bleed feel */}
      <div className="relative mt-14 sm:mt-16">
        {/* Soft fade at bottom so it blends into page */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-t from-background to-transparent"
        />
        <div className="overflow-hidden rounded-t-2xl border border-b-0 border-border/60 shadow-[0_-4px_40px_-8px_hsl(var(--emerald-500)/0.08)] ring-1 ring-border/40">
          <Image
            src="/hero-screenshot.jpg"
            alt="Excel formula guide — XLOOKUP in action"
            width={1400}
            height={788}
            className="w-full h-auto select-none"
            priority
          />
        </div>
      </div>

    </section>
  )
}
