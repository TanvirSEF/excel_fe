export function formatDuration(seconds: number | null | undefined) {
  if (seconds === null || seconds === undefined) return "—"
  const total = Math.round(seconds)
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const rest = total % 60
  if (hours > 0) return `${hours}h ${minutes}m`
  if (minutes > 0) return `${minutes}m ${rest}s`
  return `${rest}s`
}

export function formatRate(value: number) {
  return `${(value * 100).toFixed(1)}%`
}

export function percentChange(current: number | null, previous: number | null | undefined) {
  if (current === null || previous === null || previous === undefined) return null
  if (previous === 0) return current === 0 ? 0 : null
  return ((current - previous) / previous) * 100
}

export function pointChange(current: number, previous: number | null | undefined) {
  if (previous === null || previous === undefined) return null
  return (current - previous) * 100
}
