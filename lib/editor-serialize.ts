import type { JSONContent } from "@tiptap/react"

import type {
  Block,
  InlineMark,
  InlineText,
  MarkType,
  RichText,
  TextAlign,
} from "@/types/api"

const MARK_TYPES = new Set([
  "bold",
  "italic",
  "strike",
  "code",
  "link",
  "textStyle",
  "highlight",
])
const ALIGNMENTS = new Set(["left", "center", "right"])

function textOf(node: JSONContent | undefined): string {
  if (!node) return ""
  if (node.type === "text") return node.text ?? ""
  if (node.content) return node.content.map(textOf).join("")
  return ""
}

function stringAttr(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined
}

function markOf(mark: NonNullable<JSONContent["marks"]>[number]): InlineMark | null {
  if (!MARK_TYPES.has(mark.type)) return null
  if (mark.type === "link") {
    const href = stringAttr(mark.attrs?.href)
    return href ? { type: "link", href } : null
  }
  if (mark.type === "textStyle") {
    const fontSize = stringAttr(mark.attrs?.fontSize)
    const color = stringAttr(mark.attrs?.color)
    return fontSize || color ? { type: "textStyle", ...(fontSize ? { fontSize } : {}), ...(color ? { color } : {}) } : null
  }
  if (mark.type === "highlight") {
    const color = stringAttr(mark.attrs?.color)
    return { type: "highlight", ...(color ? { color } : {}) }
  }
  return { type: mark.type as MarkType }
}

function inlineOf(nodes: JSONContent[] | undefined): InlineText[] {
  const inlines: InlineText[] = []
  for (const node of nodes ?? []) {
    if (node.type === "hardBreak") {
      inlines.push({ text: "\n" })
    } else if (node.type === "text") {
      const marks = (node.marks ?? [])
        .map(markOf)
        .filter((mark): mark is InlineMark => mark !== null)
      inlines.push(marks.length ? { text: node.text ?? "", marks } : { text: node.text ?? "" })
    } else if (node.content) {
      inlines.push(...inlineOf(node.content))
    }
  }
  return inlines
}

function richOf(nodes: JSONContent[] | undefined): RichText {
  const inlines = inlineOf(nodes)
  const isPlain = inlines.every(
    (inline) => !inline.marks && !inline.text.includes("\n")
  )
  return isPlain ? inlines.map((inline) => inline.text).join("") : inlines
}

function plainOf(rich: RichText): string {
  return typeof rich === "string" ? rich : rich.map((inline) => inline.text).join("")
}

function docMarks(inline: InlineText): JSONContent["marks"] {
  if (!inline.marks?.length) return undefined
  return inline.marks.map((mark) => {
    if (mark.type === "link") {
      return { type: "link", attrs: { href: mark.href ?? "" } }
    }
    if (mark.type === "textStyle") {
      const attrs: Record<string, string> = {}
      if (mark.fontSize) attrs.fontSize = mark.fontSize
      if (mark.color) attrs.color = mark.color
      return Object.keys(attrs).length
        ? { type: "textStyle", attrs }
        : { type: "textStyle" }
    }
    if (mark.type === "highlight") {
      return mark.color
        ? { type: "highlight", attrs: { color: mark.color } }
        : { type: "highlight" }
    }
    return { type: mark.type }
  })
}

function inlineNodes(rich: RichText): JSONContent[] {
  if (typeof rich === "string") {
    return rich ? [{ type: "text", text: rich }] : []
  }
  const nodes: JSONContent[] = []
  for (const inline of rich) {
    const marks = docMarks(inline)
    const parts = inline.text.split("\n")
    parts.forEach((part, index) => {
      if (index > 0) nodes.push({ type: "hardBreak" })
      if (part) nodes.push({ type: "text", text: part, ...(marks ? { marks } : {}) })
    })
  }
  return nodes
}

function blockOf(
  rich: RichText
): { text: string; content?: InlineText[] } {
  return typeof rich === "string"
    ? { text: rich }
    : { text: plainOf(rich), content: rich }
}

function alignOf(value: unknown): TextAlign | undefined {
  return typeof value === "string" && ALIGNMENTS.has(value)
    ? (value as TextAlign)
    : undefined
}

function clampLevel(level: number): number {
  if (level <= 2) return 2
  if (level >= 4) return 4
  return level
}

function paragraph(rich: RichText, align?: TextAlign): JSONContent {
  const content = inlineNodes(rich)
  return {
    type: "paragraph",
    ...(align ? { attrs: { textAlign: align } } : {}),
    ...(content.length ? { content } : {}),
  }
}

