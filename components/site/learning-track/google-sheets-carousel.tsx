"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { IconBulb, IconChevronLeft, IconChevronRight } from "@tabler/icons-react"

import { PostCard } from "@/components/site/post-card"
import { cn } from "@/lib/utils"
import type { PostListItem } from "@/types/api"

interface GoogleSheetsCarouselProps {
  posts: PostListItem[]
  title?: string
  subtitle?: string
  className?: string
}

export function GoogleSheetsCarousel({
  posts,
  title = "Related Google Sheets Basics Articles",
  subtitle = "Master the fundamentals with these step-by-step spreadsheet tutorials",
  className,
}: GoogleSheetsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    setCanScrollLeft(scrollLeft > 4)
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4)
  }, [])

  useEffect(() => {
    checkScroll()
    window.addEventListener("resize", checkScroll)
    return () => window.removeEventListener("resize", checkScroll)
  }, [checkScroll, posts])

  const handleScroll = (direction: "left" | "right") => {
    const el = scrollRef.current
    if (!el) return
    const scrollAmount = el.clientWidth * 0.75
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    })
  }

  if (posts.length === 0) {
    return null
  }

  return (
    <section
      aria-label={title}
      className={cn("mt-12 mb-8 space-y-4", className)}
    >
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 px-2.5 py-0.5 text-xs font-semibold text-teal-700 dark:text-teal-300">
            <IconBulb className="h-3.5 w-3.5" />
            <span>Google Sheets Basics</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {title}
          </h2>
          {subtitle ? (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {subtitle}
            </p>
          ) : null}
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => handleScroll("left")}
            disabled={!canScrollLeft}
            aria-label="Previous articles"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border/80 bg-card text-foreground transition-all duration-200 hover:border-teal-500/50 hover:bg-teal-500/10 hover:text-teal-600 disabled:pointer-events-none disabled:opacity-30"
          >
            <IconChevronLeft className="h-4.5 w-4.5" />
          </button>
          <button
            type="button"
            onClick={() => handleScroll("right")}
            disabled={!canScrollRight}
            aria-label="Next articles"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border/80 bg-card text-foreground transition-all duration-200 hover:border-teal-500/50 hover:bg-teal-500/10 hover:text-teal-600 disabled:pointer-events-none disabled:opacity-30"
          >
            <IconChevronRight className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="-mx-1 flex gap-4 overflow-x-auto px-1 pt-1 pb-4 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {posts.map((item) => (
          <div
            key={item.id}
            className="w-[280px] shrink-0 snap-start sm:w-[320px]"
          >
            <PostCard post={item} />
          </div>
        ))}
      </div>
    </section>
  )
}
