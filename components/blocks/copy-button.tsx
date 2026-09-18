"use client"

import { useEffect, useState } from "react"
import { IconCheck, IconCopy } from "@tabler/icons-react"

import { cn } from "@/lib/utils"

interface CopyButtonProps {
  text: string
  className?: string
  label?: string
}

export function CopyButton({ text, className, label = "Copy" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [copied])

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={copied ? "Copied to clipboard" : label}
      title={copied ? "Copied!" : label}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-all select-none active:scale-95",
        copied
          ? "border-primary/40 bg-primary/10 text-primary shadow-2xs"
          : "border-border/70 bg-background/90 text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary shadow-2xs",
        className
      )}
    >
      {copied ? (
        <IconCheck className="h-3.5 w-3.5 text-primary shrink-0 animate-in zoom-in-50 duration-150" />
      ) : (
        <IconCopy className="h-3.5 w-3.5 shrink-0" />
      )}
      <span className="hidden sm:inline">
        {copied ? "Copied!" : label}
      </span>
    </button>
  )
}
