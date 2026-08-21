import slugify from "slugify"

import type { Block } from "@/types/api"

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
