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

import { parseVideoInfo } from "@/lib/embed"
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
import { FormulaCodeBlock } from "./formula-code-block"
import { InlineToc } from "./inline-toc"
import { VideoEmbed } from "./video-embed"
import type { TocEntry } from "@/lib/blocks"

interface BlockRendererProps {
  blocks: Block[]
  className?: string
  toc?: TocEntry[]
  tocDefaultCollapsed?: boolean
}

const HEADING_CLASSES: Record<2 | 3 | 4, string> = {
  2: "mt-8 sm:mt-10 mb-2 sm:mb-3 text-2xl sm:text-[1.85rem] font-bold tracking-tight text-foreground leading-snug first:mt-0",
  3: "mt-6 sm:mt-7 mb-1.5 sm:mb-2 text-xl sm:text-[1.4rem] font-semibold tracking-tight text-foreground leading-snug first:mt-0",
  4: "mt-5 sm:mt-6 mb-1 text-lg sm:text-[1.2rem] font-semibold text-foreground leading-snug first:mt-0",
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

function cleanRichText(value: RichText | undefined): RichText {
  if (!value) return ""
  if (typeof value === "string") return value.trim()

  const runs: InlineText[] = value.map((r) => ({ ...r }))

  while (runs.length > 0 && !runs[0].text.trim()) {
    runs.shift()
  }
  if (runs.length === 0) return runs

  runs[0] = { ...runs[0], text: runs[0].text.replace(/^[\s\r\n]+/, "") }
  if (!runs[0].text) {
    runs.shift()
  }

  while (runs.length > 0 && !runs[runs.length - 1].text.trim()) {
    runs.pop()
  }
  if (runs.length === 0) return runs

  const lastIdx = runs.length - 1
  runs[lastIdx] = {
    ...runs[lastIdx],
    text: runs[lastIdx].text.replace(/[\s\r\n]+$/, ""),
  }
  if (!runs[lastIdx].text) {
    runs.pop()
  }

  // Collapse 3+ newlines within runs to at most 2 newlines (\n\n)
  for (let i = 0; i < runs.length; i++) {
    runs[i].text = runs[i].text.replace(/\n{3,}/g, "\n\n")
  }

  // Collapse newlines across adjacent run boundaries so combined newlines never exceed \n\n
  for (let i = 0; i < runs.length - 1; i++) {
    const trailingMatch = runs[i].text.match(/\n+$/)
    if (trailingMatch) {
      if (trailingMatch[0].length >= 2) {
        runs[i + 1].text = runs[i + 1].text.replace(/^\n+/, "")
      } else if (/^\n+/.test(runs[i + 1].text)) {
        runs[i + 1].text = runs[i + 1].text.replace(/^\n+/, "\n")
      }
    }
  }

  return runs
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
    return strip(value).trim()
  }

  const runs: InlineText[] = value.map((r) => ({ ...r }))
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
    }
  }

  return cleanRichText(runs)
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
        node = <sup className="text-[0.75em] leading-none align-super">{node}</sup>
        break
      case "sub":
        node = <sub className="text-[0.75em] leading-none align-sub">{node}</sub>
        break
      case "kbd":
        node = (
          <kbd className="relative -top-[1.5px] mx-1 inline-flex min-w-[1.8em] select-none items-center justify-center rounded-[6px] border border-primary bg-card px-2 py-0.5 font-sans text-[0.85em] font-bold uppercase tracking-wide text-foreground shadow-[0_2.5px_0_0_var(--color-primary),0_3px_4px_rgba(0,0,0,0.08)] align-baseline dark:shadow-[0_2.5px_0_0_var(--color-primary),0_3px_6px_rgba(0,0,0,0.35)]">
            {node}
          </kbd>
        )
        break
      case "code":
        node = (
          <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.9em] break-words [overflow-wrap:anywhere]">
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

