import Image from "next/image"
import {
  IconAlertOctagon,
  IconAlertTriangle,
  IconBulb,
  IconInfoCircle,
  IconNotes,
  IconPaperclip,
} from "@tabler/icons-react"

import { isTakeawayCallout, toCdnUrl, type ImageBlock } from "@/lib/blocks"
import { cleanNoteContent, cleanRichText } from "@/lib/rich-text"
import { cn } from "@/lib/utils"
import type { Block, CalloutVariant } from "@/types/api"

import { FormulaCodeBlock } from "./formula-code-block"
import { InlineRuns } from "./inline-runs"

const CALLOUT_STYLES: Record<
  CalloutVariant,
  { icon: typeof IconInfoCircle; box: string; iconClass: string }
> = {
  info: {
    icon: IconInfoCircle,
    box: "border-sky-500/30 bg-sky-500/5",
    iconClass: "text-sky-600 dark:text-sky-400",
  },
  tip: {
    icon: IconBulb,
    box: "border-emerald-500/30 bg-emerald-500/5",
    iconClass: "text-emerald-600 dark:text-emerald-400",
  },
  warning: {
    icon: IconAlertTriangle,
    box: "border-amber-500/30 bg-amber-500/5",
    iconClass: "text-amber-600 dark:text-amber-400",
  },
  danger: {
    icon: IconAlertOctagon,
    box: "border-red-500/30 bg-red-500/5",
    iconClass: "text-red-600 dark:text-red-400",
  },
}

interface CalloutBlockProps {
  block: Extract<Block, { type: "callout" }>
  takeawayImages?: ImageBlock[]
}

