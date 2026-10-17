import slugify from "slugify"

import type { Block, InlineText } from "@/types/api"

export interface TocEntry {
  id: string
  text: string
  level: 2 | 3 | 4
}

export function clampHeadingLevel(level: number): 2 | 3 | 4 {
  if (level <= 2) return 2
  if (level >= 4) return 4
  return 3
}

export function headingId(text: string, used: Set<string>): string {
  const base =
    slugify(text, { lower: true, strict: true, trim: true }) || "section"
  let id = base
  let counter = 2
  while (used.has(id)) {
    id = `${base}-${counter}`
    counter += 1
  }
  used.add(id)
  return id
}

export function extractToc(blocks: Block[]): TocEntry[] {
  const used = new Set<string>()
  const entries: TocEntry[] = []
  for (const block of blocks) {
    if (block.type === "heading") {
      entries.push({
        id: headingId(block.text, used),
        text: block.text,
        level: clampHeadingLevel(block.level),
      })
    }
  }
  return entries
}

const R2_DEV_HOST = "pub-b39c974f4c124a36a2fb517be38076ec.r2.dev"
const MEDIA_CDN_HOST = "media.excelinsider.com"

export function toCdnUrl(url: string | null | undefined): string {
  if (!url) return ""
  return url.replace(R2_DEV_HOST, MEDIA_CDN_HOST)
}

export function getFeaturedImageFromBlocks(blocks: Block[]): string | null {
  for (const block of blocks) {
    if (block.type === "image" && block.url) {
      return toCdnUrl(block.url)
    }
  }
  return null
}

