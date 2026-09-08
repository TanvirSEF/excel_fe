import type { CalculatorDetail } from "../types"

export const irrCalculator: CalculatorDetail = {
  metaDescription:
    "Free IRR calculator — paste any cash flow series and get the exact internal rate of return, with an NPV check that confirms the solution.",
  formula: "IRR is the rate where NPV = Σ CFₜ ÷ (1+r)ᵗ = 0",
  whenToUse: [
    "Comparing investments with irregular cash flows — equipment purchases, business deals, real estate.",
    "Whenever someone quotes an 'annual return' on a lumpy project — IRR is the honest number.",
  ],
  howToUse: [
    "Enter year 0 first — the initial investment as a negative number.",
    "Then each year's cash flow, separated by commas, spaces or new lines.",
    "Read the IRR and the NPV check — it should be ≈ $0, confirming the solution.",
  ],
  example: {
    title: "Example: −1000, then 400 for three years",
    body: "IRR = 9.70% — the investment compounds your money at that rate each year. Press Reset to verify.",
  },
  excelNote: "In Excel use =IRR(range) — the same math this calculator runs.",
}
