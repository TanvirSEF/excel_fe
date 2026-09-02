import type { Block, RichText } from "@/types/api"

const SAFE_HREF = /^(https?:\/\/|mailto:|\/|#)/i

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function richToHtml(rich: RichText | undefined): string {
  if (!rich) return ""
  if (typeof rich === "string") return escapeHtml(rich)
  return rich
    .map((run) => {
      const text = escapeHtml(run.text)
      const link = (run.marks ?? []).find((mark) => mark.type === "link")
      if (link?.href && SAFE_HREF.test(link.href)) {
        return `<a href="${escapeHtml(link.href)}">${text}</a>`
      }
      return text
    })
    .join("")
}

function blockToHtml(block: Block): string {
  switch (block.type) {
    case "paragraph":
      return `<p>${richToHtml(block.content ?? block.text)}</p>`

    case "heading": {
      const level = Math.min(Math.max(block.level, 2), 4)
      const inner = richToHtml(block.content ?? block.text)
      return `<h${level}>${inner}</h${level}>`
    }

    case "quote":
      return `<blockquote>${richToHtml(block.content ?? block.text)}</blockquote>`

    case "code":
      return `<pre><code>${escapeHtml(block.text)}</code></pre>`

    case "list": {
      const tag = block.ordered ? "ol" : "ul"
      const items = block.items.map((item) => `<li>${richToHtml(item)}</li>`)
      return `<${tag}>${items.join("")}</${tag}>`
    }

    case "html":
      return block.html

    case "image":
      return `<img src="${escapeHtml(block.url)}" alt="${escapeHtml(block.alt ?? "")}">`

    case "table": {
      const [headerRow, ...bodyRows] = block.rows
      const cell = (value: RichText) => `<td>${richToHtml(value)}</td>`
      const head = block.header
        ? `<thead><tr>${headerRow
            .map((value) => `<th>${richToHtml(value)}</th>`)
            .join("")}</tr></thead>`
        : ""
      const body = `<tbody>${(block.header ? bodyRows : block.rows)
        .map((row) => `<tr>${row.map(cell).join("")}</tr>`)
        .join("")}</tbody>`
      return `<table>${head}${body}</table>`
    }

    case "callout":
      return `<div><p><strong>${escapeHtml(block.title ?? "")}</strong></p><p>${richToHtml(
        block.content ?? block.text
      )}</p></div>`

    case "button":
      return `<p><a href="${escapeHtml(block.href)}">${escapeHtml(block.label)}</a></p>`

    case "embed":
      return `<iframe src="${escapeHtml(block.url)}"></iframe>`

    case "accordion":
      return `<details><summary>${escapeHtml(block.title)}</summary>${richToHtml(
        block.content ?? block.text
      )}</details>`

    case "hr":
      return "<hr>"

    default:
      return ""
  }
}

export function blocksToHtml(blocks: Block[]): string {
  return blocks.map(blockToHtml).join("\n")
}

export function extractImages(blocks: Block[]): { src: string; alt?: string }[] {
  return blocks
    .filter((block): block is Extract<Block, { type: "image" }> => block.type === "image")
    .map((block) => ({ src: block.url, alt: block.alt ?? "" }))
}
