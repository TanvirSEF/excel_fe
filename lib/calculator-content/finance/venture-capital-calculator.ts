import type { CalculatorDetail } from "../types"

export const ventureCapitalCalculator: CalculatorDetail = {
  metaDescription:
    "Free venture capital calculator using the VC Method — investment, target multiple, exit value and dilution give post-money valuation, required ownership and implied IRR.",
  whenToUse: [
    "A Venture Capital Calculator is a financial modeling tool. It helps you estimate a startup’s current value based on its projected future exit value. It works differently from discounted cash flow (DCF) models used for mature companies. The VC Method starts from the exit and works backward.",
    "Venture capitalists usually look for a specific return multiple. This could be 10x or 30x to offset the high risk of early-stage investing. The calculator tells you the maximum price an investor should pay today. This helps them hit their target return in the future. It also factors in dilution from future funding rounds like Series B and C.",
  ],
  method: {
    title: "The Formulas and Logic Used (The VC Method)",
    paragraphs: [
      "The calculator follows a step-by-step reverse-engineering process:",
      "Anticipated Exit Value: The estimated price the company will sell for (M&A or IPO).",
      "Target Final Ownership: The stake needed at the time of exit to reach the target multiple.",
    ],
    equations: [
      {
        label: "Ownership at Exit",
        equation: "(Investment × Target Multiple) ÷ Exit Value = Ownership at Exit",
      },
      {
        label: "Adjusting for Dilution",
        note: "Since future rounds will shrink the investor’s stake, we must “size up” the initial stake.",
        equation: "Ownership at Exit ÷ (1 − Total Dilution) = Current Required Ownership",
      },
      {
        label: "Post-Money Valuation",
        equation: "Investment Amount ÷ Current Required Ownership = Post-Money Valuation",
      },
      {
        label: "Pre-Money Valuation",
        equation: "Post-Money Valuation − Investment Amount = Pre-Money Valuation",
      },
    ],
  },
  parameters: {
    title: "Clarifying the Advanced Parameters",
    items: [
      {
        name: "Target Multiple",
        description:
          "Early-stage VCs often target a 10x to 30x return. This helps them offset the 90% failure rate of startups.",
      },
      {
        name: "Estimated Dilution",
        description:
          "Future funding rounds can shrink your ownership stake. For example, your 10% stake might drop to 7% after a new raise. Entering a dilution forecast of 20-30% helps you buy enough equity today.",
      },
      {
        name: "Implied IRR",
        description:
          "This shows the Internal Rate of Return based on your multiple and time horizon. For example, a 10x return over 7 years gives you roughly a 39% IRR.",
      },
    ],
  },
  factsTitle: "Global Venture Capital Facts",
  facts: [
    {
      title: "United States (USA)",
      body: "Silicon Valley in the USA still leads the world in venture capital activity. According to PitchBook, US seed rounds have seen valuations climb steadily. Post-money caps for AI startups now often exceed $10M. US investors also prioritize liquidation preferences and anti-dilution clauses. Our calculator helps you model both of these factors with ease.",
    },
    {
      title: "Canada (CAN)",
      body: "Canada’s VC scene leans heavily toward impact investing and CleanTech. Data from the CVCA shows that Canadian VCs hold investments longer than their US counterparts. Their average exit timeline runs between 8 to 10 years. This makes the IRR calculation in our tool especially useful for Canadian portfolio managers.",
    },
    {
      title: "England/United Kingdom (UK)",
      body: "The UK offers unique tax-advantaged schemes like SEIS and EIS. These schemes give investors up to 50% tax relief upfront. This effectively lowers the investment amount you need to enter in our calculator. It also significantly boosts the real-world ROI for British angel investors.",
    },
    {
      title: "Australia (AUS)",
      body: "Australian VC is growing fast in the Fintech and SaaS sectors. Australian VCs tend to favor capital efficiency in their investments. They prefer startups that need less future funding to reach an exit. This approach keeps the pre-money valuation higher for everyone involved.",
    },
    {
      title: "India (IND)",
      body: "India holds the third-largest startup ecosystem in the world. After the 2024 budget, the government removed the Angel Tax, which made it easier for domestic investors to fund startups. Indian VCs often deal with high-volume, lower-multiple exits. This makes the Target Multiple field in our tool a key setting for Indian seed funds.",
    },
  ],
  faqs: [
    {
      question: "What is the difference between Pre-Money and Post-Money valuation?",
      answer:
        "Pre-Money is the value of a company before it receives any investment. Post-Money is the value after the cash enters the company. You get it by adding the investment amount to the Pre-Money valuation.",
    },
    {
      question: "Why is dilution so important in the VC Method?",
      answer:
        "Ignoring dilution causes you to underestimate the ownership you need today. For example, if you need 10% at exit and expect 50% dilution, you need to buy 20% today.",
    },
    {
      question: "What is a “standard” VC return multiple?",
      answer:
        "Seed investors usually target a 20x to 30x return. Series A investors typically aim for 10x to 15x. Later-stage PE firms tend to target a 3x to 5x return.",
    },
    {
      question: "How does “Years to Exit” affect IRR?",
      answer:
        "A longer exit timeline lowers your IRR. A 10x return in 3 years gives you a 115% IRR. That same 10x return over 10 years drops your IRR to only 26%.",
    },
    {
      question: "Can founders use this calculator?",
      answer:
        "Yes! Founders can use it to check if their valuation expectations make sense. It helps them see what an investor needs to hit their fund’s return goals.",
    },
  ],
}
