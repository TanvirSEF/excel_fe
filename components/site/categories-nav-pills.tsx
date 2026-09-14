"use client"

import type { TablerIcon } from "@tabler/icons-react"
import { IconBrandGoogle, IconBrandOffice, IconFolder, IconLayoutGrid } from "@tabler/icons-react"

import { cn } from "@/lib/utils"

interface CategoriesNavPillsProps {
  groups: {
    id: string
    title: string
    platform: "excel" | "google" | "other"
    count: number
  }[]
}

const PLATFORM_ICONS: Record<string, TablerIcon> = {
  excel: IconBrandOffice,
  google: IconBrandGoogle,
  other: IconFolder,
}

export function CategoriesNavPills({ groups }: CategoriesNavPillsProps) {
  const totalCount = groups.reduce((acc, g) => acc + g.count, 0)

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2 pt-2">
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-muted/60 px-4 py-1.5 text-xs font-semibold text-foreground transition-all hover:bg-muted hover:border-border cursor-pointer shadow-2xs"
      >
        <IconLayoutGrid className="h-3.5 w-3.5 text-muted-foreground" />
        <span>All Categories</span>
        <span className="rounded-full bg-background px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
          {totalCount}
        </span>
      </button>

      {groups.map((group) => {
        const Icon = PLATFORM_ICONS[group.platform] ?? IconFolder
        const isExcel = group.platform === "excel"
        const isGoogle = group.platform === "google"

        return (
          <button
            key={group.id}
            type="button"
            onClick={() => scrollToSection(group.id)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer shadow-2xs",
              isExcel &&
                "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-500/50",
              isGoogle &&
                "border-teal-500/30 bg-teal-500/10 text-teal-700 dark:text-teal-300 hover:bg-teal-500/20 hover:border-teal-500/50",
              !isExcel &&
                !isGoogle &&
                "border-border/80 bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" />
            <span>{group.title}</span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-bold",
                isExcel && "bg-emerald-500/20 text-emerald-800 dark:text-emerald-200",
                isGoogle && "bg-teal-500/20 text-teal-800 dark:text-teal-200",
                !isExcel && !isGoogle && "bg-background text-muted-foreground"
              )}
            >
              {group.count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
