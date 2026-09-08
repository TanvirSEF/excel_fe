import type { CalculatorDetail } from "../types"

export const retirementRateOfReturnCalculator: CalculatorDetail = {
  metaDescription:
    "Free retirement rate of return calculator — the exact annual return your savings need to hit your retirement target, with a risk read on how aggressive you must be.",
  formula: "Solve for r: Savings×(1+r)ⁿ + Contributions×[((1+r)ⁿ−1)÷r] = Target",
  whenToUse: [
    "When a retirement calculator told you a target number but not what it takes to get there.",
    "To decide whether your plan needs more risk, more savings, or more years.",
  ],
  howToUse: [
    "Enter current savings, annual contributions and years until retirement.",
    "Enter your target nest egg and the return you currently expect.",
    "Read the required return, the projected value at your current rate, and the risk read.",
  ],
  example: {
    title: "Example: $100k + $10k/yr targeting $1M in 20 years",
    body: "The required return is about 8.53% per year — realistic for a stock-heavy portfolio but above what bonds deliver.",
  },
}
