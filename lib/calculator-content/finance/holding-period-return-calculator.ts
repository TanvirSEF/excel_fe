import type { CalculatorDetail } from "../types"

export const holdingPeriodReturnCalculator: CalculatorDetail = {
  metaDescription:
    "Free holding period return calculator — initial and ending values, income and holding duration give your total HPR, annualized return and income yield.",
  whenToUse: [
    "Holding Period Return (HPR) is the total return you earn on an investment over the time you hold it. It goes beyond a simple price check by counting two sources of profit.",
    "Capital Appreciation: It is the increase in your asset’s value. You calculate it by subtracting the buy price from the sell price.",
    "Income: This covers any cash you receive during the holding period. This includes dividends, profit, and rent.",
    "HPR answers one important question: “How much did this investment actually make me?” It does not matter if you held it for 5 days or 50 years.",
  ],
  method: {
    title: "The Formulas: HPR vs. Annualized Return",
    paragraphs: [
      "Our calculator performs two distinct calculations to give you deeper insights.",
    ],
    equations: [
      {
        label: "The HPR Formula (Total Return)",
        note: "This measures absolute growth.",
        equation: "HPR = (Income + (End Value − Initial Value)) ÷ Initial Value × 100",
        terms: [
          {
            name: "Example",
            description:
              "You buy a stock for $100, sell it for $110, and earn $2 in dividends. Total Gain = $12. HPR = 12%.",
          },
        ],
      },
      {
        label: "The Annualized Return Formula (CAGR)",
        note: "This measures speed. Earning 12% in 1 month is amazing; earning 12% in 10 years is terrible. This formula standardizes the return to a yearly rate.",
        equation: "((1 + HPR)^(1/n) − 1) × 100",
        terms: [
          {
            name: "n",
            description: "Number of years held.",
          },
        ],
      },
    ],
  },
  parameters: {
    title: "Clarifying the Advanced Parameters",
    items: [
      {
        name: "Income Received",
        description:
          "Do not skip this field. For landlords, income can make up 50% or more of the total return.",
      },
      {
        name: "Holding Period",
        description:
          "You can switch between Days, Months, and Years. This is useful for day traders who need to annualize daily gains. It also helps real estate investors who sell properties within 6 to 9 months.",
      },
      {
        name: "Annualized Return",
        description:
          "Use this number to compare different investments on equal footing. For example, Asset A gave 10% in 6 months and Asset B gave 15% in 2 years. Asset A actually performed better each year, at about 21% compared to 7.2%.",
      },
    ],
  },
  factsTitle: "Global Investment Facts: Return Metrics by Region",
  facts: [
    {
      title: "United States (USA)",
      body: "In the US, HPR is the basis for Capital Gains Tax. Short-term holdings under one year are taxed as regular income. Long-term holdings over one year get lower tax rates of 0%, 15%, or 20%. Many US investors calculate HPR to decide if waiting a few more months for the one-year mark is worth the tax savings.",
    },
    {
      title: "United Kingdom (UK)",
      body: "UK investors with an ISA (Individual Savings Account) pay close attention to HPR because all returns are tax-free. There is no tax drag, so the gross HPR from our tool is exactly what the investor takes home.",
    },
    {
      title: "Canada (CAN)",
      body: "Canadian investors need to account for the 50% Inclusion Rate on capital gains. Dividend income follows different tax rules through the gross-up and credit system. A high HPR from dividends is often more tax-efficient than the same HPR from price gains, unless the investment is held in a TFSA.",
    },
    {
      title: "Australia (AUS)",
      body: "Australian property investors use HPR to measure the success of negative gearing. A property may produce a monthly loss, but a strong capital gain at the end can still result in a positive HPR. The annual losses also provide useful tax breaks along the way.",
    },
    {
      title: "India (IND)",
      body: "In India, HPR is very important for mutual fund investors. An exit load, which is a penalty for selling early, usually applies to holdings under one year. Indian investors use this calculator to check if their HPR is high enough to cover the exit load of around 1% and the Short Term Capital Gains tax of 20%.",
    },
  ],
  faqs: [
    {
      question: "Can HPR be negative?",
      answer:
        "Yes, it can. If your ending value plus income is less than your initial investment, your HPR will be negative. This means you lost money on the investment.",
    },
    {
      question: "Why is Annualized Return different from HPR?",
      answer:
        "HPR is your total return over the full holding period. Annualized return is the yearly average of that return. If you hold an asset for exactly one year, both numbers will be the same. If you hold for 5 years and earn 50%, your annualized return works out to about 8.4% per year.",
    },
    {
      question: "Does this include inflation?",
      answer:
        "No, the calculator shows your nominal return. To find your real return, subtract the inflation rate from your annualized return.",
    },
    {
      question: "How do I calculate HPR for a short trade?",
      answer:
        "Select “Days” from the dropdown menu. If you made 1% in 2 days, the calculator will show you the annualized return that speed implies. Keep in mind that sustaining that pace over time is very difficult.",
    },
    {
      question: "Does income include reinvested dividends?",
      answer:
        "If you reinvested your dividends, they are part of your cost basis for tax purposes. For simple performance tracking, you can add them to the ending value or income field to see your total growth.",
    },
  ],
}
