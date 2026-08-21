"use client"

import { useState } from "react"

interface TagInputProps {
  value: string[]
  suggestions: string[]
  onChange: (tags: string[]) => void
}

export function TagInput({ value, suggestions, onChange }: TagInputProps) {
  const [draft, setDraft] = useState("")

  const filtered = suggestions.filter(
    (tag) =>
      !value.includes(tag) &&
      tag.toLowerCase().includes(draft.toLowerCase()) &&
      draft.length > 0
  )

  function add(tag: string) {
    const clean = tag.trim().toLowerCase()
    if (!clean || value.includes(clean)) return
    onChange([...value, clean])
    setDraft("")
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-1.5 rounded-md border border-input bg-background p-1.5">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
          >
            {tag}
            <button
              type="button"
              aria-label={`Remove ${tag}`}
              onClick={() => onChange(value.filter((t) => t !== tag))}
              className="text-primary/70 hover:text-primary"
            >
              ×
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === ",") {
              event.preventDefault()
              add(draft)
            }
          }}
          placeholder={value.length === 0 ? "Add tags…" : ""}
          className="h-7 min-w-24 flex-1 bg-transparent text-sm outline-none"
        />
      </div>
      {filtered.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {filtered.slice(0, 6).map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => add(tag)}
              className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
            >
              + {tag}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
