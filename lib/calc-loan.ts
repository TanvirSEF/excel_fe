export interface AmortizationMonth {
  month: number
  payment: number
  interest: number
  principal: number
  balance: number
  cumulativeInterest: number
  cumulativePrincipal: number
}

export interface AmortizationYear {
  year: number
  payment: number
  interest: number
  principal: number
  balance: number
}

export interface LoanInput {
  principal: number
  annualRatePercent: number
  months: number
}

export interface LoanResult {
  monthlyPayment: number
  totalInterest: number
  totalPayment: number
  totalMonths: number
  schedule: AmortizationMonth[]
  yearly: AmortizationYear[]
}

export function calculateLoan({
  principal,
  annualRatePercent,
  months,
}: LoanInput): LoanResult {
  const r = annualRatePercent / 100 / 12
  const emi =
    r === 0 ? principal / months : (principal * r * (1 + r) ** months) / ((1 + r) ** months - 1)

  const schedule: AmortizationMonth[] = []
  let balance = principal
  let cumulativeInterest = 0
  let cumulativePrincipal = 0

  for (let month = 1; month <= months; month++) {
    const interest = balance * r
    // Absorb float drift in the final installment so the balance closes at exactly 0.
    const principalPart = month === months ? balance : emi - interest
    balance = month === months ? 0 : balance - principalPart
    cumulativeInterest += interest
    cumulativePrincipal += principalPart
    schedule.push({
      month,
      payment: interest + principalPart,
      interest,
      principal: principalPart,
      balance,
      cumulativeInterest,
      cumulativePrincipal,
    })
  }

  const yearly: AmortizationYear[] = []
  for (let start = 0; start < schedule.length; start += 12) {
    const chunk = schedule.slice(start, start + 12)
    yearly.push({
      year: Math.floor(start / 12) + 1,
      payment: chunk.reduce((sum, row) => sum + row.payment, 0),
      interest: chunk.reduce((sum, row) => sum + row.interest, 0),
      principal: chunk.reduce((sum, row) => sum + row.principal, 0),
      balance: chunk[chunk.length - 1].balance,
    })
  }

  return {
    monthlyPayment: emi,
    totalInterest: cumulativeInterest,
    totalPayment: principal + cumulativeInterest,
    totalMonths: months,
    schedule,
    yearly,
  }
}
