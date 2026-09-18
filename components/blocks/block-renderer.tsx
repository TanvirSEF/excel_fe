import Image from "next/image"
import { Fragment, type ReactNode } from "react"
import {
  IconAlertTriangle,
  IconBulb,
  IconChevronDown,
  IconInfoCircle,
  IconAlertOctagon,
  IconNotes,
  IconPaperclip,
} from "@tabler/icons-react"

import { toEmbedUrl } from "@/lib/embed"
import { clampHeadingLevel, headingId } from "@/lib/blocks"
import { cn } from "@/lib/utils"
import type {
  Block,
  CalloutVariant,
  InlineMark,
  InlineText,
  RichText,
  TextAlign,
} from "@/types/api"

import { CodeBlock } from "./code-block"

interface BlockRendererProps {
  blocks: Block[]
  className?: string
}

const HEADING_CLASSES: Record<2 | 3 | 4, string> = {
  2: "mt-8 sm:mt-10 mb-2 sm:mb-3 text-2xl sm:text-[1.7rem] font-bold tracking-tight text-foreground leading-snug first:mt-0",
  3: "mt-6 sm:mt-7 mb-1.5 sm:mb-2 text-xl sm:text-[1.3rem] font-semibold tracking-tight text-foreground leading-snug first:mt-0",
  4: "mt-5 sm:mt-6 mb-1 text-lg sm:text-xl font-semibold text-foreground leading-snug first:mt-0",
}

const SAFE_HREF = /^(https?:\/\/|mailto:|\/|#)/i

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

const DOWNLOAD_REGEX = /\.(xlsx?|xlsm|xltx?|csv|zip|rar|pdf|7z)(\?.*)?$/i

function isDownloadHref(href: string, text?: string): boolean {
  if (DOWNLOAD_REGEX.test(href)) return true
  if (href.includes("/downloads/") || href.includes("/api/v1/assets/")) return true
  if (text) {
    const trimmed = text.trim()
    if (DOWNLOAD_REGEX.test(trimmed) || /\bdownload\b/i.test(trimmed)) return true
  }
  return false
}

function cleanNoteContent(
  value: RichText | undefined,
  title?: string
): RichText {
  if (!value) return ""

  const isMatch = (str: string) => {
    const t = str.trim()
    if (!t) return false
    if (/^notes?:?\s*/i.test(t)) return true
    if (
      title &&
      new RegExp(
        "^" + title.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&") + ":?\\s*",
        "i"
      ).test(t)
    ) {
      return true
    }
    return false
  }

  const strip = (str: string) => {
    let res = str.replace(/^[\s\r\n]*notes?:?\s*/i, "")
    if (title) {
      res = res.replace(
        new RegExp(
          "^[\\s\\r\\n]*" +
            title.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&") +
            ":?\\s*",
          "i"
        ),
        ""
      )
    }
    return res
  }

  if (typeof value === "string") {
    return strip(value).trimStart()
  }

  const runs: InlineText[] = [...value]
  while (runs.length > 0 && !runs[0].text.trim()) {
    runs.shift()
  }
  if (runs.length === 0) return runs

  if (isMatch(runs[0].text)) {
    const stripped = strip(runs[0].text).trimStart()
    if (stripped) {
      runs[0] = { ...runs[0], text: stripped }
    } else {
      runs.shift()
      while (runs.length > 0 && !runs[0].text.trim()) {
        runs.shift()
      }
    }
  }
  return runs
}

function withMarks(
  content: ReactNode,
  marks?: InlineMark[],
  rawText?: string
): ReactNode {
  let node = content
  for (const mark of marks ?? []) {
    switch (mark.type) {
      case "bold":
        node = <strong>{node}</strong>
        break
      case "italic":
        node = <em>{node}</em>
        break
      case "strike":
        node = <del>{node}</del>
        break
      case "kbd":
        node = (
          <kbd className="relative -top-[1.5px] mx-1 inline-flex min-w-[1.8em] select-none items-center justify-center rounded-[6px] border border-primary bg-card px-2 py-0.5 font-sans text-[0.8em] font-bold uppercase tracking-wide text-foreground shadow-[0_2.5px_0_0_var(--color-primary),0_3px_4px_rgba(0,0,0,0.08)] align-baseline dark:shadow-[0_2.5px_0_0_var(--color-primary),0_3px_6px_rgba(0,0,0,0.35)]">
            {node}
          </kbd>
        )
        break
      case "code":
        node = (
          <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.85em]">
            {node}
          </code>
        )
        break
      case "link": {
        const href = mark.href ?? ""
        if (!SAFE_HREF.test(href)) break
        const isInternal = href.startsWith("/") || href.startsWith("#")
        const isDownload = isDownloadHref(href, rawText)
        node = (
          <a
            href={href}
            className={cn(
              "text-primary underline underline-offset-2 hover:text-primary/80",
              isDownload ? "font-bold" : "font-medium"
            )}
            {...(isDownload ? { download: "" } : {})}
            {...(isInternal && !isDownload
              ? {}
              : { target: "_blank", rel: "noopener noreferrer" })}
          >
            {node}
          </a>
        )
        break
      }
      case "textStyle": {
        const style = {
          ...(mark.fontSize ? { fontSize: mark.fontSize } : {}),
          ...(mark.color ? { color: mark.color } : {}),
        }
        if (Object.keys(style).length === 0) break
        node = <span style={style}>{node}</span>
        break
      }
      case "highlight":
        node = (
          <mark
            className="rounded-sm bg-primary/15 px-0.5"
            {...(mark.color ? { style: { backgroundColor: mark.color } } : {})}
          >
            {node}
          </mark>
        )
        break
    }
  }
  return node
}