const FORMULA_START_REGEX = /^\s*=[A-Z_]{2,}\s*\(/i

export const DOWNLOAD_REGEX = /\.(xlsx?|xlsm|xltx?|csv|zip|rar|pdf|7z)(\?.*)?$/i

export function isDownloadHref(href: string, text?: string): boolean {
  if (DOWNLOAD_REGEX.test(href)) return true
  if (href.includes("/downloads/") || href.includes("/api/v1/assets/")) return true
  if (text) {
    const trimmed = text.trim()
    if (DOWNLOAD_REGEX.test(trimmed) || /\bdownload\b/i.test(trimmed)) return true
  }
  return false
}

export function isDownloadBlock(block: Block): boolean {
  if (block.type === "button" && isDownloadHref(block.href, block.label)) {
    return true
  }
  if (block.type === "paragraph" && Array.isArray(block.content)) {
    const meaningfulRuns = block.content.filter(
      (r) => r.text && r.text.trim().length > 0
    )
    if (meaningfulRuns.length === 1) {
      const run = meaningfulRuns[0]
      const linkMark = run.marks?.find((m) => m.type === "link")
      if (linkMark?.href && isDownloadHref(linkMark.href, run.text)) {
        return true
      }
    }
  }
  return false
}

export function normalizePostBlocks(blocks: Block[]): Block[] {
  const result: Block[] = []
  let i = 0

  while (i < blocks.length) {
    const block = blocks[i]

    if (block.type === "image") {
      result.push({
        ...block,
        url: toCdnUrl(block.url),
      })
      i++
      continue
    }

    // 1. Detect standalone Key Takeaways section from legacy imports
    if (
      block.type === "paragraph" &&
      /^\s*key\s+takeaways\s*$/i.test(block.text?.trim() ?? "")
    ) {
      let combinedText = ""
      const combinedRuns: InlineText[] = []
      let j = i + 1

      while (j < blocks.length) {
        const nextBlock = blocks[j]
        if (nextBlock.type !== "paragraph") break
        const text = nextBlock.text?.trim() ?? ""
        if (
          /^\s*(explanation|\d+|steps?:?)\s*$/i.test(text) ||
          FORMULA_START_REGEX.test(text)
        ) {
          break
        }
        if (combinedText) combinedText += "\n\n"
        combinedText += nextBlock.text
        if (nextBlock.content) {
          combinedRuns.push(...nextBlock.content)
        }
        j++
      }

      result.push({
        type: "callout",
        variant: "tip",
        title: "Key Takeaways",
        text: combinedText,
        content: combinedRuns.length > 0 ? combinedRuns : undefined,
      })

      i = j
      continue
    }

    // 2. Detect step / method numbers before headings: e.g. "1" followed by H2
    if (
      block.type === "paragraph" &&
      /^\s*(\d+|step\s*\d+|method\s*\d+)\s*$/i.test(block.text?.trim() ?? "") &&
      i + 1 < blocks.length &&
      blocks[i + 1].type === "heading"
    ) {
      const match = block.text.trim().match(/(\d+)/)
      const num = match ? match[1] : block.text.trim()
      const nextHeading = blocks[i + 1]
      if (nextHeading.type === "heading") {
        result.push({
          ...nextHeading,
          num,
        })
      }
      i += 2
      continue
    }

    // 3. Detect standalone Excel formula paragraphs
    if (
      block.type === "paragraph" &&
      FORMULA_START_REGEX.test(block.text?.trim() ?? "")
    ) {
      result.push({
        type: "callout",
        variant: "info",
        title: "Formula Box",
        text: block.text.trim(),
      })
      i++
      continue
    }

    // 4. Detect "Explanation" title followed by explanation content
    if (
      block.type === "paragraph" &&
      /^\s*explanation:?\s*$/i.test(block.text?.trim() ?? "") &&
      i + 1 < blocks.length &&
      blocks[i + 1].type === "paragraph"
    ) {
      const explP = blocks[i + 1]
      if (explP.type === "paragraph") {
        result.push({
          type: "callout",
          variant: "info",
          title: "Explanation",
          text: explP.text.trim(),
          content: explP.content,
        })
      }
      i += 2
      continue
    }

    // 5. Detect paragraphs starting with Note:, Important:, Warning:, Caution:, Tip:, Pro Tip:
    if (block.type === "paragraph") {
      const text = block.text?.trim() ?? ""
      const noteMatch = text.match(
        /^(note|important|warning|caution|tip|pro\s+tip):?(\s*[\r\n]+|\s+)([\s\S]*)$/i
      )
      if (noteMatch) {
        const rawKeyword = noteMatch[1].toLowerCase().replace(/\s+/g, " ")
        const isWarning =
          rawKeyword === "warning" ||
          rawKeyword === "caution" ||
          rawKeyword === "important"
        const isTip = rawKeyword === "tip" || rawKeyword === "pro tip"
        const title =
          rawKeyword === "pro tip"
            ? "Pro Tip"
            : rawKeyword.charAt(0).toUpperCase() + rawKeyword.slice(1)

        result.push({
          type: "callout",
          variant: isWarning ? "warning" : isTip ? "tip" : "info",
          title,
          text: block.text,
          content: block.content,
        })
        i++
        continue
      }
    }

    result.push(block)
    i++
  }

  // 6. Reposition practice workbook download block to right before FAQ / Conclusion
  const downloadIndices: number[] = []
  for (let idx = 0; idx < result.length; idx++) {
    if (isDownloadBlock(result[idx])) {
      downloadIndices.push(idx)
    }
  }

  if (downloadIndices.length > 0) {
    const faqIndex = result.findIndex(
      (b) =>
        b.type === "heading" &&
        /^\s*(faq|frequently\s+asked\s+questions)\b/i.test(b.text?.trim() ?? "")
    )
    const conclusionIndex = result.findIndex(
      (b) =>
        b.type === "heading" &&
        /^\s*(wrapping\s+up|conclusion|final\s+words|final\s+thoughts|summary)\b/i.test(
          b.text?.trim() ?? ""
        )
    )

    let targetIndex =
      faqIndex !== -1
        ? faqIndex
        : conclusionIndex !== -1
          ? conclusionIndex
          : -1

    if (targetIndex !== -1) {
      // If an <hr> immediately precedes the target heading, place download card before <hr>
      if (targetIndex > 0 && result[targetIndex - 1].type === "hr") {
        targetIndex = targetIndex - 1
      }

      const blocksToMove: Block[] = []
      for (let k = downloadIndices.length - 1; k >= 0; k--) {
        const dIdx = downloadIndices[k]
        if (dIdx < targetIndex) {
          blocksToMove.unshift(result[dIdx])
          result.splice(dIdx, 1)
          targetIndex--
        }
      }

      if (blocksToMove.length > 0) {
        result.splice(targetIndex, 0, ...blocksToMove)
      }
    }
  }

  return result
}
