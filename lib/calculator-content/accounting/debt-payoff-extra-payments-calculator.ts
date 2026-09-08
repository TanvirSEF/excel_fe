import type { CalculatorDetail } from "../types"

export const debtPayoffExtraPaymentsCalculator: CalculatorDetail = {
  metaDescription:
    "Free debt payoff calculator with extra payments — see your debt-free date with and without the extra, and the interest you save.",
  formula: "Extra payments cut principal → every future month's interest shrinks",
  whenToUse: [
    "Deciding whether an extra $50–$500 a month is worth it (spoiler: it cuts years).",
    "Comparing payoff dates before committing to any debt-consolidation offer.",
  ],
  howToUse: [
    "Enter the balance, APR and your minimum payment.",
    "Enter the extra amount you could add each month.",
    "Read both debt-free dates, the months saved and the interest saved.",
  ],
  example: {
    title: "Example: $10,000 at 12% APR, $250 minimum + $150 extra",
    body: "52 months on minimums becomes 29 with the extra — about 2 years faster and roughly $1,400 of interest saved. Press Reset to verify.",
  },
}
