export interface DripInput {
  investment: number
  yieldPct: number
  contribution: number
  divGrowthPct: number
  priceGrowthPct: number
  years: number
}

export interface DripYear {
  year: number
  income: number
  value: number
}

export interface DripResult {
  years: DripYear[]
  finalValue: number
  finalIncome: number
  firstIncome: number
  totalDividends: number
  totalContributions: number
}

export function simulateDrip(input: DripInput): DripResult {
  const price = 100
  let shares = input.investment / price
  let divPerShare = (input.yieldPct / 100) * price
  let totalDividends = 0
  let totalContributions = input.investment
  const years: DripYear[] = []
  let income = 0

  for (let year = 1; year <= input.years; year++) {
    income = shares * divPerShare
    totalDividends += income
    shares += income / price
    shares += input.contribution / price
    totalContributions += input.contribution
    divPerShare *= 1 + input.divGrowthPct / 100
    const newPrice = price * (1 + input.priceGrowthPct / 100) ** year
    years.push({ year, income, value: shares * newPrice })
  }

  return {
    years,
    finalValue: years.length > 0 ? years[years.length - 1].value : input.investment,
    finalIncome: income,
    firstIncome: years.length > 0 ? years[0].income : 0,
    totalDividends,
    totalContributions,
  }
}

export function npv(rate: number, cashFlows: number[]): number {
  return cashFlows.reduce(
    (total, cf, t) => total + cf / (1 + rate) ** t,
    0
  )
}

export function irr(cashFlows: number[]): number | null {
  if (cashFlows.length < 2) return null
  if (cashFlows[0] >= 0) return null
  if (!cashFlows.some((cf) => cf > 0)) return null

  let lo = -0.9999
  let hi = 10
  let loNpv = npv(lo, cashFlows)
  let hiNpv = npv(hi, cashFlows)
  if (loNpv * hiNpv > 0) return null

  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2
    const midNpv = npv(mid, cashFlows)
    if (Math.abs(midNpv) < 1e-9) return mid
    if (loNpv * midNpv < 0) {
      hi = mid
      hiNpv = midNpv
    } else {
      lo = mid
      loNpv = midNpv
    }
  }
  return (lo + hi) / 2
}

export function futureValue(
  rate: number,
  principal: number,
  annualContribution: number,
  years: number
): number {
  if (years <= 0) return principal
  const value = principal * (1 + rate) ** years
  if (rate === 0) return value + annualContribution * years
  return value + annualContribution * (((1 + rate) ** years - 1) / rate)
}

export function requiredRate(
  principal: number,
  annualContribution: number,
  years: number,
  target: number
): number | null {
  if (years <= 0 || target <= principal) return null
  let lo = 0.000001
  let hi = 5
  if (futureValue(hi, principal, annualContribution, years) < target) return null
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2
    if (futureValue(mid, principal, annualContribution, years) < target) lo = mid
    else hi = mid
  }
  return (lo + hi) / 2
}

export interface WithdrawalYear {
  year: number
  startBalance: number
  withdrawn: number
  endBalance: number
}

export interface WithdrawalResult {
  monthlyRate: number
  monthsLasted: number | null
  finalBalance: number
  years: WithdrawalYear[]
  neverDepletes: boolean
}

export function simulateWithdrawal(
  savings: number,
  monthlyWithdrawal: number,
  annualReturnPct: number
): WithdrawalResult {
  const monthlyRate = (1 + annualReturnPct / 100) ** (1 / 12) - 1
  let balance = savings
  let months = 0
  const years: WithdrawalYear[] = []
  const MAX_MONTHS = 12 * 100

  while (balance > 0 && months < MAX_MONTHS) {
    const startOfYear = balance
    let yearWithdrawn = 0
    for (let m = 0; m < 12 && balance > 0; m++) {
      balance += balance * monthlyRate
      balance -= monthlyWithdrawal
      yearWithdrawn += monthlyWithdrawal
      months++
    }
    years.push({
      year: years.length + 1,
      startBalance: startOfYear,
      withdrawn: yearWithdrawn,
      endBalance: Math.max(0, balance),
    })
  }

  const neverDepletes = balance > 0 && months >= MAX_MONTHS
  return {
    monthlyRate,
    monthsLasted: neverDepletes ? null : months,
    finalBalance: Math.max(0, balance),
    years,
    neverDepletes,
  }
}

export interface SolarInput {
  cost: number
  incentivePct: number
  ratePerKwh: number
  annualKwh: number
  degradationPct: number
  escalationPct: number
  lifetimeYears: number
}

export interface SolarResult {
  netCost: number
  firstYearSavings: number
  paybackYears: number | null
  lifetimeSavings: number
  netRoiPercent: number
  years: { year: number; savings: number; cumulative: number }[]
}

export function simulateSolar(input: SolarInput): SolarResult {
  const netCost = input.cost * (1 - input.incentivePct / 100)
  const years: { year: number; savings: number; cumulative: number }[] = []
  let cumulative = 0
  let paybackYears: number | null = null

  for (let year = 1; year <= input.lifetimeYears; year++) {
    const savings =
      input.annualKwh *
      input.ratePerKwh *
      (1 + input.escalationPct / 100) ** (year - 1) *
      (1 - input.degradationPct / 100) ** (year - 1)
    const prevCumulative = cumulative
    cumulative += savings
    if (paybackYears === null && cumulative >= netCost && savings > 0) {
      paybackYears = year - 1 + (netCost - prevCumulative) / savings
    }
    years.push({ year, savings, cumulative })
  }

  return {
    netCost,
    firstYearSavings: years.length > 0 ? years[0].savings : 0,
    paybackYears,
    lifetimeSavings: cumulative,
    netRoiPercent: ((cumulative - netCost) / netCost) * 100,
    years,
  }
}
