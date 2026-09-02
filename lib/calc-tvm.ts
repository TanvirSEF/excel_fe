export interface TvmResult {
  /** The computed target value: FV when compounding, PV when discounting. */
  value: number
  /** Growth factor when compounding ((1+r)^n), discount factor when discounting. */
  factor: number
  impliedInterest: number
  effectiveAnnualRatePercent: number
}

interface TvmInput {
  amount: number
  annualRatePercent: number
  years: number
}

/** FV = PV·(1+r)^n — mirrors Excel =FV(rate, nper, 0, -pv). */
export function calculateFutureValue({
  amount,
  annualRatePercent,
  years,
}: TvmInput): TvmResult {
  const factor = (1 + annualRatePercent / 100) ** years
  const value = amount * factor
  return {
    value,
    factor,
    impliedInterest: value - amount,
    // Monthly compounding equivalent, for context.
    effectiveAnnualRatePercent:
      ((1 + annualRatePercent / 100 / 12) ** 12 - 1) * 100,
  }
}

/** PV = FV/(1+r)^n — mirrors Excel =PV(rate, nper, 0, fv). */
export function calculatePresentValue({
  amount,
  annualRatePercent,
  years,
}: TvmInput): TvmResult {
  const factor = (1 + annualRatePercent / 100) ** -years
  const value = amount * factor
  return {
    value,
    factor,
    impliedInterest: amount - value,
    effectiveAnnualRatePercent:
      ((1 + annualRatePercent / 100 / 12) ** 12 - 1) * 100,
  }
}
