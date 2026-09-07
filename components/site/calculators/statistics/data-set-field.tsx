"use client"

import { useId } from "react"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { parseDataSet } from "@/lib/stats"
import { cn } from "@/lib/utils"

interface DataSetFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  hint?: string
  placeholder?: string
  invalid?: boolean
}

export function DataSetField({
  label,
  value,
  onChange,
  hint,
  placeholder,
  invalid,
}: DataSetFieldProps) {
  const id = useId()
  const { values, invalid: badTokens } = parseDataSet(value)
  const showError = invalid || badTokens.length > 0
  const message = badTokens.length
    ? `Not numeric: ${badTokens.slice(0, 5).join(", ")}${badTokens.length > 5 ? "…" : ""}`
    : hint

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-medium text-muted-foreground">
        {label}
      </Label>
      <Textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={3}
        spellCheck={false}
        aria-invalid={showError ? true : undefined}
        className={cn(
          "min-h-20 bg-background font-mono text-sm tabular-nums",
          showError && "border-destructive/60 focus-visible:ring-destructive/30"
        )}
      />
      {message ? (
        <p
          className={cn(
            "text-[11px] leading-snug",
            badTokens.length ? "text-destructive" : "text-muted-foreground/80"
          )}
        >
          {message}
        </p>
      ) : values.length > 1 ? (
        <p className="text-[11px] leading-snug text-muted-foreground/80">
          {values.length} values · mean{" "}
          {(values.reduce((t, x) => t + x, 0) / values.length).toFixed(2)} · range{" "}
          {Math.min(...values).toFixed(2)} – {Math.max(...values).toFixed(2)}
        </p>
      ) : null}
    </div>
  )
}
