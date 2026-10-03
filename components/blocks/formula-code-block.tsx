import { useId } from "react"

import { cn } from "@/lib/utils"
import { CopyButton } from "./copy-button"

interface FormulaCodeBlockProps {
  formula: string
  className?: string
}

type TokenType =
  | "string"
  | "function"
  | "cell"
  | "number"
  | "boolean"
  | "operator"
  | "paren"
  | "space"
  | "text"

interface Token {
  text: string
  type: TokenType
}

const TOKEN_REGEX =
  /("[^"]*")|(\b[A-Z_][A-Z0-9_.]*(?=\s*\())|((?:'[^']+'!|[A-Za-z0-9_]+!)?\$?[A-Z]+\$?[0-9]*(?::\$?[A-Z]+\$?[0-9]*)?\b)|(\b\d+(?:\.\d+)?\b)|(\b(?:TRUE|FALSE)\b)|([=+\-*/^&%<>:]+)|([(),;])|(\s+)|([^"A-Za-z0-9_\s(),;=+\-*/^&%<>:]+)/gi

function tokenizeFormula(code: string): Token[] {
  const tokens: Token[] = []
  TOKEN_REGEX.lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = TOKEN_REGEX.exec(code)) !== null) {
    const [raw, str, fn, cell, num, bool, op, paren, space] = match
    let type: TokenType = "text"
    if (str) type = "string"
    else if (fn) type = "function"
    else if (cell) type = "cell"
    else if (num) type = "number"
    else if (bool) type = "boolean"
    else if (op) type = "operator"
    else if (paren) type = "paren"
    else if (space) type = "space"

    tokens.push({ text: raw, type })
  }

  if (tokens.length === 0 && code) {
    tokens.push({ text: code, type: "text" })
  }

  return tokens
}

const TOKEN_CLASSES: Record<TokenType, string> = {
  function: "text-emerald-400 font-bold",
  cell: "text-sky-300 font-medium",
  string: "text-amber-300",
  number: "text-orange-300 font-medium",
  boolean: "text-purple-300 font-semibold",
  operator: "text-teal-300 font-bold",
  paren: "text-zinc-400 font-medium",
  space: "",
  text: "text-[#e6edf3]",
}

export function FormulaCodeBlock({ formula, className }: FormulaCodeBlockProps) {
  const baseId = useId()
  const cleanCode = formula.trim()
  const isMultiLine = cleanCode.includes("\n")
  const tokens = tokenizeFormula(cleanCode)

  const renderedTokens = (
    <>
      {tokens.map((token, i) => (
        <span
          key={`${baseId}-${i}`}
          className={TOKEN_CLASSES[token.type] || TOKEN_CLASSES.text}
        >
          {token.text}
        </span>
      ))}
    </>
  )

  if (isMultiLine) {
    return (
      <figure
        className={cn(
          "group relative my-6 overflow-hidden rounded-xl border border-[#30363d] bg-[#0d1117] shadow-lg transition-all hover:border-[#484f58]",
          className
        )}
      >
        <div className="flex items-center justify-between border-b border-[#30363d] bg-[#161b22] px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-6 shrink-0 items-center justify-center rounded bg-emerald-500/15 font-mono text-[11px] font-extrabold italic text-emerald-400 select-none ring-1 ring-emerald-500/30">
              fx
            </span>
            <span className="font-mono text-xs font-semibold tracking-wide text-zinc-300">
              Excel Formula
            </span>
          </div>
          <CopyButton
            text={cleanCode}
            className="border-[#30363d] bg-[#21262d] text-zinc-300 hover:border-[#484f58] hover:bg-[#30363d] hover:text-white shadow-none text-xs"
          />
        </div>
        <div className="p-4 font-mono text-[14px] sm:text-[15px] leading-relaxed text-[#e6edf3] select-all whitespace-pre-wrap break-words [word-break:break-word]">
          <code>{renderedTokens}</code>
        </div>
      </figure>
    )
  }

  return (
    <div
      className={cn(
        "group relative my-5 flex items-start justify-between gap-3 overflow-hidden rounded-xl border border-[#30363d] bg-[#0d1117] px-3.5 py-2.5 sm:px-4 sm:py-3 shadow-md transition-all hover:border-[#484f58]",
        className
      )}
    >
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <span className="mt-0.5 flex h-7 w-8 shrink-0 items-center justify-center rounded-md bg-emerald-500/15 font-mono text-xs font-extrabold italic text-emerald-400 select-none ring-1 ring-emerald-500/30">
          fx
        </span>
        <div className="min-w-0 flex-1 py-0.5">
          <code className="block font-mono text-[14px] sm:text-[15.5px] font-normal leading-relaxed text-[#e6edf3] whitespace-pre-wrap break-words [word-break:break-word] select-all">
            {renderedTokens}
          </code>
        </div>
      </div>

      <div className="shrink-0 self-start pl-1">
        <CopyButton
          text={cleanCode}
          className="border-[#30363d] bg-[#21262d] text-zinc-300 hover:border-[#484f58] hover:bg-[#30363d] hover:text-white shadow-none text-xs"
        />
      </div>
    </div>
  )
}
