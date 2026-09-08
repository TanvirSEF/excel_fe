import type { CalculatorDetail } from "../types"

export const marginalPropensityToConsumeCalculator: CalculatorDetail = {
  metaDescription:
    "Free marginal propensity to consume calculator — how much of every extra dollar you earn gets spent versus saved, from your raise.",
  formula: "MPC = ΔConsumption ÷ ΔIncome · MPS = 1 − MPC",
  whenToUse: [
    "Economics coursework — the foundational Keynesian consumption function.",
    "Personally: see what a raise actually does to your spending before lifestyle creep sets in.",
  ],
  howToUse: [
    "Enter the change in your income — the raise or extra earnings.",
    "Enter how much of it you actually spent.",
    "Read your MPC and MPS, always between 0 and 1.",
  ],
  example: {
    title: "Example: $1,000 raise, $850 more spending",
    body: "MPC = 0.85, MPS = 0.15 — 85 cents of every extra dollar gets spent. Press Reset to verify.",
  },
}
