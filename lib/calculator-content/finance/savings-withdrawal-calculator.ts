import type { CalculatorDetail } from "../types"

export const savingsWithdrawalCalculator: CalculatorDetail = {
  metaDescription:
    "Free savings withdrawal calculator — month-by-month simulation of how long your savings last with regular withdrawals and investment growth.",
  formula: "Each month: balance += interest − withdrawal, until the money runs out",
  whenToUse: [
    "For retirement drawdown planning — how long the nest egg holds at your spending rate.",
    "For sabbaticals, emergencies or any period of living off savings.",
  ],
  howToUse: [
    "Enter your total savings, planned monthly withdrawal and expected annual return.",
    "The simulator compounds monthly and withdraws monthly — just like a real account.",
    "Read how long the money lasts and compare your rate with the 4% safe-withdrawal rule.",
  ],
  example: {
    title: "Example: $500k, $3,500/mo at 6% return",
    body: "The money lasts about 20.4 years. Drop the withdrawal to $2,500 and it stretches past 60 years. Press Reset to verify.",
  },
}
