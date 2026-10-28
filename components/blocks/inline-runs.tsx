import { Fragment, type ReactNode } from "react"

import { isDownloadHref } from "@/lib/blocks"
import { formatShortcuts, processRichTextItems } from "@/lib/rich-text"
import { cn } from "@/lib/utils"
import type { InlineMark, RichText } from "@/types/api"

import { CodeBlock } from "./code-block"

const SAFE_HREF = /^(https?:\/\/|mailto:|\/|#)/i

function withMarks(
  content: ReactNode,
  marks?: InlineMark[],
  rawText?: string
): ReactNode {
  let node = content
  for (const mark of marks ?? []) {
    switch (mark.type) {
      case "bold":
        node = <strong className="font-bold">{node}</strong>
        break
      case "italic":
        node = <em>{node}</em>
        break
      case "strike":
        node = <del>{node}</del>
        break
      case "underline":
        node = <u className="underline underline-offset-2">{node}</u>
        break
      case "sup":
        node = (
          <sup className="align-super text-[0.75em] leading-none">{node}</sup>
        )
        break
      case "sub":
        node = (
          <sub className="align-sub text-[0.75em] leading-none">{node}</sub>
        )
        break
      case "kbd":
        node = (
          <kbd className="relative -top-[1.5px] mx-1 inline-flex min-w-[1.8em] items-center justify-center rounded-[6px] border border-primary bg-card px-2 py-0.5 align-baseline font-sans text-[0.85em] font-bold tracking-wide text-foreground uppercase shadow-[0_2.5px_0_0_var(--color-primary),0_3px_4px_rgba(0,0,0,0.08)] select-none dark:shadow-[0_2.5px_0_0_var(--color-primary),0_3px_6px_rgba(0,0,0,0.35)]">
            {node}
          </kbd>
        )
        break
      case "code":
        node = (
          <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.9em] [overflow-wrap:anywhere] break-words">
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

export function InlineRuns({ value }: { value: RichText }) {
  const runs = formatShortcuts(value)
  const items = processRichTextItems(runs)

  return (
    <>
      {items.map((item, index) => {
        if (item.type === "code") {
          return (
            <CodeBlock key={index} code={item.code} language={item.language} />
          )
        }

        if (!item.text) {
          return null
        }

        const normalizedText = item.text.replace(/\n{2,}/g, "\n")
        const parts = normalizedText.split("\n").map((part, partIndex) => (
          <Fragment key={partIndex}>
            {partIndex > 0 ? <br /> : null}
            {part}
          </Fragment>
        ))
        return (
          <Fragment key={index}>
            {withMarks(parts, item.marks, item.text)}
          </Fragment>
        )
      })}
    </>
  )
}