function InlineRuns({ value }: { value: RichText }) {
  if (typeof value === "string") return <>{value}</>

  return (
    <>
      {value.map((inline, index) => {
        const parts = inline.text.split("\n").map((part, partIndex) => (
          <Fragment key={partIndex}>
            {partIndex > 0 ? <br /> : null}
            {part}
          </Fragment>
        ))
        return (
          <Fragment key={index}>
            {withMarks(parts, inline.marks, inline.text)}
          </Fragment>
        )
      })}
    </>
  )
}

function alignClass(align: TextAlign | undefined) {
  if (align === "center") return "text-center"
  if (align === "right") return "text-right"
  return null
}

function BlockNode({ block, usedIds }: { block: Block; usedIds: Set<string> }) {
  switch (block.type) {
    case "paragraph":
      return (
        <p
          className={cn(
            "text-base sm:text-[1.03125rem] font-normal leading-[1.625] text-foreground/90",
            alignClass(block.align)
          )}
        >
          <InlineRuns value={block.content ?? block.text} />
        </p>
      )

    case "heading": {
      const level = clampHeadingLevel(block.level)
      const id = headingId(block.text, usedIds)
      const Tag = `h${level}` as "h2" | "h3" | "h4"

      if (block.num) {
        return (
          <div
            id={id}
            className={cn(
              "flex scroll-mt-24 items-center gap-3",
              HEADING_CLASSES[level]
            )}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {block.num}
            </span>
            <Tag className={cn(alignClass(block.align))}>
              <InlineRuns value={block.content ?? block.text} />
            </Tag>
          </div>
        )
      }

      return (
        <Tag
          id={id}
          className={cn("scroll-mt-24", HEADING_CLASSES[level], alignClass(block.align))}
        >
          <InlineRuns value={block.content ?? block.text} />
        </Tag>
      )
    }

    case "quote":
      return (
        <blockquote className="my-4 border-l-4 border-primary/70 bg-primary/5 rounded-r-xl py-2.5 px-4 text-base italic font-normal leading-[1.6] text-muted-foreground">
          <InlineRuns value={block.content ?? block.text} />
        </blockquote>
      )

    case "code":
      return <CodeBlock code={block.text} language={block.language} />

    case "list": {
      const ListTag = block.ordered ? "ol" : "ul"
      return (
        <ListTag
          className={cn(
            "my-3 space-y-1.5 pl-6 text-base sm:text-[1.03125rem] font-normal leading-[1.625] text-foreground/90",
            block.marker === "arrow"
              ? "[list-style-type:'➤']"
              : block.ordered
                ? "list-decimal"
                : "list-disc marker:text-primary"
          )}
        >
          {block.items.map((item, index) => (
            <li key={index} className="pl-1">
              <InlineRuns value={item} />
            </li>
          ))}
        </ListTag>
      )
    }

    case "html":
      return (
        <div
          className="[&_iframe]:aspect-video [&_iframe]:w-full [&_iframe]:rounded-lg"
          dangerouslySetInnerHTML={{ __html: block.html }}
        />
      )

    case "image": {
      const width = block.width ?? 1200
      const height = block.height ?? Math.round(width * 0.5625)
      return (
        <figure className="my-6 flex flex-col items-center">
          <Image
            src={block.url}
            alt={block.alt ?? ""}
            width={width}
            height={height}
            sizes="(max-width: 768px) 100vw, 768px"
            className="h-auto rounded-xl border border-border/80 shadow-xs"
            style={{ width: "100%", maxWidth: width, height: "auto" }}
          />
        </figure>
      )
    }

    case "table": {
      const [headerRow, ...bodyRows] = block.rows
      return (
        <div className="my-6 overflow-x-auto rounded-xl border border-border/80 bg-card shadow-2xs">
          <table className="w-full border-collapse text-sm">
            {block.header ? (
              <thead className="border-b border-border bg-muted/60">
                <tr>
                  {headerRow.map((cell, index) => (
                    <th
                      key={index}
                      className="px-4 py-3 text-left font-semibold text-foreground"
                    >
                      <InlineRuns value={cell} />
                    </th>
                  ))}
                </tr>
              </thead>
            ) : null}
            <tbody className="divide-y divide-border/40">
              {(block.header ? bodyRows : block.rows).map((row, rowIndex) => (
                <tr key={rowIndex} className="odd:bg-transparent even:bg-muted/20 hover:bg-muted/40 transition-colors">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-4 py-3 align-top leading-relaxed">
                      <InlineRuns value={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }

    case "callout": {
      const meta = CALLOUT_STYLES[block.variant] ?? CALLOUT_STYLES.info
      const Icon = meta.icon

      const isTakeaway =
        (block.title && /takeaway/i.test(block.title)) ||
        (block.variant === "tip" && Boolean(block.title))

      if (isTakeaway) {
        return (
          <div className="relative my-8 sm:my-10 rounded-2xl border-2 border-primary/25 bg-gradient-to-b from-primary/[0.04] via-primary/[0.01] to-transparent p-5 sm:p-7 pt-7 sm:pt-8 shadow-sm dark:border-primary/40 dark:from-primary/[0.08]">
            {/* Centered Theme Ribbon Banner */}
            <div className="absolute -top-5 sm:-top-5.5 left-1/2 -translate-x-1/2 z-10 w-fit max-w-[92%]">
              <div className="relative flex items-center justify-center">
                {/* Left ribbon tail (folded shadow) */}
                <div className="hidden sm:block absolute -left-3.5 top-2.5 h-7 w-4 bg-chart-5 -z-10 [clip-path:polygon(0_0,100%_0,100%_100%,0_100%,40%_50%)]" />
                <div className="hidden sm:block absolute -left-1 bottom-0 h-2.5 w-1.5 bg-black/40 dark:bg-black/70 -z-10 [clip-path:polygon(100%_0,0_0,100%_100%)]" />

                {/* Main Ribbon */}
                <div className="flex items-center justify-center gap-2.5 rounded-lg bg-gradient-to-r from-chart-5 via-primary to-chart-5 px-6 sm:px-9 py-2 sm:py-2.5 text-primary-foreground shadow-md shadow-primary/20 border-t border-white/20">
                  <IconBulb className="h-5 w-5 sm:h-6 sm:w-6 text-amber-300 shrink-0 drop-shadow-xs" />
                  <span className="text-base sm:text-lg md:text-xl font-extrabold uppercase tracking-wider text-primary-foreground drop-shadow-xs whitespace-nowrap">
                    {block.title || "Key Takeaways"}
                  </span>
                </div>

                {/* Right ribbon tail (folded shadow) */}
                <div className="hidden sm:block absolute -right-3.5 top-2.5 h-7 w-4 bg-chart-5 -z-10 [clip-path:polygon(0_0,100%_0,60%_50%,100%_100%,0_100%)]" />
                <div className="hidden sm:block absolute -right-1 bottom-0 h-2.5 w-1.5 bg-black/40 dark:bg-black/70 -z-10 [clip-path:polygon(0_0,100%_0,0_100%)]" />
              </div>
            </div>

            <div className="text-base sm:text-[1.03125rem] font-normal leading-[1.65] text-foreground/90">
              <InlineRuns value={block.content ?? block.text} />
            </div>
          </div>
        )
      }

      const isNote =
        !isTakeaway &&
        ((Boolean(block.title && /^notes?\b/i.test(block.title.trim()))) ||
          ((!block.variant || block.variant === "info") &&
            Boolean(block.text && /^notes?:/i.test(block.text.trim()))))

      if (isNote) {
        const noteTitle = block.title
          ? block.title.endsWith(":")
            ? block.title
            : `${block.title}:`
          : "Note:"

        const content = cleanNoteContent(
          block.content ?? block.text,
          block.title
        )

        return (
          <div className="relative my-6 flex items-start gap-3 rounded-r-2xl border-l-[5px] border-primary bg-primary/[0.08] p-4 sm:p-5 shadow-md shadow-primary/20 transition-colors dark:bg-primary/[0.14] dark:shadow-black/30">
            <IconPaperclip className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div className="flex-1 text-base sm:text-[1.03125rem] font-normal leading-[1.625] text-foreground/90">
              <span className="mr-2 font-bold text-primary">{noteTitle}</span>
              <InlineRuns value={content} />
            </div>
          </div>
        )
      }

      const isExplanation =
        !isTakeaway &&
        (Boolean(block.title && /explanation/i.test(block.title)) ||
          (block.variant === "info" && Boolean(block.title)))

      if (isExplanation) {
        return (
          <div className="relative my-7 rounded-2xl border-2 border-primary/60 bg-gradient-to-b from-primary/[0.03] to-transparent p-5 sm:p-6 pt-6 sm:pt-7 shadow-xs transition-colors dark:border-primary/50 dark:from-primary/[0.06]">
            {/* Cutout title sitting directly on top border */}
            <div className="absolute -top-3.5 left-5 sm:left-6 inline-flex items-center gap-2 bg-background px-2.5 text-base sm:text-[1.0625rem] font-bold tracking-tight text-primary">
              <IconNotes className="h-5 w-5 text-primary shrink-0" />
              <span>{block.title || "Explanation"}</span>
            </div>

            <div className="text-base sm:text-[1.03125rem] font-normal leading-[1.625] text-foreground/90">
              <InlineRuns value={block.content ?? block.text} />
            </div>
          </div>
        )
      }

      return (
        <div
          className={cn(
            "flex items-start gap-3 rounded-xl border p-4 text-base",
            meta.box
          )}
        >
          <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", meta.iconClass)} />
          <div className="flex-1 space-y-1">
            {block.title ? (
              <p className="font-semibold text-foreground">{block.title}</p>
            ) : null}
            <p className="font-normal leading-relaxed text-foreground/90">
              <InlineRuns value={block.content ?? block.text} />
            </p>
          </div>
        </div>
      )
    }

    case "button":
      return (
        <div className="my-3">
          <a
            href={block.href}
            className={cn(
              "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
              block.variant === "primary"
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "border border-border bg-background hover:bg-muted"
            )}
          >
            {block.label}
          </a>
        </div>
      )

    case "embed": {
      const embedUrl = toEmbedUrl(block.url)
      if (!embedUrl) return null
      return (
        <figure className="my-6">
          <div className="overflow-hidden rounded-xl border">
            <iframe
              src={embedUrl}
              title={block.caption || "Embedded video"}
              className="aspect-video w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
          {block.caption ? (
            <figcaption className="mt-2 text-center text-xs text-muted-foreground">
              {block.caption}
            </figcaption>
          ) : null}
        </figure>
      )
    }

    case "accordion":
      return (
        <details className="group my-4 rounded-xl border border-border/80 bg-card shadow-2xs">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-foreground [&::-webkit-details-marker]:hidden">
            {block.title}
            <IconChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
          </summary>
          <div className="border-t border-border/60 px-4 py-3 text-base font-normal leading-relaxed text-foreground/90">
            <InlineRuns value={block.content ?? block.text} />
          </div>
        </details>
      )

    case "hr":
      return <hr className="my-5 border-t border-border/60" />

    default:
      return null
  }
}

export function BlockRenderer({ blocks, className }: BlockRendererProps) {
  const usedIds = new Set<string>()

  return (
    <div className={cn("space-y-3.5 sm:space-y-4", className)}>
      {blocks.map((block, index) => (
        <BlockNode key={index} block={block} usedIds={usedIds} />
      ))}
    </div>
  )
}