export function CalloutBlock({ block, takeawayImages }: CalloutBlockProps) {
  const meta = CALLOUT_STYLES[block.variant] ?? CALLOUT_STYLES.info
  const Icon = meta.icon

  const isTakeaway = isTakeawayCallout(block)

  if (isTakeaway) {
    return (
      <div className="relative my-8 rounded-2xl border-2 border-primary/25 bg-gradient-to-b from-primary/[0.04] via-primary/[0.01] to-transparent p-5 pt-7 shadow-sm sm:my-10 sm:p-7 sm:pt-8 dark:border-primary/40 dark:from-primary/[0.08]">
        {/* Centered Theme Ribbon Banner */}
        <div className="absolute -top-5 left-1/2 z-10 w-fit max-w-[92%] -translate-x-1/2 sm:-top-5.5">
          <div className="relative flex items-center justify-center">
            {/* Left ribbon tail (folded shadow) */}
            <div className="absolute top-2.5 -left-3.5 -z-10 hidden h-7 w-4 bg-chart-5 [clip-path:polygon(0_0,100%_0,100%_100%,0_100%,40%_50%)] sm:block" />
            <div className="absolute bottom-0 -left-1 -z-10 hidden h-2.5 w-1.5 bg-black/40 [clip-path:polygon(100%_0,0_0,100%_100%)] sm:block dark:bg-black/70" />

            {/* Main Ribbon */}
            <div className="flex items-center justify-center gap-2.5 rounded-lg border-t border-white/20 bg-gradient-to-r from-chart-5 via-primary to-chart-5 px-6 py-2 text-primary-foreground shadow-md shadow-primary/20 sm:px-9 sm:py-2.5">
              <IconBulb className="h-5 w-5 shrink-0 text-amber-300 drop-shadow-xs sm:h-6 sm:w-6" />
              <span className="text-base font-extrabold tracking-wider whitespace-nowrap text-primary-foreground uppercase drop-shadow-xs sm:text-lg md:text-xl">
                {block.title || "Key Takeaways"}
              </span>
            </div>

            {/* Right ribbon tail (folded shadow) */}
            <div className="absolute top-2.5 -right-3.5 -z-10 hidden h-7 w-4 bg-chart-5 [clip-path:polygon(0_0,100%_0,60%_50%,100%_100%,0_100%)] sm:block" />
            <div className="absolute -right-1 bottom-0 -z-10 hidden h-2.5 w-1.5 bg-black/40 [clip-path:polygon(100%_0,0_0,100%_100%)] sm:block dark:bg-black/70" />
          </div>
        </div>

        <div className="text-[17px] leading-[1.75] font-normal text-foreground/90 sm:text-[18px]">
          <InlineRuns value={cleanRichText(block.content ?? block.text)} />
        </div>

        {takeawayImages && takeawayImages.length > 0 ? (
          <div className="mt-4 flex flex-col items-center gap-4 sm:mt-5">
            {takeawayImages.map((img, i) => {
              const width = img.width ?? 783
              const height = img.height ?? Math.round(width * 0.5625)
              const src = img.url ? toCdnUrl(encodeURI(decodeURI(img.url))) : ""
              return (
                <figure key={i} className="flex w-full flex-col items-center">
                  <Image
                    src={src}
                    alt={img.alt ?? ""}
                    width={width}
                    height={height}
                    sizes="(max-width: 768px) 100vw, 768px"
                    className="h-auto rounded-xl border border-border/80 shadow-xs"
                    style={{ width: "100%", maxWidth: width, height: "auto" }}
                  />
                </figure>
              )
            })}
          </div>
        ) : null}
      </div>
    )
  }

  const isNote =
    !isTakeaway &&
    (Boolean(block.title && /^notes?\b/i.test(block.title.trim())) ||
      ((!block.variant || block.variant === "info") &&
        Boolean(block.text && /^notes?:/i.test(block.text.trim()))))

  if (isNote) {
    const noteTitle = block.title
      ? block.title.endsWith(":")
        ? block.title
        : `${block.title}:`
      : "Note:"

    const content = cleanNoteContent(block.content ?? block.text, block.title)

    return (
      <div className="relative my-6 flex items-start gap-3 rounded-r-2xl border-l-[5px] border-primary bg-primary/[0.08] p-4 shadow-md shadow-primary/20 transition-colors sm:px-5 sm:py-4 dark:bg-primary/[0.14] dark:shadow-black/30">
        <IconPaperclip className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <div className="flex-1 text-[16px] leading-[1.7] font-normal text-foreground/90 sm:text-[17px]">
          <span className="mr-2 font-bold text-primary">{noteTitle}</span>
          <InlineRuns value={content} />
        </div>
      </div>
    )
  }

  const rawCandidateText =
    block.text ||
    (typeof block.content === "string"
      ? block.content
      : Array.isArray(block.content)
        ? block.content
            .map((c) => (typeof c === "string" ? c : c.text))
            .join("")
        : "")

  const trimmedText = rawCandidateText.trim()
  const startsWithBullet = /^[\s\r\n]*[➥➧➤•\-\*]/i.test(trimmedText)

  const isFormulaTitle = Boolean(
    block.title && /^(excel\s+)?formula(\s+box)?$/i.test(block.title.trim())
  )

  const isExplanation =
    !isTakeaway &&
    !isNote &&
    !isFormulaTitle &&
    Boolean(
      block.title &&
      (startsWithBullet ||
        /(explanation|explain|breakdown|interpretation|findings|differences)/i.test(
          block.title
        ))
    )

  const isFormula =
    !isTakeaway &&
    !isNote &&
    !isExplanation &&
    !startsWithBullet &&
    (isFormulaTitle ||
      (!block.title &&
        Boolean(trimmedText && /^\s*(=|[A-Z_]{2,}\s*\()/i.test(trimmedText))))

  if (isExplanation) {
    return (
      <div className="relative my-7 rounded-2xl border-2 border-primary/50 bg-background p-5 pt-7 shadow-xs transition-colors sm:p-6 sm:pt-8 dark:border-primary/40">
        <div className="absolute -top-3.5 left-8 inline-flex items-center gap-2 bg-background px-1 text-base font-bold tracking-tight text-primary sm:left-10 sm:text-[1.125rem]">
          <IconNotes className="h-5 w-5 shrink-0 text-primary" />
          <span>{block.title || "Explanation"}</span>
        </div>

        <div className="text-[16px] leading-[1.7] font-normal text-foreground/90 sm:text-[17px]">
          <InlineRuns value={cleanRichText(block.content ?? block.text)} />
        </div>
      </div>
    )
  }

  if (isFormula) {
    const formulaText = rawCandidateText.trim().replace(/^formula:?\s*/i, "")
    return <FormulaCodeBlock formula={formulaText} />
  }

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border p-4 text-[16px] sm:text-[17px]",
        meta.box
      )}
    >
      <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", meta.iconClass)} />
      <div className="flex-1 space-y-1">
        {block.title ? (
          <p className="text-base font-semibold text-foreground sm:text-[17px]">
            {block.title}
          </p>
        ) : null}
        <div className="leading-relaxed font-normal text-foreground/90">
          <InlineRuns
            value={cleanNoteContent(block.content ?? block.text, block.title)}
          />
        </div>
      </div>
    </div>
  )
}
