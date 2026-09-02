export interface NpvRow {
  year: number
  cashFlow: number
  discounted: number
  cumulative: number
}

export interface NpvInput {
  /** Positive outlay, negated internally. */
  initialInvestment: number
  /** Yearly inflows starting at t = 1 (Excel NPV convention). */
  cashFlows: number[]
  discountRatePercent: number
}

export interface NpvResult {
  npv: number
  irrPercent: number | null
  rows: NpvRow[]
}

/** NPV with the initial investment at t = 0, flows discounted from t = 1. */
export function npvAtRate(
  initialInvestment: number,
  cashFlows: number[],
  rate: number
): number {
  let npv = -initialInvestment
  for (let t = 0; t < cashFlows.length; t++) {
    npv += cashFlows[t] / (1 + rate) ** (t + 1)
  }
  return npv
}

/**
 * IRR: bisection on [−0.9999, 10]. Robust for realistic finance flows and
 * only returns null when no sign change exists (Excel's #NUM! case).
 */
function solveIrr(
  initialInvestment: number,
  cashFlows: number[]
): number | null {
  let low = -0.9999
  let high = 10
  let fLow = npvAtRate(initialInvestment, cashFlows, low)
  const fHigh = npvAtRate(initialInvestment, cashFlows, high)
  if (fLow === 0) return low
  if (fHigh === 0) return high
  if (fLow * fHigh > 0) return null

  for (let iteration = 0; iteration < 200; iteration++) {
    const mid = (low + high) / 2
    const fMid = npvAtRate(initialInvestment, cashFlows, mid)
    if (fMid === 0) return mid
    if (fLow * fMid < 0) {
      high = mid
    } else {
      low = mid
      fLow = fMid
    }
    if (high - low < 1e-12) break
  }
  return (low + high) / 2
}

export function calculateNpv({
  initialInvestment,
  cashFlows,
  discountRatePercent,
}: NpvInput): NpvResult {
  const rate = discountRatePercent / 100

  const rows: NpvRow[] = []
  let cumulative = -initialInvestment
  rows.push({
    year: 0,
    cashFlow: -initialInvestment,
    discounted: -initialInvestment,
    cumulative,
  })
  for (let t = 0; t < cashFlows.length; t++) {
    const discounted = cashFlows[t] / (1 + rate) ** (t + 1)
    cumulative += discounted
    rows.push({
      year: t + 1,
      cashFlow: cashFlows[t],
      discounted,
      cumulative,
    })
  }

  const irr = solveIrr(initialInvestment, cashFlows)

  return {
    npv: npvAtRate(initialInvestment, cashFlows, rate),
    irrPercent: irr === null ? null : irr * 100,
    rows,
  }
}
