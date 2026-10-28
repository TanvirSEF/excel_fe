import type { Block } from "@/types/api"

const FAQ_HEADING_REGEX = /^\s*(frequently\s+asked\s+questions?|faqs?)\b/i

export function isFaqSectionHeading(block: Block): boolean {
  return (
    block.type === "heading" &&
    block.level === 2 &&
    FAQ_HEADING_REGEX.test(block.text.trim())
  )
}

interface FaqItem {
  question: Block
  answers: Block[]
}

export interface FaqSectionGroup {
  heading: Block
  introBlocks: Block[]
  items: FaqItem[]
}

export function parseFaqSection(faqBlocks: Block[]): FaqSectionGroup {
  const heading = faqBlocks[0]
  const content = faqBlocks.slice(1)
  const introBlocks: Block[] = []
  const items: FaqItem[] = []
  let currentItem: FaqItem | null = null

  for (const b of content) {
    if (b.type === "hr") {
      continue
    }
    if (b.type === "heading" && b.level >= 3) {
      if (currentItem) {
        items.push(currentItem)
      }
      currentItem = { question: b, answers: [] }
    } else if (currentItem) {
      currentItem.answers.push(b)
    } else {
      introBlocks.push(b)
    }
  }

  if (currentItem) {
    items.push(currentItem)
  }

  return { heading, introBlocks, items }
}
