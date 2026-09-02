const FALLBACK = "—"

const currency = (digits: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })

const compactCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
})

const percent = (digits: number) =>
  new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })

const number = new Intl.NumberFormat("en-US")

function finite(value: number): number | null {
  return Number.isFinite(value) ? value : null
}

export function formatCurrency(value: number, digits = 2): string {
  const v = finite(value)
  return v === null ? FALLBACK : currency(digits).format(v)
}

export function formatCompactCurrency(value: number): string {
  const v = finite(value)
  return v === null ? FALLBACK : compactCurrency.format(v)
}

/** `value` is already in percent units, e.g. 14.87 → "14.87%". */
export function formatPercent(value: number, digits = 2): string {
  const v = finite(value)
  return v === null ? FALLBACK : percent(digits).format(v / 100)
}

export function formatNumber(value: number): string {
  const v = finite(value)
  return v === null ? FALLBACK : number.format(v)
}

/** 66 → "5y 6m" */
export function formatMonths(totalMonths: number): string {
  const v = finite(totalMonths)
  if (v === null) return FALLBACK
  const years = Math.floor(v / 12)
  const months = Math.round(v % 12)
  if (years === 0) return `${months}m`
  if (months === 0) return `${years}y`
  return `${years}y ${months}m`
}

/** 1.6667 → "1.67x" */
export function formatMultiple(value: number): string {
  const v = finite(value)
  return v === null ? FALLBACK : `${v.toFixed(2)}x`
}
