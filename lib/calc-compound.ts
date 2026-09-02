export interface CompoundYearRow {
  year: number
  value: number
  contributions: number
  interest: number
}

export interface CompoundInput {
  principal: number
  monthlyContribution: number
  annualRatePercent: number
  years: number
}

export interface CompoundResult {
  futureValue: number
  totalContributions: number
  totalInterest: number
  multiple: number
  yearly: CompoundYearRow[]
}

const MAX_ROWS = 100

/**
 * Monthly compounding with end-of-month contributions — the default
 * behaviour of Excel's FV(rate, nper, pmt, pv) with type = 0.
 */
export function calculateCompoundInterest({
  principal,
  monthlyContribution,
  annualRatePercent,
  years,
}: CompoundInput): CompoundResult {
  const i = annualRatePercent / 100 / 12
  const months = Math.round(years * 12)
  const growth = (1 + i) ** months

  const principalPart = principal * growth
  const contributionPart =
    i === 0 ? monthlyContribution * months : monthlyContribution * ((growth - 1) / i)
  const futureValue = principalPart + contributionPart

  const totalContributions = principal + monthlyContribution * months

  const yearly: CompoundYearRow[] = []
  const rowCount = Math.min(Math.max(1, Math.round(years)), MAX_ROWS)
  for (let year = 1; year <= rowCount; year++) {
    const m = year * 12
    const g = (1 + i) ** m
    const value =
      principal * g +
      (i === 0 ? monthlyContribution * m : monthlyContribution * ((g - 1) / i))
    const contributedSoFar = principal + monthlyContribution * m
    yearly.push({
      year,
      value,
      contributions: contributedSoFar,
      interest: value - contributedSoFar,
    })
  }

  return {
    futureValue,
    totalContributions,
    totalInterest: futureValue - totalContributions,
    multiple: totalContributions === 0 ? 0 : futureValue / totalContributions,
    yearly,
  }
}
