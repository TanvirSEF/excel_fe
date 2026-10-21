"use client"

import { useState } from "react"
import Link from "next/link"
import { IconCheck, IconCopy } from "@tabler/icons-react"

interface MessageRendererProps {
  content: string
}

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="my-2.5 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-100 shadow-sm">
      <div className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-900/70 px-3.5 py-1.5 text-[11px] font-mono text-zinc-400">
        <span className="uppercase tracking-wider">{language || "formula"}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 hover:bg-zinc-800 hover:text-zinc-200 transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <IconCheck className="h-3 w-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <IconCopy className="h-3 w-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-3 text-xs font-mono leading-relaxed select-all">
        <code>{code}</code>
      </pre>
    </div>
  )
}

function renderInlineText(text: string) {
  // Matches inline code `...`, links [text](url), and bold **...**
  const regex = /(`[^`]+`|\[[^\]]+\]\([^\)]+\)|\*\*[^*]+\*\*)/g
  const parts = text.split(regex)

  return parts.map((part, index) => {
    if (!part) return null

    // Inline code
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      const code = part.slice(1, -1)
      return (
        <code
          key={index}
          className="rounded-md border border-primary/20 bg-primary/10 px-1.5 py-0.5 font-mono text-xs font-semibold text-primary"
        >
          {code}
        </code>
      )
    }

    // Markdown link
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (linkMatch) {
      const [, label, href] = linkMatch
      const isExternal = href.startsWith("http")
      return (
        <Link
          key={index}
          href={href}
          prefetch={false}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="font-semibold text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary transition-colors"
        >
          {label}
        </Link>
      )
    }

    // Bold text
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      const bold = part.slice(2, -2)
      return (
        <strong key={index} className="font-bold text-foreground">
          {bold}
        </strong>
      )
    }

    return <span key={index}>{part}</span>
  })
}

export function MessageRenderer({ content }: MessageRendererProps) {
  // Split into code block chunks vs text chunks
  const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g
  const elements: React.ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = codeBlockRegex.exec(content)) !== null) {
    const textBefore = content.substring(lastIndex, match.index)
    if (textBefore) {
      elements.push(
        <div key={`text-${lastIndex}`} className="space-y-1.5 leading-relaxed text-foreground/90">
          {textBefore.split("\n").map((line, lineIdx) => {
            const trimmed = line.trim()
            if (!trimmed) return <div key={lineIdx} className="h-1.5" />

            // Heading
            if (trimmed.startsWith("### ")) {
              return (
                <h4 key={lineIdx} className="pt-1 font-bold text-sm text-foreground">
                  {renderInlineText(trimmed.replace(/^###\s+/, ""))}
                </h4>
              )
            }
            if (trimmed.startsWith("## ")) {
              return (
                <h3 key={lineIdx} className="pt-1.5 font-bold text-base text-foreground">
                  {renderInlineText(trimmed.replace(/^##\s+/, ""))}
                </h3>
              )
            }

            // Bullet list item
            if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
              return (
                <div key={lineIdx} className="flex items-start gap-2 pl-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{renderInlineText(trimmed.replace(/^[-*]\s+/, ""))}</span>
                </div>
              )
            }

            return <p key={lineIdx}>{renderInlineText(line)}</p>
          })}
        </div>
      )
    }

    const language = match[1] || "excel"
    const code = match[2]
    elements.push(
      <CodeBlock key={`code-${match.index}`} language={language} code={code} />
    )

    lastIndex = match.index + match[0].length
  }

  // Trailing text
  const remainingText = content.substring(lastIndex)
  if (remainingText) {
    elements.push(
      <div key={`text-${lastIndex}`} className="space-y-1.5 leading-relaxed text-foreground/90">
        {remainingText.split("\n").map((line, lineIdx) => {
          const trimmed = line.trim()
          if (!trimmed) return <div key={lineIdx} className="h-1.5" />

          if (trimmed.startsWith("### ")) {
            return (
              <h4 key={lineIdx} className="pt-1 font-bold text-sm text-foreground">
                {renderInlineText(trimmed.replace(/^###\s+/, ""))}
              </h4>
            )
          }
          if (trimmed.startsWith("## ")) {
            return (
              <h3 key={lineIdx} className="pt-1.5 font-bold text-base text-foreground">
                {renderInlineText(trimmed.replace(/^##\s+/, ""))}
              </h3>
            )
          }

          if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
            return (
              <div key={lineIdx} className="flex items-start gap-2 pl-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>{renderInlineText(trimmed.replace(/^[-*]\s+/, ""))}</span>
              </div>
            )
          }

          return <p key={lineIdx}>{renderInlineText(line)}</p>
        })}
      </div>
    )
  }

  return <div className="space-y-2 text-xs sm:text-sm">{elements}</div>
}
