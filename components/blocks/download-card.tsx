import { IconDownload, IconFileSpreadsheet } from "@tabler/icons-react"

interface DownloadCardProps {
  href: string
  label: string
}

export function DownloadCard({ href, label }: DownloadCardProps) {
  return (
    <div className="my-6 flex flex-col justify-between gap-4 rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/[0.04] p-4 shadow-xs transition-colors sm:flex-row sm:items-center sm:p-5 dark:border-emerald-500/40 dark:bg-emerald-500/[0.08]">
      <div className="flex items-center gap-3.5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
          <IconFileSpreadsheet className="h-6 w-6" />
        </div>
        <div>
          <p className="text-base font-bold text-foreground sm:text-lg">
            {label.trim()}
          </p>
          <p className="text-xs text-muted-foreground">
            Practice Workbook · Excel (.xlsx)
          </p>
        </div>
      </div>
      <a
        href={href}
        download=""
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-xs transition-colors hover:bg-emerald-700"
      >
        <IconDownload className="h-4 w-4" />
        <span>Download File</span>
      </a>
    </div>
  )
}