const SHORTCUT_REGEX =
  /\b(Ctrl|Control|Alt|Option|Shift|Cmd|Command|Win|Windows)(?:[\s\u00a0]*\+[\s\u00a0]*(?:Ctrl|Control|Alt|Option|Shift|Cmd|Command|Win|Windows|F1[0-2]|F[1-9]|Enter|Return|Esc|Escape|Tab|Space|Spacebar|Backspace|Delete|Del|Insert|Ins|Home|End|Page[\s\u00a0]*Up|Page[\s\u00a0]*Down|PgUp|PgDn|Up[\s\u00a0]*Arrow|Down[\s\u00a0]*Arrow|Left[\s\u00a0]*Arrow|Right[\s\u00a0]*Arrow|Arrow[\s\u00a0]*Up|Arrow[\s\u00a0]*Down|Arrow[\s\u00a0]*Left|Arrow[\s\u00a0]*Right|Plus|Minus|[A-Za-z0-9]|[;':",.<>\/?\\`~=\-_+]))+/gi

const MODIFIER_NAMES = new Set([
  "ctrl",
  "control",
  "alt",
  "option",
  "shift",
  "cmd",
  "command",
  "win",
  "windows",
])

const VALID_KEY_NAMES = new Set([
  "ctrl",
  "control",
  "alt",
  "option",
  "shift",
  "cmd",
  "command",
  "win",
  "windows",
  "enter",
  "return",
  "esc",
  "escape",
  "tab",
  "space",
  "spacebar",
  "backspace",
  "delete",
  "del",
  "insert",
  "ins",
  "home",
  "end",
  "pageup",
  "pagedown",
  "page up",
  "page down",
  "pgup",
  "pgdn",
  "uparrow",
  "downarrow",
  "leftarrow",
  "rightarrow",
  "up arrow",
  "down arrow",
  "left arrow",
  "right arrow",
  "arrowup",
  "arrowdown",
  "arrowleft",
  "arrowright",
  "plus",
  "minus",
  "f1",
  "f2",
  "f3",
  "f4",
  "f5",
  "f6",
  "f7",
  "f8",
  "f9",
  "f10",
  "f11",
  "f12",
])

function cleanKeyText(str: string): string {
  return str.trim().replace(/^[\u00a0\s]+|[\u00a0\s]+$/g, "")
}

function isModifier(str: string): boolean {
  return MODIFIER_NAMES.has(cleanKeyText(str).toLowerCase())
}

function isKey(str: string): boolean {
  const clean = cleanKeyText(str).toLowerCase()
  if (VALID_KEY_NAMES.has(clean)) return true
  if (/^[a-z0-9]$/i.test(clean)) return true
  if (/^[;':",.<>\/?\\`~=\-_+]$/.test(clean)) return true
  return false
}

function parseShortcutKeys(shortcutStr: string): string[] {
  const str = shortcutStr.replace(/[\u00a0]/g, " ").trim()
  const matchPlus = str.match(/\+\s*\+$/)
  if (matchPlus && matchPlus.index !== undefined) {
    const prefix = str.slice(0, matchPlus.index)
    const prefixKeys = prefix.split(/\s*\+\s*/).filter(Boolean).map(cleanKeyText)
    return [...prefixKeys, "+"]
  }
  return str.split(/\s*\+\s*/).filter(Boolean).map(cleanKeyText)
}

function formatShortcuts(value: RichText | undefined): InlineText[] {
  if (!value) return []
  const initialRuns: InlineText[] =
    typeof value === "string" ? [{ text: value }] : value.map((r) => ({ ...r }))

  if (initialRuns.length === 0) return initialRuns

  const intermediate: InlineText[] = []
  let i = 0
  while (i < initialRuns.length) {
    const cur = initialRuns[i]
    const curTrimmed = cleanKeyText(cur.text || "")

    if (
      isModifier(curTrimmed) &&
      i + 2 < initialRuns.length &&
      cleanKeyText(initialRuns[i + 1].text || "") === "+" &&
      isKey(initialRuns[i + 2].text || "")
    ) {
      let j = i
      const chainKeys: InlineText[] = []
      while (
        j < initialRuns.length &&
        ((chainKeys.length === 0 && isModifier(initialRuns[j].text || "")) ||
          (chainKeys.length > 0 &&
            j + 1 < initialRuns.length &&
            cleanKeyText(initialRuns[j].text || "") === "+" &&
            isKey(initialRuns[j + 1].text || "")))
      ) {
        if (chainKeys.length === 0) {
          chainKeys.push(initialRuns[j])
          j++
        } else {
          chainKeys.push(initialRuns[j + 1])
          j += 2
        }
      }

      chainKeys.forEach((keyRun, idx) => {
        if (idx > 0) {
          intermediate.push({ text: " + " })
        }
        const marks: InlineMark[] = [
          ...(keyRun.marks || []).filter((m) => m.type !== "kbd"),
          { type: "kbd" },
        ]
        intermediate.push({ text: cleanKeyText(keyRun.text), marks })
      })

      i = j
      continue
    }

    intermediate.push(cur)
    i++
  }

  const result: InlineText[] = []
  for (const run of intermediate) {
    if (run.marks?.some((m) => m.type === "kbd")) {
      if (run.text.includes("+")) {
        const keys = parseShortcutKeys(run.text)
        const otherMarks = run.marks.filter((m) => m.type !== "kbd")
        const kbdMarks: InlineMark[] = [...otherMarks, { type: "kbd" }]
        keys.forEach((key, idx) => {
          if (idx > 0) {
            result.push({ text: " + ", marks: otherMarks.length > 0 ? otherMarks : undefined })
          }
          result.push({ text: key, marks: kbdMarks })
        })
      } else {
        result.push({ ...run, text: cleanKeyText(run.text) })
      }
      continue
    }

    if (run.marks?.some((m) => m.type === "code" || m.type === "link")) {
      result.push(run)
      continue
    }

    const text = run.text || ""
    SHORTCUT_REGEX.lastIndex = 0
    if (!text || !SHORTCUT_REGEX.test(text)) {
      result.push(run)
      continue
    }

    SHORTCUT_REGEX.lastIndex = 0
    let lastIndex = 0
    let match: RegExpExecArray | null
    while ((match = SHORTCUT_REGEX.exec(text)) !== null) {
      const matchStart = match.index
      const matchEnd = SHORTCUT_REGEX.lastIndex

      if (matchStart > lastIndex) {
        result.push({
          text: text.slice(lastIndex, matchStart),
          marks: run.marks,
        })
      }

      const shortcutText = match[0]
      const keys = parseShortcutKeys(shortcutText)
      const otherMarks = (run.marks || []).filter((m) => m.type !== "kbd")
      const kbdMarks: InlineMark[] = [...otherMarks, { type: "kbd" }]

      keys.forEach((key, kIdx) => {
        if (kIdx > 0) {
          result.push({
            text: " + ",
            marks: otherMarks.length > 0 ? otherMarks : undefined,
          })
        }
        result.push({ text: key, marks: kbdMarks })
      })

      lastIndex = matchEnd
    }

    if (lastIndex < text.length) {
      result.push({
        text: text.slice(lastIndex),
        marks: run.marks,
      })
    }
  }

  return result
}

const FENCED_CODE_REGEX = /```([a-zA-Z0-9_#-]*)\r?\n([\s\S]*?)```/g

interface CodeBlockItem {
  type: "code"
  code: string
  language?: string
}

interface InlineItem {
  type: "inline"
  text: string
  marks?: InlineMark[]
}

type ProcessedRunItem = CodeBlockItem | InlineItem

function isCodeBlockRun(run: InlineText): boolean {
  if (run.marks?.some((m) => m.type === "code")) {
    const text = run.text.replace(/\r\n/g, "\n")
    if (text.trim().includes("\n")) {
      return true
    }
    if (/\b(Sub|Function)\b[\s\S]+\b(End Sub|End Function)\b/i.test(text)) {
      return true
    }
    if (/^```([a-zA-Z0-9_#-]*)\r?\n?([\s\S]*?)```$/.test(text.trim())) {
      return true
    }
  }
  return false
}

function extractCodeAndLanguage(text: string): {
  code: string
  language?: string
} {
  const trimmed = text.trim()
  const fenceMatch = trimmed.match(/^```([a-zA-Z0-9_#-]*)\r?\n?([\s\S]*?)```$/)
  if (fenceMatch) {
    return {
      language: fenceMatch[1] || undefined,
      code: fenceMatch[2].replace(/\r\n/g, "\n").trim(),
    }
  }
  return {
    code: text.replace(/\r\n/g, "\n").trim(),
  }
}

function processRichTextItems(runs: InlineText[]): ProcessedRunItem[] {
  const items: ProcessedRunItem[] = []

  for (const run of runs) {
    if (isCodeBlockRun(run)) {
      const { code, language } = extractCodeAndLanguage(run.text)
      items.push({ type: "code", code, language })
      continue
    }

    if (run.text.includes("```")) {
      FENCED_CODE_REGEX.lastIndex = 0
      let lastIndex = 0
      let match: RegExpExecArray | null
      while ((match = FENCED_CODE_REGEX.exec(run.text)) !== null) {
        const before = run.text.slice(lastIndex, match.index)
        if (before) {
          items.push({ type: "inline", text: before, marks: run.marks })
        }
        items.push({
          type: "code",
          code: match[2].trim(),
          language: match[1] || undefined,
        })
        lastIndex = FENCED_CODE_REGEX.lastIndex
      }
      const after = run.text.slice(lastIndex)
      if (after) {
        items.push({ type: "inline", text: after, marks: run.marks })
      }
      continue
    }

    items.push({ type: "inline", text: run.text, marks: run.marks })
  }

  for (let i = 0; i < items.length; i++) {
    if (items[i].type === "code") {
      let prevIdx = i - 1
      while (prevIdx >= 0 && items[prevIdx].type === "inline") {
        const item = items[prevIdx] as InlineItem
        item.text = item.text.replace(/[\r\n]+$/, "")
        if (item.text.length > 0) {
          break
        }
        prevIdx--
      }

      let nextIdx = i + 1
      while (nextIdx < items.length && items[nextIdx].type === "inline") {
        const item = items[nextIdx] as InlineItem
        item.text = item.text.replace(/^[\r\n]+/, "")
        if (item.text.length > 0) {
          break
        }
        nextIdx++
      }
    }
  }

  return items
}

function hasCodeBlock(value: RichText | undefined): boolean {
  if (!value) return false
  if (typeof value === "string") {
    return value.includes("```")
  }
  for (const run of value) {
    if (run.text.includes("```")) return true
    if (isCodeBlockRun(run)) return true
  }
  return false
}

function InlineRuns({ value }: { value: RichText }) {
  const runs = formatShortcuts(value)
  const items = processRichTextItems(runs)

  return (
    <>
      {items.map((item, index) => {
        if (item.type === "code") {
          return (
            <CodeBlock
              key={index}
              code={item.code}
              language={item.language}
            />
          )
        }

        if (!item.text) {
          return null
        }

        const parts = item.text.split("\n").map((part, partIndex) => (
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

function alignClass(align: TextAlign | undefined) {
  if (align === "center") return "text-center"
  if (align === "right") return "text-right"
  return null
}

type ImageBlock = Extract<Block, { type: "image" }>

interface BlockNodeProps {
  block: Block
  usedIds: Set<string>
  takeawayImages?: ImageBlock[]
}

function BlockNode({ block, usedIds, takeawayImages }: BlockNodeProps) {
  switch (block.type) {
    case "paragraph": {
      const trimmed = block.text?.trim()
      if (trimmed && (trimmed.startsWith("http://") || trimmed.startsWith("https://")) && !trimmed.includes("\n")) {
        const video = parseVideoInfo(trimmed)
        if (video) {
          return <VideoEmbed url={trimmed} />
        }
      }
      const content = block.content ?? block.text
      const Tag = hasCodeBlock(content) ? "div" : "p"
      return (
        <Tag
          className={cn(
            "text-[17px] sm:text-[18px] font-normal leading-[1.75] text-foreground/90",
            alignClass(block.align)
          )}
        >
          <InlineRuns value={content} />
        </Tag>
      )
    }

    case "heading": {
      const level = clampHeadingLevel(block.level)
      const id = headingId(block.text, usedIds)
      const Tag = `h${level}` as "h2" | "h3" | "h4"

      if (block.num) {
        return (
          <div
            id={id}
            className={cn(
              "group flex scroll-mt-24 items-start gap-3 transition-colors",
              HEADING_CLASSES[level]
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
            className="group mt-6 sm:mt-7 mb-1.5 sm:mb-2 flex scroll-mt-24 items-start gap-2.5 first:mt-0"
          >
            <span
              aria-hidden="true"
              className="mt-1 h-5 w-1 rounded-full bg-primary/80 transition-all duration-200 group-hover:h-6 group-hover:scale-y-110 group-hover:bg-primary shrink-0"
            />
            <Tag
              className={cn(
                "text-xl sm:text-[1.4rem] font-semibold tracking-tight text-foreground leading-snug transition-all duration-200 group-hover:text-primary group-hover:translate-x-0.5",
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

    case "quote":
      return (
        <blockquote className="my-4 border-l-4 border-primary/70 bg-primary/5 rounded-r-xl py-2.5 px-4 text-[17px] sm:text-[18px] italic font-normal leading-[1.7] text-muted-foreground">
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
            "my-3 space-y-1.5 pl-6 text-[17px] sm:text-[18px] font-normal leading-[1.75] text-foreground/90",
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
        <div className="my-7 overflow-x-auto rounded-2xl border border-border/80 bg-card shadow-sm dark:shadow-md dark:shadow-black/20">
          <table className="w-full min-w-full border-collapse text-[15px]">
            {block.header ? (
              <thead className="bg-primary text-primary-foreground">
                <tr className="border-b border-primary/20">
                  {headerRow.map((cell, index) => (
                    <th
                      key={index}
                      className="px-4 py-3.5 sm:px-5 sm:py-4 text-left text-[13px] sm:text-sm font-bold uppercase tracking-wider text-primary-foreground border-r border-primary-foreground/15 last:border-r-0 [&_a]:text-primary-foreground [&_a]:underline"
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
                        "px-4 py-3.5 sm:px-5 sm:py-3.5 align-top leading-relaxed text-[15px] sm:text-base border-r border-border/40 last:border-r-0",
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
                <div className="hidden sm:block absolute -right-1 bottom-0 h-2.5 w-1.5 bg-black/40 dark:bg-black/70 -z-10 [clip-path:polygon(100%_0,0_0,100%_100%)]" />
              </div>
            </div>

            <div className="text-[17px] sm:text-[18px] font-normal leading-[1.75] text-foreground/90">
              <InlineRuns value={cleanRichText(block.content ?? block.text)} />
            </div>

            {takeawayImages && takeawayImages.length > 0 ? (
              <div className="mt-4 sm:mt-5 flex flex-col items-center gap-4">
                {takeawayImages.map((img, i) => {
                  const width = img.width ?? 783
                  const height = img.height ?? Math.round(width * 0.5625)
                  return (
                    <figure key={i} className="flex flex-col items-center w-full">
                      <Image
                        src={img.url}
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
          <div className="relative my-6 flex items-start gap-3 rounded-r-2xl border-l-[5px] border-primary bg-primary/[0.08] p-4 sm:py-4 sm:px-5 shadow-md shadow-primary/20 transition-colors dark:bg-primary/[0.14] dark:shadow-black/30">
            <IconPaperclip className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div className="flex-1 text-[16px] sm:text-[17px] font-normal leading-[1.7] text-foreground/90">
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

      const isFormulaTitle =
        Boolean(
          block.title &&
            /^(excel\s+)?formula(\s+box)?$/i.test(block.title.trim())
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
          <div className="relative my-7 rounded-2xl border-2 border-primary/50 bg-background p-5 sm:p-6 pt-7 sm:pt-8 shadow-xs transition-colors dark:border-primary/40">
            <div className="absolute -top-3.5 left-8 sm:left-10 inline-flex items-center gap-2 bg-background px-1 text-base sm:text-[1.125rem] font-bold tracking-tight text-primary">
              <IconNotes className="h-5 w-5 text-primary shrink-0" />
              <span>{block.title || "Explanation"}</span>
            </div>

            <div className="text-[16px] sm:text-[17px] font-normal leading-[1.7] text-foreground/90">
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
              <p className="font-semibold text-foreground text-base sm:text-[17px]">{block.title}</p>
            ) : null}
            <div className="font-normal leading-relaxed text-foreground/90">
              <InlineRuns value={block.content ?? block.text} />
            </div>
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

    case "embed":
      return <VideoEmbed url={block.url} caption={block.caption} />

    case "accordion":
      return (
        <details className="group my-4 rounded-xl border border-border/80 bg-card shadow-2xs">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-base font-semibold text-foreground [&::-webkit-details-marker]:hidden">
            {block.title}
            <IconChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
          </summary>
          <div className="border-t border-border/60 px-4 py-3 text-[16px] sm:text-[17px] font-normal leading-relaxed text-foreground/90">
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

export function BlockRenderer({
  blocks,
  className,
  toc,
  tocDefaultCollapsed = true,
}: BlockRendererProps) {
  const usedIds = new Set<string>()
  const hasToc = Boolean(toc && toc.length >= 2)

  const takeawayIndex = blocks.findIndex(
    (b) =>
      b.type === "callout" &&
      ((b.title && /takeaway/i.test(b.title)) ||
        (b.variant === "tip" && Boolean(b.title)))
  )

  const takeawayImages: ImageBlock[] = []
  const takeawayImageIndices = new Set<number>()

  if (takeawayIndex !== -1) {
    let nextIdx = takeawayIndex + 1
    while (nextIdx < blocks.length && blocks[nextIdx].type === "image") {
      takeawayImages.push(blocks[nextIdx] as ImageBlock)
      takeawayImageIndices.add(nextIdx)
      nextIdx++
    }
  }

  return (
    <div className={cn("entry-content post-content space-y-3.5 sm:space-y-4", className)}>
      {hasToc && takeawayIndex === -1 && toc ? (
        <InlineToc entries={toc} defaultCollapsed={tocDefaultCollapsed} />
      ) : null}

      {blocks.map((block, index) => {
        if (takeawayImageIndices.has(index)) {
          return null
        }

        const isTakeaway = index === takeawayIndex

        return (
          <Fragment key={index}>
            <BlockNode
              block={block}
              usedIds={usedIds}
              takeawayImages={isTakeaway ? takeawayImages : undefined}
            />
            {hasToc && isTakeaway && toc ? (
              <InlineToc entries={toc} defaultCollapsed={tocDefaultCollapsed} />
            ) : null}
          </Fragment>
        )
      })}
    </div>
  )
}
