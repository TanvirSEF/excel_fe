"use client"

import { useEffect, useState } from "react"
import { IconCheck, IconCopy } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"

interface CopyTableButtonProps {
  /** Rows of already-formatted cell strings; copied as TSV for direct Excel paste. */
  rows: string[][]
  label?: string
}

export function CopyTableButton({ rows, label = "Copy for Excel" }: CopyTableButtonProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [copied])

  async function copy() {
    const tsv = rows.map((row) => row.join("\t")).join("\n")
    try {
      await navigator.clipboard.writeText(tsv)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={copy}
      className="h-8 gap-1.5 text-xs"
    >
      {copied ? (
        <IconCheck className="h-3.5 w-3.5 text-primary" />
      ) : (
        <IconCopy className="h-3.5 w-3.5" />
      )}
      {copied ? "Copied!" : label}
    </Button>
  )
}
