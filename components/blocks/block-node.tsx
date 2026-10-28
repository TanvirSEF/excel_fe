import Image from "next/image"
import { IconChevronDown, IconListNumbers } from "@tabler/icons-react"

import {
  alignClass,
  isDownloadHref,
  toCdnUrl,
  type ImageBlock,
} from "@/lib/blocks"
import { parseVideoInfo } from "@/lib/embed"
import { extractLeadingArrow, hasCodeBlock } from "@/lib/rich-text"
import { cn } from "@/lib/utils"
import type { Block } from "@/types/api"

import { CalloutBlock } from "./callout-block"
import { CodeBlock } from "./code-block"
import { DownloadCard } from "./download-card"
import { HeadingBlock } from "./heading-block"
import { InlineRuns } from "./inline-runs"
import { InterlinkBlock } from "./interlink-block"
import { VideoEmbed } from "./video-embed"

interface BlockNodeProps {
  block: Block
  usedIds: Set<string>
  takeawayImages?: ImageBlock[]
  isFaqQuestion?: boolean
}

export function BlockNode({
  block,
  usedIds,
  takeawayImages,
  isFaqQuestion,
}: BlockNodeProps) {
  switch (block.type) {
    case "paragraph": {
      const trimmed = block.text?.trim()
      if (
        trimmed &&
        (trimmed.startsWith("http://") || trimmed.startsWith("https://")) &&
        !trimmed.includes("\n")
      ) {
        const video = parseVideoInfo(trimmed)
        if (video) {
          return <VideoEmbed url={trimmed} />
        }
      }

      if (Array.isArray(block.content)) {
        const meaningfulRuns = block.content.filter(
          (r) => r.text && r.text.trim().length > 0
        )
        if (meaningfulRuns.length === 1) {
          const run = meaningfulRuns[0]
          const linkMark = run.marks?.find((m) => m.type === "link")
          if (linkMark?.href && isDownloadHref(linkMark.href, run.text)) {
            return <DownloadCard href={linkMark.href} label={run.text.trim()} />
          }
        }
      }

      if (block.text && /^\s*steps?:?\s*$/i.test(block.text.trim())) {
        return (
          <div className="mt-7 mb-2.5 flex items-center gap-2 text-sm font-bold tracking-wider text-primary uppercase sm:text-base">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary">
              <IconListNumbers className="h-4 w-4" />
            </span>
            <span>Steps</span>
          </div>
        )
      }

      const content = block.content ?? block.text
      const { isStep, cleaned } = extractLeadingArrow(content)

      if (isStep) {
        return (
          <div
            className={cn(
              "group/step flex items-start gap-2.5 text-[17px] leading-[1.75] font-normal text-foreground/90 sm:text-[18px]",
              alignClass(block.align)
            )}
          >
            <span
              className="shrink-0 text-[1.05em] leading-[1.75] font-bold text-primary select-none"
              aria-hidden="true"
            >
              ➤
            </span>
            <div className="min-w-0 flex-1">
              <InlineRuns value={cleaned} />
            </div>
          </div>
        )
      }

      const Tag = hasCodeBlock(content) ? "div" : "p"
      return (
        <Tag
          className={cn(
            "text-[17px] leading-[1.75] font-normal text-foreground/90 sm:text-[18px]",
            alignClass(block.align)
          )}
        >
          <InlineRuns value={content} />
        </Tag>
      )
    }

    case "heading":
      return (
        <HeadingBlock
          block={block}
          usedIds={usedIds}
          isFaqQuestion={isFaqQuestion}
        />
      )

    case "quote":
      return (
        <blockquote className="my-4 rounded-r-xl border-l-4 border-primary/70 bg-primary/5 px-4 py-2.5 text-[17px] leading-[1.7] font-normal text-muted-foreground italic sm:text-[18px]">
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
            "my-3 space-y-1.5 pl-6 text-[17px] leading-[1.75] font-normal text-foreground/90 sm:text-[18px]",
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
      const src = block.url ? toCdnUrl(encodeURI(decodeURI(block.url))) : ""
      return (
        <figure className="my-2.5 flex flex-col items-center sm:my-3.5">
          <Image
            src={src}
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
        <div className="my-7 overflow-x-auto rounded-2xl border border-border/80 bg-card shadow-sm dark:shadow-md dark:shadow-black/20">
          <table className="w-full min-w-full border-collapse text-[15px]">
            {block.header ? (
              <thead className="bg-primary text-primary-foreground">
                <tr className="border-b border-primary/20">
                  {headerRow.map((cell, index) => (
                    <th
                      key={index}
                      className="border-r border-primary-foreground/15 px-4 py-3.5 text-left text-[13px] font-bold tracking-wider text-primary-foreground uppercase last:border-r-0 sm:px-5 sm:py-4 sm:text-sm [&_a]:text-primary-foreground [&_a]:underline"
                    >
                      <InlineRuns value={cell} />
                    </th>
                  ))}
                </tr>
              </thead>
            ) : null}
            <tbody className="divide-y divide-border/60">
              {(block.header ? bodyRows : block.rows).map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="transition-colors duration-150 odd:bg-card even:bg-primary/[0.035] hover:bg-primary/[0.07] dark:even:bg-primary/[0.06] dark:hover:bg-primary/[0.12]"
                >
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className={cn(
                        "border-r border-border/40 px-4 py-3.5 align-top text-[15px] leading-relaxed last:border-r-0 sm:px-5 sm:py-3.5 sm:text-base",
                        cellIndex === 0
                          ? "font-semibold text-foreground"
                          : "font-normal text-foreground/90"
                      )}
                    >
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

    case "callout":
      return <CalloutBlock block={block} takeawayImages={takeawayImages} />

    case "interlink":
      return <InterlinkBlock block={block} />

    case "button": {
      if (isDownloadHref(block.href, block.label)) {
        return <DownloadCard href={block.href} label={block.label} />
      }
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
    }

    case "embed":
      return <VideoEmbed url={block.url} caption={block.caption} />

    case "accordion":
      return (
        <details className="group my-4 rounded-xl border border-border/80 bg-card shadow-2xs">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-base font-semibold text-foreground [&::-webkit-details-marker]:hidden">
            {block.title}
            <IconChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
          </summary>
          <div className="border-t border-border/60 px-4 py-3 text-[16px] leading-relaxed font-normal text-foreground/90 sm:text-[17px]">
            <InlineRuns value={block.content ?? block.text} />
          </div>
        </details>
      )

    case "hr":
      return (
        <hr className="my-8 border-0 border-t border-border sm:my-10 dark:border-white/15" />
      )

    default:
      return null
  }
}
