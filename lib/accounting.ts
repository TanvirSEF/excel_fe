export interface PayoffPoint {
  month: number
  balance: number
  interest: number
}

export interface DebtPayoffResult {
  months: number
  totalInterest: number
  schedule: PayoffPoint[]
  neverPaidOff: boolean
}

export interface DebtInput {
  balance: number
  aprPct: number
  minPayment: number
}

export function payoffSingleDebt(
  debt: DebtInput,
  extraPayment: number
): DebtPayoffResult {
  const r = debt.aprPct / 100 / 12
  const payment = debt.minPayment + extraPayment
  let balance = debt.balance
  let totalInterest = 0
  let month = 0
  const schedule: PayoffPoint[] = []
  const MAX_MONTHS = 12 * 60

  if (payment <= balance * r) {
    return { months: 0, totalInterest: 0, schedule: [], neverPaidOff: true }
  }

  while (balance > 0 && month < MAX_MONTHS) {
    const interest = balance * r
    totalInterest += interest
    balance += interest
    const paid = Math.min(payment, balance)
    balance -= paid
    month++
    if (month % 12 === 0 || balance <= 0) {
      schedule.push({ month, balance: Math.max(0, balance), interest: totalInterest })
    }
  }

  return { months: month, totalInterest, schedule, neverPaidOff: balance > 0 }
}

export interface DebtRow extends DebtInput {
  label: string
}

export interface StrategyResult {
  months: number
  totalInterest: number
  totalPaid: number
  payoffs: { label: string; month: number }[]
  neverPaidOff: boolean
}

export function simulateStrategy(
  debts: DebtRow[],
  extraBudget: number,
  order: "snowball" | "avalanche"
): StrategyResult {
  let active = debts.map((debt) => ({ ...debt }))
  let month = 0
  let totalInterest = 0
  let extra = extraBudget
  const payoffs: { label: string; month: number }[] = []
  const MAX_MONTHS = 12 * 60

  while (active.length > 0 && month < MAX_MONTHS) {
    month++

    for (const debt of active) {
      const interest = debt.balance * (debt.aprPct / 100 / 12)
      debt.balance += interest
      totalInterest += interest
    }

    for (const debt of active) {
      debt.balance -= Math.min(debt.minPayment, debt.balance)
    }

    let budget = extra
    const ordered =
      order === "snowball"
        ? [...active].sort((a, b) => a.balance - b.balance)
        : [...active].sort((a, b) => b.aprPct - a.aprPct)
    for (const debt of ordered) {
      if (budget <= 0) break
      const applied = Math.min(debt.balance, budget)
      debt.balance -= applied
      budget -= applied
    }

    for (const debt of [...active]) {
      if (debt.balance <= 0.005) {
        payoffs.push({ label: debt.label, month })
        extra += debt.minPayment
        active = active.filter((d) => d !== debt)
      }
    }
  }

  return {
    months: month,
    totalInterest,
    totalPaid: debts.reduce((total, debt) => total + debt.balance, 0) + totalInterest,
    payoffs,
    neverPaidOff: active.length > 0,
  }
}

export function monthlyPayment(balance: number, aprPct: number, months: number): number {
  const r = aprPct / 100 / 12
  if (r === 0) return balance / months
  return (balance * r) / (1 - (1 + r) ** -months)
}

export function payoffMonths(balance: number, aprPct: number, payment: number): number | null {
  const r = aprPct / 100 / 12
  if (payment <= balance * r) return null
  if (r === 0) return Math.ceil(balance / payment)
  return Math.ceil(-Math.log(1 - (r * balance) / payment) / Math.log(1 + r))
}

export function totalInterestPaid(
  balance: number,
  aprPct: number,
  payment: number
): number | null {
  const months = payoffMonths(balance, aprPct, payment)
  if (months === null) return null
  return months * payment - balance
}
