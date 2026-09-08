import type { CalculatorDetail } from "../types"

export const salespersonProfitabilityCalculator: CalculatorDetail = {
  metaDescription:
    "Free salesperson profitability calculator — salary, commission, revenue and gross margin give net contribution, break-even sales and employee ROI.",
  whenToUse: [
    "Many companies use “Total Sales” to measure performance — that can lead to the wrong conclusion. A better way to measure a salesperson’s value is to look at their Net Contribution.",
    "The Salesperson’s Job: A salesperson should generate enough Gross Profit to cover their “Total Cost of Employment” (TCE) and still produce profit for the company.",
    "The “Rule of 3”: It serves as a common benchmark in many industries. A salesperson should generate 3x their base salary in Gross Profit — 1x covers their Salary, 1x covers their Share of Overhead (Rent, Admin, Marketing), and 1x is the Company’s Profit.",
  ],
  method: {
    title: "The Formulas Used in Our Calculator",
    equations: [
      {
        label: "Total Cost of Employment",
        equation: "Cost = Base Salary + Commissions Paid + Benefits + Expenses",
      },
      {
        label: "Gross Profit Generated",
        equation: "GP = Total Revenue × Gross Margin %",
      },
      {
        label: "Net Contribution",
        equation: "Contribution = GP − Cost",
      },
    ],
  },
  factGroups: [
    {
      title: "Understanding the “Break-Even” Point",
      intro:
        "This calculator includes a Break-Even Engine that shows the minimum sales amount a rep must reach before the company starts making profit. At this point, the rep covers their full cost to the business.",
      items: [
        {
          title: "Scenario: 40% Margin, 10% Commission",
          body: "You pay a rep $50k Base and your product margin is 40%. They earn 10% commission. Effective Margin: You keep 30% (40% Product Margin − 10% Commission). Break-Even Goal: $50,000 ÷ 0.30 = $166,666. Insight: If the rep sells less than $166k, the company loses money on that position. Every dollar above that amount adds profit to the business.",
        },
      ],
    },
  ],
  faqs: [
    {
      question: "What counts as “Benefits & Expenses”?",
      answer:
        "Many businesses forget these costs, but they can add a large amount to total employee expenses. Employer taxes, health insurance, 401k matches, CRM software, and travel budgets often add 20% to 30% on top of the base salary. Use the “Hidden Costs” section to include these expenses and get a more accurate result.",
    },
    {
      question: "What does a negative “Net Contribution” mean?",
      answer:
        "A negative net contribution means the salesperson costs the company more money than they bring in — you can fix this in a few ways. Increase sales targets so the salesperson brings in more revenue. Lower the base salary and shift more pay toward commission. Improve profit margins by raising product prices.",
    },
    {
      question: "Is a high ROI always better?",
      answer:
        "A very high ROI does not always mean the setup works well. For example, a salesperson with a 500% ROI may earn too little, which can push them toward another company. On the other hand, a 10% ROI often shows weak performance — most businesses aim for a balanced range between 100% and 300% ROI.",
    },
  ],
}
