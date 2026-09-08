import type { CalculatorDetail } from "../types"

export const grossUpPayrollCalculator: CalculatorDetail = {
  metaDescription:
    "Free gross-up payroll calculator — find the gross pay that nets an employee exactly their target take-home after tax.",
  formula: "Gross = Net ÷ (1 − Tax rate)",
  whenToUse: [
    "Promising an employee a specific take-home amount — bonuses, relocations, sign-ons.",
    "Calculating the employer's cost of covering taxes on a promised net payment.",
  ],
  howToUse: [
    "Enter the take-home amount you want the employee to receive.",
    "Enter their total tax rate — federal + state + payroll.",
    "Read the gross pay to issue and the tax that gets withheld.",
  ],
  example: {
    title: "Example: $5,000 net at a 30% total tax rate",
    body: "Gross = 5,000 ÷ 0.70 = $7,142.86 — the gross-up factor is 1.429×. Press Reset to verify.",
  },
}
