import type { CalculatorDetail } from "../types"

export const costOfEquityCalculator: CalculatorDetail = {
  metaDescription:
    "Free cost of equity calculator using CAPM — risk-free rate, beta and market return give the return investors demand for holding a stock.",
  formula: "Ke = rf + β × (rm − rf)",
  whenToUse: [
    "When valuing a company with DCF — the cost of equity is the discount rate for its cash flows.",
    "To judge whether a stock's expected return beats the return its risk demands.",
  ],
  howToUse: [
    "Enter the risk-free rate — usually the current 10-year Treasury yield.",
    "Enter the stock's beta (over 1 means more volatile than the market).",
    "Enter the expected market return — long-term averages run 8–10%.",
  ],
  example: {
    title: "Example: the classic CAPM case",
    body: "rf 4.2%, beta 1.35, market return 9.7% → Ke = 4.2% + 1.35 × 5.5% = 11.625%.",
  },
  excelNote: "In Excel: =rf + beta*(rm - rf) — or look up beta on any stock data page.",
}
