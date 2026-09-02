import Image from "next/image"
import { Fragment, type ReactNode } from "react"
import {
  IconAlertTriangle,
  IconBulb,
  IconChevronDown,
  IconInfoCircle,
  IconAlertOctagon,
} from "@tabler/icons-react"

import { toEmbedUrl } from "@/lib/embed"
import { clampHeadingLevel, headingId } from "@/lib/blocks"
import { cn } from "@/lib/utils"
import type {
  Block,
  CalloutVariant,
  InlineMark,
  RichText,
  TextAlign,
} from "@/types/api"

import { CodeBlock } from "./code-block"

interface BlockRendererProps {
  blocks: Block[]
  className?: string
}

const HEADING_CLASSES: Record<2 | 3 | 4, string> = {
  2: "mt-2 text-2xl font-bold tracking-tight sm:text-[1.7rem]",
  3: "mt-1.5 text-xl font-semibold tracking-tight",
  4: "mt-1 text-lg font-semibold tracking-tight",
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

function withMarks(content: ReactNode, marks?: InlineMark[]): ReactNode {
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
        node = (
          <a
            href={href}
            className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
            {...(isInternal ? {} : { target: "_blank", rel: "noopener noreferrer" })}
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
        return <Fragment key={index}>{withMarks(parts, inline.marks)}</Fragment>
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
            "text-[0.975rem] leading-7 text-foreground/90 sm:text-base",
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
      return (
        <Tag
          id={id}
          className={cn("scroll-mt-20", HEADING_CLASSES[level], alignClass(block.align))}
        >
          <InlineRuns value={block.content ?? block.text} />
        </Tag>
      )
    }

    case "quote":
      return (
        <blockquote className="border-l-2 border-primary pl-4 text-[1.05rem] italic leading-7 text-muted-foreground">
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
            "space-y-1.5 pl-6 text-[0.975rem] leading-7 sm:text-base",
            block.ordered ? "list-decimal" : "list-disc marker:text-primary"
          )}
        >
          {block.items.map((item, index) => (
            <li key={index}>
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

    case "image":
      return (
        <figure>
          <Image
            src={block.url}
            alt={block.alt ?? ""}
            width={1200}
            height={675}
            sizes="(max-width: 768px) 100vw, 768px"
            className="h-auto w-full rounded-xl border"
          />
          {block.alt ? (
            <figcaption className="mt-2 text-center text-xs text-muted-foreground">
              {block.alt}
            </figcaption>
          ) : null}
        </figure>
      )

    case "table": {
      const [headerRow, ...bodyRows] = block.rows
      return (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full border-collapse text-sm">
            {block.header ? (
              <thead className="bg-muted/60">
                <tr>
                  {headerRow.map((cell, index) => (
                    <th
                      key={index}
                      className="border-b px-3 py-2 text-left font-semibold"
                    >
                      <InlineRuns value={cell} />
                    </th>
                  ))}
                </tr>
              </thead>
            ) : null}
            <tbody>
              {(block.header ? bodyRows : block.rows).map((row, rowIndex) => (
                <tr key={rowIndex} className="odd:bg-muted/20 hover:bg-muted/40">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-3 py-2 align-top">
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
      return (
        <div className={cn("rounded-xl border p-4 sm:p-5", meta.box)}>
          <div className="flex items-start gap-3">
            <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", meta.iconClass)} />
            <div className="min-w-0">
              {block.title ? (
                <p className={cn("text-sm font-bold", meta.iconClass)}>
                  {block.title}
                </p>
              ) : null}
              <div className="text-[0.95rem] leading-7 text-foreground/90">
                <InlineRuns value={block.content ?? block.text} />
              </div>
            </div>
          </div>
        </div>
      )
    }

    case "button": {
      if (!SAFE_HREF.test(block.href)) return null
      const isInternal = block.href.startsWith("/") || block.href.startsWith("#")
      return (
        <div className="py-1">
          <a
            href={block.href}
            className={cn(
              "inline-flex items-center rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors",
              block.variant === "primary"
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "border border-primary/40 text-primary hover:bg-primary/10"
            )}
            {...(isInternal ? {} : { target: "_blank", rel: "noopener noreferrer" })}
          >
            {block.label}
          </a>
        </div>
      )
    }

    case "embed": {
      const embedUrl = toEmbedUrl(block.url)
      if (!embedUrl) return null
      return (
        <figure>
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
        <details className="group rounded-xl border border-border/80 bg-card shadow-2xs">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-foreground [&::-webkit-details-marker]:hidden">
            {block.title}
            <IconChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
          </summary>
          <div className="border-t border-border/60 px-4 py-3 text-[0.95rem] leading-7 text-foreground/90">
            <InlineRuns value={block.content ?? block.text} />
          </div>
        </details>
      )

    case "hr":
      return <hr className="border-border" />

    default:
      return null
  }
}

export function BlockRenderer({ blocks, className }: BlockRendererProps) {
  const usedIds = new Set<string>()

  return (
    <div className={cn("space-y-7", className)}>
      {blocks.map((block, index) => (
        <BlockNode key={index} block={block} usedIds={usedIds} />
      ))}
    </div>
  )
}
