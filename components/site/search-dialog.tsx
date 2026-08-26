"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { IconSearch } from "@tabler/icons-react"

const SearchDialogContent = dynamic(
  () => import("./search-dialog-content").then((m) => m.SearchDialogContent),
  { ssr: false }
)

export function SearchDialog() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex h-9 items-center gap-2 rounded-full border border-border/70 bg-muted/30 px-3.5 text-sm text-muted-foreground transition-colors hover:border-border hover:bg-muted/60 hover:text-foreground"
        aria-label="Open search"
      >
        <IconSearch className="h-4 w-4" />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden sm:inline-flex items-center rounded border border-border/80 bg-background px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground">
          Ctrl K
        </kbd>
      </button>

      {open && <SearchDialogContent open={open} onOpenChange={setOpen} />}
    </>
  )
}
