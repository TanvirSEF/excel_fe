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

export function getFeaturedImageFromBlocks(blocks: Block[]): string | null {
  for (const block of blocks) {
    if (block.type === "image" && block.url) {
      return block.url
    }
  }
  return null
}

const FORMULA_START_REGEX = /^\s*=[A-Z_]{2,}\s*\(/i

export function normalizePostBlocks(blocks: Block[]): Block[] {
  const result: Block[] = []
  let i = 0

  while (i < blocks.length) {
    const block = blocks[i]

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

  return result
}
