import { codeToHtml } from "shiki"

import { cn } from "@/lib/utils"
import { CopyButton } from "./copy-button"

interface CodeBlockProps {
  code: string
  language?: string
  className?: string
}

function resolveLanguage(
  langInput?: string,
  codeSnippet?: string
): {
  shikiLang: string
  displayLabel: string
} {
  const req = langInput?.toLowerCase().trim()

  // Replace default/erroneous javascript with VBA on Excel tutorials
  if (
    !req ||
    req === "javascript" ||
    req === "js" ||
    req === "vba" ||
    req === "vb"
  ) {
    return { shikiLang: "vb", displayLabel: "VBA Code" }
  }

  if (req === "excel" || req === "formula" || req === "xls") {
    return { shikiLang: "text", displayLabel: "Excel Formula" }
  }

  if (req === "python" || req === "py") {
    return { shikiLang: "python", displayLabel: "Python" }
  }

  if (req === "sql") {
    return { shikiLang: "sql", displayLabel: "SQL" }
  }

  if (req === "dax") {
    return { shikiLang: "sql", displayLabel: "DAX" }
  }

  if (req === "m" || req === "powerquery") {
    return { shikiLang: "text", displayLabel: "Power Query" }
  }

  if (req === "html" || req === "xml") {
    return { shikiLang: "html", displayLabel: req.toUpperCase() }
  }

  if (req === "json") {
    return { shikiLang: "json", displayLabel: "JSON" }
  }

  if (req === "css") {
    return { shikiLang: "css", displayLabel: "CSS" }
  }

  // If marked plaintext or generic, check if code contains VBA keywords
  if (
    codeSnippet &&
    /\b(Sub|Function|Dim|Range|MsgBox|End Sub|End If|Next|Worksheet|Workbook|Cells|ActiveSheet)\b/i.test(
      codeSnippet
    )
  ) {
    return { shikiLang: "vb", displayLabel: "VBA Code" }
  }

  return { shikiLang: req, displayLabel: req.toUpperCase() }
}

export async function CodeBlock({
  code,
  language,
  className,
}: CodeBlockProps) {
  const { shikiLang, displayLabel } = resolveLanguage(language, code)

  let html: string
  try {
    html = await codeToHtml(code, {
      lang: shikiLang,
      theme: "github-dark-default",
    })
  } catch {
    html = await codeToHtml(code, {
      lang: "text",
      theme: "github-dark-default",
    })
  }

  return (
    <figure
      className={cn(
        "group relative my-6 overflow-hidden rounded-xl border border-[#30363d] bg-[#0d1117] shadow-lg",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-[#30363d] bg-[#161b22] px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
          </div>
          <span className="ml-1 font-mono text-xs font-semibold tracking-wide text-zinc-300">
            {displayLabel}
          </span>
        </div>
        <CopyButton
          text={code}
          className="border-[#30363d] bg-[#21262d] text-zinc-300 hover:border-[#484f58] hover:bg-[#30363d] hover:text-white shadow-none"
        />
      </div>
      <div
        className="overflow-x-auto p-4 font-mono text-[0.875rem] leading-relaxed text-[#e6edf3] [&_pre]:!bg-transparent [&_pre]:!p-0 [&_code]:!font-mono [&_code]:!text-[0.875rem]"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </figure>
  )
}
