import type { CalculatorDetail } from "../types"

export const solarRoiCalculator: CalculatorDetail = {
  metaDescription:
    "Free solar panel ROI and payback calculator — system cost with the 30% tax credit, electricity rate, degradation and escalation give your break-even year.",
  formula: "Payback = Net system cost ÷ Annual electricity savings (with degradation & escalation)",
  whenToUse: [
    "Before signing a solar contract — verify the payback period the salesperson quotes.",
    "To compare financing options or system sizes by their true break-even point.",
  ],
  howToUse: [
    "Enter the installed cost and your incentives — the US federal credit covers 30%.",
    "Enter your electricity rate and annual kWh consumption from your utility bill.",
    "Keep the industry-standard 0.5% degradation and 2.5% rate escalation unless you know better.",
  ],
  example: {
    title: "Example: $20,000 system with the 30% credit",
    body: "Net cost $14,000 and first-year savings of $1,500 (10,000 kWh at $0.15) — payback lands around year 8.6, with about $48,000 saved over 25 years.",
  },
}
