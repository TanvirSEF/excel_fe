import { codeToHtml } from "shiki"

import { cn } from "@/lib/utils"

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
    <figure className={cn("overflow-hidden rounded-lg border", className)}>
      {requested ? (
        <figcaption className="border-b bg-muted/50 px-4 py-1.5 font-mono text-xs text-muted-foreground">
          {requested}
        </figcaption>
      ) : null}
      <div
        className="[&_pre]:overflow-x-auto [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-[0.825rem] [&_pre]:leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </figure>
  )
}