export function blocksToDoc(blocks: Block[]): JSONContent {
  return {
    type: "doc",
    content: blocks.map((block): JSONContent => {
      switch (block.type) {
        case "paragraph":
          return paragraph(block.content ?? block.text, block.align)
        case "heading": {
          const content = inlineNodes(block.content ?? block.text)
          return {
            type: "heading",
            attrs: {
              level: clampLevel(block.level),
              ...(block.align ? { textAlign: block.align } : {}),
            },
            ...(content.length ? { content } : {}),
          }
        }
        case "quote":
          return {
            type: "blockquote",
            content: [paragraph(block.content ?? block.text)],
          }
        case "callout": {
          const content = inlineNodes(block.content ?? block.text)
          return {
            type: "callout",
            attrs: {
              variant: block.variant,
              ...(block.title ? { title: block.title } : {}),
            },
            ...(content.length ? { content: [{ type: "paragraph", content }] } : {}),
          }
        }
        case "accordion": {
          const content = inlineNodes(block.content ?? block.text)
          return {
            type: "accordion",
            attrs: { title: block.title },
            ...(content.length ? { content: [{ type: "paragraph", content }] } : {}),
          }
        }
        case "button":
          return {
            type: "ctaButton",
            attrs: {
              label: block.label,
              href: block.href,
              variant: block.variant,
            },
          }
        case "embed":
          return {
            type: "embed",
            attrs: {
              url: block.url,
              ...(block.caption ? { caption: block.caption } : {}),
            },
          }
        case "code":
          return {
            type: "codeBlock",
            attrs: { language: block.language ?? "plaintext" },
            content: block.text ? [{ type: "text", text: block.text }] : [],
          }
        case "list":
          return {
            type: block.ordered ? "orderedList" : "bulletList",
            content: block.items.map((item) => ({
              type: "listItem",
              content: [paragraph(item)],
            })),
          }
        case "html":
          return { type: "htmlBlock", attrs: { html: block.html } }
        case "image":
          return {
            type: "image",
            attrs: { src: block.url, alt: block.alt ?? null },
          }
        case "table":
          return {
            type: "table",
            content: block.rows.map((row, rowIndex) => ({
              type: "tableRow",
              content: row.map((cell) => ({
                type:
                  block.header && rowIndex === 0 ? "tableHeader" : "tableCell",
                content: [paragraph(cell)],
              })),
            })),
          }
        case "hr":
          return { type: "horizontalRule" }
        default:
          return paragraph("")
      }
    }),
  }
}

export function docToBlocks(doc: JSONContent | null | undefined): Block[] {
  if (!doc?.content) return []

  const blocks: Block[] = []

  for (const node of doc.content) {
    switch (node.type) {
      case "paragraph": {
        const { text, content } = blockOf(richOf(node.content))
        blocks.push({
          type: "paragraph",
          text,
          ...(content ? { content } : {}),
          ...(alignOf(node.attrs?.textAlign)
            ? { align: alignOf(node.attrs?.textAlign) }
            : {}),
        })
        break
      }
      case "heading": {
        const { text, content } = blockOf(richOf(node.content))
        blocks.push({
          type: "heading",
          text,
          level: clampLevel(Number(node.attrs?.level ?? 2)),
          ...(content ? { content } : {}),
          ...(alignOf(node.attrs?.textAlign)
            ? { align: alignOf(node.attrs?.textAlign) }
            : {}),
        })
        break
      }
      case "blockquote": {
        const { text, content } = blockOf(richOf(node.content))
        if (text) blocks.push({ type: "quote", text, ...(content ? { content } : {}) })
        break
      }
      case "callout": {
        const { text, content } = blockOf(richOf(node.content))
        const variant = node.attrs?.variant
        if (
          variant === "info" ||
          variant === "tip" ||
          variant === "warning" ||
          variant === "danger"
        ) {
          const title = stringAttr(node.attrs?.title)
          blocks.push({
            type: "callout",
            variant,
            ...(title ? { title } : {}),
            text,
            ...(content ? { content } : {}),
          })
        }
        break
      }
      case "accordion": {
        const { text, content } = blockOf(richOf(node.content))
        const title = stringAttr(node.attrs?.title)
        if (title) {
          blocks.push({
            type: "accordion",
            title,
            text,
            ...(content ? { content } : {}),
          })
        }
        break
      }
      case "ctaButton": {
        const label = stringAttr(node.attrs?.label)
        const href = stringAttr(node.attrs?.href)
        const variant = node.attrs?.variant === "outline" ? "outline" : "primary"
        if (label && href) {
          blocks.push({ type: "button", label, href, variant })
        }
        break
      }
      case "embed": {
        const url = stringAttr(node.attrs?.url)
        if (url) {
          const caption = stringAttr(node.attrs?.caption)
          blocks.push({ type: "embed", url, ...(caption ? { caption } : {}) })
        }
        break
      }
      case "codeBlock":
        blocks.push({
          type: "code",
          text: textOf(node),
          language: node.attrs?.language ?? undefined,
        })
        break
      case "bulletList":
      case "orderedList": {
        const items = (node.content ?? [])
          .map((listItem) => richOf(listItem.content))
          .filter((item) => (typeof item === "string" ? item.length > 0 : true))
        if (items.length > 0) {
          blocks.push({
            type: "list",
            items,
            ordered: node.type === "orderedList",
          })
        }
        break
      }
      case "htmlBlock":
        blocks.push({ type: "html", html: node.attrs?.html ?? "" })
        break
      case "image":
        if (node.attrs?.src) {
          blocks.push({
            type: "image",
            url: node.attrs.src,
            alt: node.attrs.alt ?? undefined,
          })
        }
        break
      case "table": {
        const rows = (node.content ?? []).map((row) => row.content ?? [])
        const hasHeader =
          rows.length > 0 &&
          (rows[0]?.[0]?.type ?? "tableCell") === "tableHeader"
        blocks.push({
          type: "table",
          rows: rows.map((row) => row.map((cell) => richOf(cell.content))),
          header: hasHeader,
        })
        break
      }
      case "horizontalRule":
        blocks.push({ type: "hr" })
        break
      default:
        break
    }
  }

  return blocks
}
