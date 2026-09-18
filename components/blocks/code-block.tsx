import { codeToHtml } from "shiki"

import { cn } from "@/lib/utils"
import { CopyButton } from "./copy-button"

const LANG_ALIASES: Record<string, string> = {
  excel: "text",
  formula: "text",
  xls: "text",
}

const THEMES = { light: "github-light", dark: "github-dark" } as const

interface CodeBlockProps {
  code: string
  language?: string
  className?: string
}

export async function CodeBlock({
  code,
  language,
  className,
}: CodeBlockProps) {
  const requested = language?.toLowerCase().trim()
  const lang = requested ? (LANG_ALIASES[requested] ?? requested) : "text"

  let html: string
  try {
    html = await codeToHtml(code, { lang, themes: THEMES })
  } catch {
    html = await codeToHtml(code, { lang: "text", themes: THEMES })
  }

  return (
    <figure className={cn("group relative my-6 overflow-hidden rounded-xl border border-border/80 bg-card shadow-2xs", className)}>
      <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-2">
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {requested || "code"}
        </span>
        <CopyButton text={code} />
      </div>
      <div
        className="[&_pre]:overflow-x-auto [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-[0.825rem] [&_pre]:leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </figure>
  )
}
