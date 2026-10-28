import { Fragment } from "react"

import { isTakeawayCallout, type ImageBlock, type TocEntry } from "@/lib/blocks"
import {
  isFaqSectionHeading,
  parseFaqSection,
  type FaqSectionGroup,
} from "@/lib/faq-blocks"
import { cn } from "@/lib/utils"
import type { Block } from "@/types/api"

import { BlockNode } from "./block-node"
import { InlineToc } from "./inline-toc"

interface BlockRendererProps {
  blocks: Block[]
  className?: string
  toc?: TocEntry[]
  tocDefaultCollapsed?: boolean
  hideInlineTocOnDesktop?: boolean
}

export function BlockRenderer({
  blocks,
  className,
  toc,
  tocDefaultCollapsed = true,
  hideInlineTocOnDesktop = false,
}: BlockRendererProps) {
  const usedIds = new Set<string>()
  const hasToc = Boolean(toc && toc.length >= 2)

  const takeawayIndex = blocks.findIndex(isTakeawayCallout)

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

  // Pre-identify FAQ section range if present
  const faqStartIndex = blocks.findIndex(isFaqSectionHeading)
  const faqBlockIndices = new Set<number>()
  let faqGroup: FaqSectionGroup | null = null

  if (faqStartIndex !== -1) {
    let end = faqStartIndex + 1
    while (end < blocks.length) {
      const b = blocks[end]
      if (b.type === "heading" && b.level === 2) {
        break
      }
      if (b.type === "hr" && end + 1 < blocks.length) {
        const nextB = blocks[end + 1]
        if (nextB.type === "heading" && nextB.level === 2) {
          break
        }
      }
      end++
    }
    faqGroup = parseFaqSection(blocks.slice(faqStartIndex, end))
    for (let idx = faqStartIndex; idx < end; idx++) {
      faqBlockIndices.add(idx)
    }
  }

  return (
    <div
      className={cn(
        "entry-content post-content elementor-widget-theme-post-content space-y-3.5 sm:space-y-4",
        className
      )}
    >
      {hasToc && takeawayIndex === -1 && toc ? (
        <InlineToc
          entries={toc}
          defaultCollapsed={tocDefaultCollapsed}
          className={hideInlineTocOnDesktop ? "xl:hidden" : undefined}
        />
      ) : null}

      {blocks.map((block, index) => {
        if (takeawayImageIndices.has(index)) {
          return null
        }

        if (
          block.type === "hr" &&
          index > 0 &&
          blocks[index - 1]?.type === "hr"
        ) {
          return null
        }

        if (faqBlockIndices.has(index)) {
          if (index !== faqStartIndex || !faqGroup) {
            return null
          }

          const showFaqDivider =
            faqStartIndex > 0 && blocks[faqStartIndex - 1]?.type !== "hr"

          return (
            <Fragment key="faq-section-container">
              {showFaqDivider ? (
                <hr className="my-8 border-0 border-t border-border sm:my-10 dark:border-white/15" />
              ) : null}
              <div
                id="faq-section"
                className="faq-block faq-section my-6 space-y-4 sm:my-8"
              >
                <BlockNode block={faqGroup.heading} usedIds={usedIds} />
                {faqGroup.introBlocks.map((b, i) => (
                  <BlockNode
                    key={`faq-intro-${i}`}
                    block={b}
                    usedIds={usedIds}
                  />
                ))}
                {faqGroup.items.map((item, itemIdx) => (
                  <div
                    key={`faq-item-${itemIdx}`}
                    className="faq-item space-y-2"
                  >
                    <BlockNode
                      block={item.question}
                      usedIds={usedIds}
                      isFaqQuestion
                    />
                    {item.answers.map((ans, ansIdx) => (
                      <BlockNode
                        key={`faq-ans-${ansIdx}`}
                        block={ans}
                        usedIds={usedIds}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </Fragment>
          )
        }

        const isTakeaway = index === takeawayIndex
        const isH2WithoutHr =
          block.type === "heading" &&
          block.level === 2 &&
          index > 0 &&
          blocks[index - 1]?.type !== "hr"

        return (
          <Fragment key={index}>
            {isH2WithoutHr ? (
              <hr className="my-8 border-0 border-t border-border sm:my-10 dark:border-white/15" />
            ) : null}
            <BlockNode
              block={block}
              usedIds={usedIds}
              takeawayImages={isTakeaway ? takeawayImages : undefined}
            />
            {hasToc && isTakeaway && toc ? (
              <InlineToc
                entries={toc}
                defaultCollapsed={tocDefaultCollapsed}
                className={hideInlineTocOnDesktop ? "xl:hidden" : undefined}
              />
            ) : null}
          </Fragment>
        )
      })}
    </div>
  )
}
