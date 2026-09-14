import Link from "next/link"
import { IconArrowRight } from "@tabler/icons-react"

import type { PlatformGroup } from "@/lib/category-topics"
import { cn } from "@/lib/utils"

interface CategorySectionProps {
  group: PlatformGroup
}

export function CategorySection({ group }: CategorySectionProps) {
  const isExcel = group.platform === "excel"
  const isGoogle = group.platform === "google"

  const PlatformIcon = group.icon

  return (
    <section id={group.id} className="scroll-mt-24 space-y-6 pt-4">
      {/* Section Header Banner */}
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border p-6 sm:p-8 backdrop-blur-sm transition-all",
          isExcel &&
            "border-emerald-500/25 bg-gradient-to-br from-emerald-500/8 via-emerald-500/3 to-transparent dark:from-emerald-950/20 dark:via-background dark:to-background",
          isGoogle &&
            "border-teal-500/25 bg-gradient-to-br from-teal-500/8 via-teal-500/3 to-transparent dark:from-teal-950/20 dark:via-background dark:to-background",
          !isExcel &&
            !isGoogle &&
            "border-border/70 bg-gradient-to-br from-muted/50 via-background to-background"
        )}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border shadow-2xs",
                isExcel &&
                  "border-emerald-500/30 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
                isGoogle &&
                  "border-teal-500/30 bg-teal-500/15 text-teal-600 dark:text-teal-400",
                !isExcel &&
                  !isGoogle &&
                  "border-border/80 bg-muted text-muted-foreground"
              )}
            >
              <PlatformIcon className="h-6 w-6" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "text-[11px] font-bold uppercase tracking-wider",
                    isExcel && "text-emerald-600 dark:text-emerald-400",
                    isGoogle && "text-teal-600 dark:text-teal-400",
                    !isExcel && !isGoogle && "text-muted-foreground"
                  )}
                >
                  {group.badge}
                </span>
                <span className="text-muted-foreground/40">•</span>
                <span className="text-xs font-semibold text-muted-foreground">
                  {group.items.length} {group.items.length === 1 ? "Topic" : "Topics"}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {group.title}
              </h2>
              <p className="max-w-2xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {group.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Category Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {group.items.map((item) => {
          const Icon = item.icon

          return (
            <Link
              key={item.slug}
              href={`/categories/${item.slug}`}
              className={cn(
                "group relative flex flex-col justify-between rounded-xl border bg-card p-5 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
                isExcel &&
                  "border-border/70 hover:border-emerald-500/60 hover:bg-emerald-500/[0.02]",
                isGoogle &&
                  "border-border/70 hover:border-teal-500/60 hover:bg-teal-500/[0.02]",
                !isExcel &&
                  !isGoogle &&
                  "border-border/70 hover:border-primary/50 hover:bg-muted/30"
              )}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg border transition-colors",
                      isExcel &&
                        "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white dark:group-hover:bg-emerald-500 dark:group-hover:text-black",
                      isGoogle &&
                        "border-teal-500/20 bg-teal-500/10 text-teal-600 dark:text-teal-400 group-hover:bg-teal-600 group-hover:text-white dark:group-hover:bg-teal-500 dark:group-hover:text-black",
                      !isExcel &&
                        !isGoogle &&
                        "border-border bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5 transition-transform duration-200 group-hover:scale-105" />
                  </div>

                  {item.colorHex ? (
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: item.colorHex }}
                      aria-hidden
                    />
                  ) : null}
                </div>

                <div>
                  <h3
                    className={cn(
                      "text-sm sm:text-base font-semibold tracking-tight text-foreground transition-colors",
                      isExcel && "group-hover:text-emerald-600 dark:group-hover:text-emerald-400",
                      isGoogle && "group-hover:text-teal-600 dark:group-hover:text-teal-400",
                      !isExcel && !isGoogle && "group-hover:text-primary"
                    )}
                  >
                    {item.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {item.children && item.children.length > 0 ? (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {item.children.slice(0, 4).map((child) => (
                      <span
                        key={child.id}
                        className="rounded-md border border-border/60 bg-muted/40 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                      >
                        {child.name}
                      </span>
                    ))}
                    {item.children.length > 4 && (
                      <span className="text-[10px] text-muted-foreground self-center">
                        +{item.children.length - 4} more
                      </span>
                    )}
                  </div>
                ) : null}
              </div>

              <div
                className={cn(
                  "mt-4 flex items-center justify-between border-t border-border/40 pt-3 text-xs font-semibold transition-colors",
                  isExcel && "text-emerald-600 dark:text-emerald-400",
                  isGoogle && "text-teal-600 dark:text-teal-400",
                  !isExcel && !isGoogle && "text-primary"
                )}
              >
                <span>Explore guides</span>
                <IconArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
