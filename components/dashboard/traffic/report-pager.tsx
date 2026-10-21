import { Button } from "@/components/ui/button"

interface ReportPagerProps {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
}

export function ReportPager({ page, pageSize, total, onPageChange }: ReportPagerProps) {
  const pages = Math.max(1, Math.ceil(total / pageSize))
  return (
    <div className="flex items-center justify-between gap-3 pt-3 text-xs text-muted-foreground">
      <span>
        Page {page} of {pages} · {total.toLocaleString()} rows
      </span>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          Previous
        </Button>
        <Button size="sm" variant="outline" disabled={page >= pages} onClick={() => onPageChange(page + 1)}>
          Next
        </Button>
      </div>
    </div>
  )
}
