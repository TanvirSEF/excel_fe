import { IconBook, IconFileText, IconUsers, IconCalendar } from "@tabler/icons-react"

const STATS = [
  { icon: IconBook,     value: "1,600+",  label: "Free Tutorials" },
  { icon: IconUsers,    value: "40,000+", label: "Monthly Readers" },
  { icon: IconFileText, value: "100+",    label: "Excel Templates" },
  { icon: IconCalendar, value: "10+",     label: "Years of Content" },
]

export function HeroStatsBand() {
  return (
    <div className="border-b border-border bg-muted/40">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid grid-cols-2 divide-x divide-border lg:grid-cols-4">
          {STATS.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className="flex items-center justify-center gap-3 px-6 py-5"
              >
                <Icon className="h-4 w-4 shrink-0 text-primary" />
                <div className="text-sm">
                  <span className="font-bold text-foreground">{stat.value}</span>
                  <span className="ml-1.5 text-muted-foreground">{stat.label}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
