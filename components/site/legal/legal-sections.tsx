import type { ReactNode } from "react"
import { IconInfoCircle } from "@tabler/icons-react"

import { cn } from "@/lib/utils"

interface LegalSectionProps {
  id: string
  num?: string
  title: string
  children: ReactNode
}

export function LegalSection({ id, num, title, children }: LegalSectionProps) {
  return (
    <section aria-labelledby={id}>
      <div id={id} className="flex scroll-mt-24 items-center gap-3">
        {num ? (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            {num}
          </span>
        ) : null}
        <h2 className="font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          {title}
        </h2>
      </div>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  )
}

interface LegalSubsectionProps {
  id: string
  title: string
  children?: ReactNode
}

export function LegalSubsection({ id, title, children }: LegalSubsectionProps) {
  return (
    <div className="mt-8">
      <h3
        id={id}
        className="scroll-mt-24 font-heading text-lg font-semibold tracking-tight text-foreground"
      >
        {title}
      </h3>
      {children ? <div className="mt-4 space-y-4">{children}</div> : null}
    </div>
  )
}

export function InShort({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-sky-500/30 bg-sky-500/5 p-4">
      <IconInfoCircle className="mt-0.5 h-5 w-5 shrink-0 text-sky-600 dark:text-sky-400" />
      <div className="text-[0.95rem] leading-7 text-foreground/80">{children}</div>
    </div>
  )
}

interface LegalTableProps {
  headers?: string[]
  rows: ReactNode[][]
  kv?: boolean
}

export function LegalTable({ headers, rows, kv }: LegalTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full border-collapse text-sm">
        {headers ? (
          <thead className="bg-muted/60">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className="border-b px-3 py-2 text-left font-semibold text-foreground"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
        ) : null}
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="odd:bg-muted/20 hover:bg-muted/40">
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={cn(
                    "px-3 py-2 align-top text-foreground/80",
                    kv && cellIndex === 0 && "w-36 font-medium text-muted-foreground"
                  )}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
