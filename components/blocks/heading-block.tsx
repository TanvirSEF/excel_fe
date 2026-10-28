import { alignClass, clampHeadingLevel, headingId } from "@/lib/blocks"
import { cn } from "@/lib/utils"
import type { Block } from "@/types/api"

import { InlineRuns } from "./inline-runs"

const HEADING_CLASSES: Record<2 | 3 | 4, string> = {
  2: "mt-8 sm:mt-10 mb-2 sm:mb-3 text-2xl sm:text-[1.85rem] font-bold tracking-tight text-foreground leading-snug first:mt-0 scroll-mt-24",
  3: "mt-6 sm:mt-7 mb-1.5 sm:mb-2 text-xl sm:text-[1.4rem] font-semibold tracking-tight text-foreground leading-snug first:mt-0 scroll-mt-24",
  4: "mt-5 sm:mt-6 mb-1 text-lg sm:text-[1.2rem] font-semibold text-foreground leading-snug first:mt-0 scroll-mt-24",
}

interface HeadingBlockProps {
  block: Extract<Block, { type: "heading" }>
  usedIds: Set<string>
  isFaqQuestion?: boolean
}

export function HeadingBlock({
  block,
  usedIds,
  isFaqQuestion,
}: HeadingBlockProps) {
  const level = clampHeadingLevel(block.level)
  const id = headingId(block.text, usedIds)
  const Tag = `h${level}` as "h2" | "h3" | "h4"

  if (block.num) {
    return (
      <div
        id={id}
        className={cn(
          "group flex scroll-mt-24 items-start gap-3 transition-colors",
          isFaqQuestion
            ? cn(HEADING_CLASSES[level], "mt-1 sm:mt-1.5")
            : HEADING_CLASSES[level]
        )}
      >
        <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-xs transition-transform duration-200 group-hover:scale-105">
          {block.num}
        </span>
        <Tag
          className={cn(
            "transition-colors duration-200 group-hover:text-primary",
            alignClass(block.align)
          )}
        >
          <InlineRuns value={block.content ?? block.text} />
        </Tag>
      </div>
    )
  }

  if (level === 3) {
    return (
      <div
        id={id}
        className={cn(
          "group flex scroll-mt-24 items-start gap-2.5 first:mt-0",
          isFaqQuestion
            ? "mt-1 mb-1 sm:mt-1.5 sm:mb-1.5"
            : "mt-6 mb-1.5 sm:mt-7 sm:mb-2"
        )}
      >
        <span
          aria-hidden="true"
          className="mt-1 h-5 w-1 shrink-0 rounded-full bg-primary/80 transition-all duration-200 group-hover:h-6 group-hover:scale-y-110 group-hover:bg-primary"
        />
        <Tag
          className={cn(
            "text-xl leading-snug font-semibold tracking-tight text-foreground transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-primary sm:text-[1.4rem]",
            alignClass(block.align)
          )}
        >
          <InlineRuns value={block.content ?? block.text} />
        </Tag>
      </div>
    )
  }

  return (
    <Tag
      id={id}
      className={cn(
        "scroll-mt-24 transition-colors duration-200 hover:text-primary",
        HEADING_CLASSES[level],
        alignClass(block.align)
      )}
    >
      <InlineRuns value={block.content ?? block.text} />
    </Tag>
  )
}
