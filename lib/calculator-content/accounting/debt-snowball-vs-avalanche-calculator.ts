import type { CalculatorDetail } from "../types"

export const debtSnowballVsAvalancheCalculator: CalculatorDetail = {
  metaDescription:
    "Free snowball vs avalanche calculator — enter all your debts and see which payoff strategy is faster and cheaper for you, month by month.",
  formula: "Snowball: smallest balance first · Avalanche: highest APR first",
  whenToUse: [
    "Starting a debt payoff plan and choosing between the two famous strategies.",
    "Checking whether the motivational snowball really costs you much more than the mathematically optimal avalanche.",
  ],
  howToUse: [
    "Enter every debt with its balance, APR and minimum payment.",
    "Enter the extra monthly budget above the minimums.",
    "Both strategies simulate month by month — compare timelines, interest and first payoffs.",
  ],
  example: {
    title: "Example: three debts, $200 extra per month",
    body: "The default three-debt stack pays off in about 2 yr 8 mo either way — the calculator shows the exact interest gap for your numbers.",
  },
}
