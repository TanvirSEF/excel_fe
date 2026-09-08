import type { CalculatorDetail } from "../types"

export const debtPayoffExtraPaymentsCalculator: CalculatorDetail = {
  metaDescription:
    "Free debt payoff calculator with extra payments — balance, rate, minimum payment plus extra monthly or lump sum gives your payoff date, interest saved and time saved.",
  whenToUse: [
    "When you make a debt payment, the lender splits your money into two parts: The Finance Cost — money you pay to borrow the funds, called the Rate or Fee. The Principal — money that actually reduces your balance.",
    "At the start of most loans, a large part of your payment goes toward the Finance Cost. Your balance drops slowly during this stage.",
    "Extra payments work differently — every dollar from an Extra Payment goes straight to the Principal. As your balance gets smaller, the lender charges less Finance Cost each month. More of your regular payment then goes toward the Principal. This cycle repeats every month and helps you pay off the debt faster.",
  ],
  factGroups: [
    {
      title: "2 Strategies to Use With This Calculator",
      items: [
        {
          title: "The Snowball Method",
          body: "If you have multiple debts, list them from Smallest Balance to Largest Balance. Put all your extra money toward the smallest debt first. After you pay off that balance, move the full payment amount to the next smallest debt. Why it works: You can reach small goals faster — and that progress helps you stay motivated.",
        },
        {
          title: "The Avalanche Method",
          body: "List your debts from Highest Annual Rate to Lowest Annual Rate. Put your extra payments on the debt with the highest interest rate — a 20% credit card balance. Why it works: This method lowers your total borrowing cost over time because you pay off the most expensive debt first.",
        },
      ],
    },
  ],
  parameters: {
    title: "Advanced Options Explained",
    intro: "This calculator includes features that match actual situations:",
    items: [
      {
        name: "Monthly Extra",
        description:
          "Add a fixed amount that fits your budget — skipping one dinner out each month to pay an extra $50.",
      },
      {
        name: "Windfall Payment",
        description:
          "Add a one-time lump sum payment. Do you receive a yearly bonus or a tax refund? Enter the amount here to see how one large payment can help you pay off debt faster.",
      },
    ],
  },
  faqs: [
    {
      question: "Is there a penalty for paying off debt early?",
      answer:
        "Mostly, no. Lenders call this a “Prepayment Penalty.” It rarely appears in modern personal loans, but some auto loans and mortgages do include it — always check your contract before making a large lump-sum payment.",
    },
    {
      question: "Should I save or pay off debt?",
      answer:
        "Most experts suggest building a small “Emergency Fund” first (e.g., $1,000) before you focus on paying off debt fast. This money can help you cover unexpected costs, such as a car repair, without borrowing more money.",
    },
    {
      question: "Why does the calculator ask for a Rate?",
      answer:
        "Most financial obligations carry a cost of credit or a percentage rate tied to the balance. The calculator needs this number to determine how much of your payment reduces the balance versus how much goes to the lender.",
    },
    {
      question: "What if the calculator says “Never”?",
      answer:
        "A “Never” result means your monthly payment is too low. Your payment likely falls below the monthly finance fees, so your balance grows instead of shrinks. Increase your minimum payment right away.",
    },
  ],
}
