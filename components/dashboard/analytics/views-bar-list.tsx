import Link from "next/link"

export interface BarListItem {
  id: string
  label: string
  value: number
  href?: string
}

export function ViewsBarList({
  items,
  valueLabel = "views",
}: {
  items: BarListItem[]
  valueLabel?: string
}) {
  const max = Math.max(...items.map((item) => item.value), 1)

  if (items.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        No data yet.
      </p>
    )
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => {
        const row = (
          <div className="space-y-1">
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="min-w-0 truncate font-medium">
                {item.label}
              </span>
              <span className="shrink-0 tabular-nums text-muted-foreground">
                {item.value.toLocaleString()} {valueLabel}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${Math.max(3, (item.value / max) * 100)}%` }}
              />
            </div>
          </div>
        )

        return (
          <li key={item.id}>
            {item.href ? (
              <Link href={item.href} className="block rounded-md hover:underline-offset-4">
                {row}
              </Link>
            ) : (
              row
            )}
          </li>
        )
      })}
    </ul>
  )
}
