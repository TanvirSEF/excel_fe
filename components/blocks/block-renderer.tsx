import Image from "next/image"

import { clampHeadingLevel, headingId } from "@/lib/blocks"
import { cn } from "@/lib/utils"
import type { Block } from "@/types/api"

import { CodeBlock } from "./code-block"

interface BlockRendererProps {
  blocks: Block[]
  className?: string
}

const HEADING_CLASSES: Record<2 | 3 | 4, string> = {
  2: "mt-2 text-2xl font-bold tracking-tight sm:text-[1.7rem]",
  3: "mt-1.5 text-xl font-semibold tracking-tight",
  4: "mt-1 text-lg font-semibold tracking-tight",
}

function BlockNode({ block, usedIds }: { block: Block; usedIds: Set<string> }) {
  switch (block.type) {
    case "paragraph":
      return (
        <p className="text-[0.975rem] leading-7 text-foreground/90 sm:text-base">
          {block.text}
        </p>
      )

    case "heading": {
      const level = clampHeadingLevel(block.level)
      const id = headingId(block.text, usedIds)
      const Tag = `h${level}` as "h2" | "h3" | "h4"
      return (
        <Tag id={id} className={cn("scroll-mt-20", HEADING_CLASSES[level])}>
          {block.text}
        </Tag>
      )
    }

    case "quote":
      return (
        <blockquote className="border-l-2 border-primary pl-4 text-[1.05rem] italic leading-7 text-muted-foreground">
          {block.text}
        </blockquote>
      )

    case "code":
      return <CodeBlock code={block.text} language={block.language} />

    case "list": {
      const ListTag = block.ordered ? "ol" : "ul"
      return (
        <ListTag
          className={cn(
            "space-y-1.5 pl-6 text-[0.975rem] leading-7 sm:text-base",
            block.ordered ? "list-decimal" : "list-disc marker:text-primary"
          )}
        >
          {block.items.map((item, index) => (
            <li key={index}>{item}</li>
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

    case "image":
      return (
        <figure>
          <Image
            src={block.url}
            alt={block.alt ?? ""}
            width={1200}
            height={675}
            sizes="(max-width: 768px) 100vw, 768px"
            className="h-auto w-full rounded-xl border"
          />
          {block.alt ? (
            <figcaption className="mt-2 text-center text-xs text-muted-foreground">
              {block.alt}
            </figcaption>
          ) : null}
        </figure>
      )

    case "table": {
      const [headerRow, ...bodyRows] = block.rows
      return (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full border-collapse text-sm">
            {block.header ? (
              <thead className="bg-muted/60">
                <tr>
                  {headerRow.map((cell, index) => (
                    <th
                      key={index}
                      className="border-b px-3 py-2 text-left font-semibold"
                    >
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
            ) : null}
            <tbody>
              {(block.header ? bodyRows : block.rows).map((row, rowIndex) => (
                <tr key={rowIndex} className="odd:bg-muted/20 hover:bg-muted/40">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-3 py-2 align-top">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }

    default:
      return null
  }
}

export function BlockRenderer({ blocks, className }: BlockRendererProps) {
  const usedIds = new Set<string>()

  return (
    <div className={cn("space-y-6", className)}>
      {blocks.map((block, index) => (
        <BlockNode key={index} block={block} usedIds={usedIds} />
      ))}
    </div>
  )
}
