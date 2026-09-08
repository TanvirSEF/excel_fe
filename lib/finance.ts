export interface DripInput {
  investment: number
  yieldPct: number
  contribution: number
  priceGrowthPct: number
  taxRatePct: number
  years: number
}

export interface DripYear {
  year: number
  income: number
  netDividend: number
  value: number
}

export interface DripResult {
  years: DripYear[]
  finalValue: number
  finalIncome: number
  firstIncome: number
  totalDividends: number
  totalContributions: number
  priceGrowthAmount: number
  yieldOnCost: number
}

export function simulateDrip(input: DripInput): DripResult {
  let balance = input.investment
  let totalDividends = 0
  const totalContributions = input.investment + input.contribution * input.years
  const years: DripYear[] = []
  let grossIncome = 0

  for (let year = 1; year <= input.years; year++) {
    grossIncome = balance * (input.yieldPct / 100)
    const netDividend = grossIncome * (1 - input.taxRatePct / 100)
    totalDividends += netDividend
    balance = (balance + netDividend + input.contribution) * (1 + input.priceGrowthPct / 100)
    years.push({ year, income: grossIncome, netDividend, value: balance })
  }

  const finalValue = years.length > 0 ? years[years.length - 1].value : input.investment
  const finalIncome = finalValue * (input.yieldPct / 100)
  const priceGrowthAmount = finalValue - totalContributions - totalDividends

  return {
    years,
    finalValue,
    finalIncome,
    firstIncome: years.length > 0 ? years[0].income : 0,
    totalDividends,
    totalContributions,
    priceGrowthAmount,
    yieldOnCost: totalContributions > 0 ? (finalIncome / totalContributions) * 100 : 0,
  }
}

export interface SnowballInput {
  investment: number
  initialYieldPct: number
  taxRatePct: number
  monthlyContribution: number
  years: number
  dividendGrowthPct: number
  priceGrowthPct: number
}

export interface SnowballYear {
  year: number
  income: number
  value: number
}

export interface SnowballResult {
  years: SnowballYear[]
  finalValue: number
  finalAnnualIncome: number
  firstYearIncome: number
  totalReinvested: number
  totalContributions: number
  yieldOnCost: number
  hourlyWage: number
}

export function simulateSnowball(input: SnowballInput): SnowballResult {
  let price = 100
  let shares = input.investment / price
  let divPerShare = (input.initialYieldPct / 100) * price
  let totalReinvested = 0
  const annualContribution = input.monthlyContribution * 12
  const totalContributions = input.investment + annualContribution * input.years
  const years: SnowballYear[] = []
  let currentIncome = 0

  for (let year = 1; year <= input.years; year++) {
    const grossDiv = shares * divPerShare
    const netDiv = grossDiv * (1 - input.taxRatePct / 100)
    totalReinvested += netDiv
    shares += netDiv / price
    shares += annualContribution / price
    price *= 1 + input.priceGrowthPct / 100
    divPerShare *= 1 + input.dividendGrowthPct / 100
    currentIncome = shares * divPerShare
    years.push({ year, income: currentIncome, value: shares * price })
  }

  const finalValue = years.length > 0 ? years[years.length - 1].value : input.investment

  return {
    years,
    finalValue,
    finalAnnualIncome: currentIncome,
    firstYearIncome: years.length > 0 ? years[0].income : 0,
    totalReinvested,
    totalContributions,
    yieldOnCost:
      totalContributions > 0 ? (currentIncome / totalContributions) * 100 : 0,
    hourlyWage: currentIncome / 2080,
  }
}

export interface LivingOffDividendsInput {
  currentPortfolio: number
  targetMonthlyIncome: number
  dividendYieldPct: number
  dividendGrowthPct: number
  priceGrowthPct: number
  taxRatePct: number
  inflationPct: number
  monthlyContribution: number
}

export interface LivingOffDividendsResult {
  yearsToFreedom: number | null
  portfolioValue: number
  netMonthlyIncome: number
  inflatedMonthlyGoal: number
  covered: boolean
  annualIncome: number
  totalContributions: number
  yieldOnCost: number
}

export const LIVING_OFF_MAX_YEARS = 100

export function simulateLivingOffDividends(
  input: LivingOffDividendsInput
): LivingOffDividendsResult {
  const netFactor = 1 - input.taxRatePct / 100
  const inflationRate = input.inflationPct / 100
  const annualContribution = input.monthlyContribution * 12

  let price = 100
  let shares = input.currentPortfolio / price
  let divPerShare = (input.dividendYieldPct / 100) * price
  let totalContributions = input.currentPortfolio

  const initialMonthlyIncome = (shares * divPerShare * netFactor) / 12
  if (initialMonthlyIncome >= input.targetMonthlyIncome) {
    return {
      yearsToFreedom: 0,
      portfolioValue: input.currentPortfolio,
      netMonthlyIncome: initialMonthlyIncome,
      inflatedMonthlyGoal: input.targetMonthlyIncome,
      covered: true,
      annualIncome: shares * divPerShare,
      totalContributions,
      yieldOnCost: (shares * divPerShare) / totalContributions * 100,
    }
  }

  for (let year = 1; year <= LIVING_OFF_MAX_YEARS; year++) {
    const netDividend = shares * divPerShare * netFactor
    shares += netDividend / price
    price *= 1 + input.priceGrowthPct / 100
    divPerShare *= 1 + input.dividendGrowthPct / 100
    shares += annualContribution / price
    totalContributions += annualContribution

    const annualIncome = shares * divPerShare
    const netMonthlyIncome = (annualIncome * netFactor) / 12
    const inflatedGoal =
      input.targetMonthlyIncome * (1 + inflationRate) ** year

    if (netMonthlyIncome >= inflatedGoal) {
      return {
        yearsToFreedom: year,
        portfolioValue: shares * price,
        netMonthlyIncome,
        inflatedMonthlyGoal: inflatedGoal,
        covered: true,
        annualIncome,
        totalContributions,
        yieldOnCost: (annualIncome / totalContributions) * 100,
      }
    }
  }

  const annualIncome = shares * divPerShare
  const inflatedGoal =
    input.targetMonthlyIncome * (1 + inflationRate) ** LIVING_OFF_MAX_YEARS

  return {
    yearsToFreedom: null,
    portfolioValue: shares * price,
    netMonthlyIncome: (annualIncome * netFactor) / 12,
    inflatedMonthlyGoal: inflatedGoal,
    covered: false,
    annualIncome,
    totalContributions,
    yieldOnCost: (annualIncome / totalContributions) * 100,
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
