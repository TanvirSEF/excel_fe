import type { JSONContent } from "@tiptap/react"

import type { Block } from "@/types/api"

function textOf(node: JSONContent | undefined): string {
  if (!node) return ""
  if (node.type === "text") return node.text ?? ""
  if (node.content) return node.content.map(textOf).join("")
  return ""
}

function textNode(text: string): JSONContent | undefined {
  return text ? { type: "text", text } : undefined
}

function withText(node: Omit<JSONContent, "content">, text: string): JSONContent {
  const content = textNode(text)
  return content ? { ...node, content: [content] } : { ...node }
}

function paragraph(text: string): JSONContent {
  return withText({ type: "paragraph" }, text)
}

function clampLevel(level: number): number {
  if (level <= 2) return 2
  if (level >= 4) return 4
  return level
}

export function blocksToDoc(blocks: Block[]): JSONContent {
  return {
    type: "doc",
    content: blocks.map((block): JSONContent => {
      switch (block.type) {
        case "paragraph":
          return paragraph(block.text)
        case "heading":
          return withText(
            { type: "heading", attrs: { level: clampLevel(block.level) } },
            block.text
          )
        case "quote":
          return {
            type: "blockquote",
            content: [paragraph(block.text)],
          }
        case "code":
          return withText(
            { type: "codeBlock", attrs: { language: block.language ?? "plaintext" } },
            block.text
          )
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
      case "paragraph":
        blocks.push({ type: "paragraph", text: textOf(node) })
        break
      case "heading":
        blocks.push({
          type: "heading",
          text: textOf(node),
          level: clampLevel(Number(node.attrs?.level ?? 2)),
        })
        break
      case "blockquote": {
        const text = textOf(node)
        if (text) blocks.push({ type: "quote", text })
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
          .map((listItem) =>
            textOf({ type: "doc", content: listItem.content ?? [] })
          )
          .filter((item) => item.length > 0)
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
        const rows = (node.content ?? []).map(
          (row) => row.content ?? []
        )
        const hasHeader =
          rows.length > 0 &&
          (rows[0]?.[0]?.type ?? "tableCell") === "tableHeader"
        blocks.push({
          type: "table",
          rows: rows.map((row) =>
            row.map((cell) =>
              textOf({ type: "doc", content: cell.content ?? [] })
            )
          ),
          header: hasHeader,
        })
        break
      }
      default:
        break
    }
  }

  return blocks
}
