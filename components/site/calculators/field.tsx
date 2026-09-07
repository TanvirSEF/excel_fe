"use client"

import { useId } from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface NumberFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string | null
  hint?: string
  suffix?: string
  placeholder?: string
}

export function NumberField({
  label,
  value,
  onChange,
  error,
  hint,
  suffix,
  placeholder,
}: NumberFieldProps) {
  const id = useId()
  const describedBy = error ?? hint
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-medium text-muted-foreground">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy ? `${id}-desc` : undefined}
          className={cn(
            "h-10 bg-background text-right font-mono text-sm tabular-nums",
            suffix && "pr-12",
            error && "border-destructive/60 focus-visible:ring-destructive/30"
          )}
        />
        {suffix ? (
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs font-medium text-muted-foreground">
            {suffix}
          </span>
        ) : null}
      </div>
      {describedBy ? (
        <p
          id={`${id}-desc`}
          className={cn(
            "text-[11px] leading-snug",
            error ? "text-destructive" : "text-muted-foreground/80"
          )}
        >
          {describedBy}
        </p>
      ) : null}
    </div>
  )
}

interface DateFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string | null
}

export function DateField({ label, value, onChange, error }: DateFieldProps) {
  const id = useId()
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-medium text-muted-foreground">
        {label}
      </Label>
      <Input
        id={id}
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-desc` : undefined}
        className={cn(
          "h-10 bg-background font-mono text-sm",
          error && "border-destructive/60 focus-visible:ring-destructive/30"
        )}
      />
      {error ? (
        <p id={`${id}-desc`} className="text-[11px] text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}
