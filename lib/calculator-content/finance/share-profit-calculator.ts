import type { CalculatorDetail } from "../types"

export const shareProfitCalculator: CalculatorDetail = {
  metaDescription:
    "Free share profit calculator with commissions and capital gains tax — net profit, ROI, break-even price and total fees for any stock trade.",
  whenToUse: [
    "A share profit calculator helps investors find the real profit from a trade. It shows the difference between price changes and the money you actually keep. Even if a stock price goes up, your final profit can be lower because of brokerage fees, selling charges, and taxes.",
    "This tool helps you check different selling prices and plan better exit points. It also helps you find your break-even point, where your selling amount covers all costs. Both short-term traders and long-term investors use it to make better decisions based on actual returns, not only market prices.",
  ],
  method: {
    title: "The Mathematical Framework: Formulas and Equations",
    paragraphs: [
      "Our calculator uses simple financial formulas to give you accurate results. These formulas show your total cost, final profit, and ROI. Here is how each one works:",
    ],
    equations: [
      {
        label: "Total Cost Basis",
        note: "This represents your total initial outlay.",
        equation: "(Shares × Purchase Price) + Buy Commission = Total Cost",
      },
      {
        label: "Gross Proceeds",
        note: "The raw value of your position at the time of sale.",
        equation: "Shares × Selling Price = Gross Proceeds",
      },
      {
        label: "Net Revenue (Exit Value)",
        note: "What remains after paying your broker to close the position.",
        equation: "Gross Proceeds − Sell Commission = Net Revenue",
      },
      {
        label: "Tax Liability",
        note: "The amount owed to the government based on profit.",
        equation: "(Net Revenue − Total Cost) × (Tax Rate ÷ 100) = Tax Amount",
      },
      {
        label: "Net Profit/Loss",
        note: "Your final realized gain.",
        equation: "(Net Revenue − Total Cost) − Tax Amount = Net Profit",
      },
      {
        label: "Return on Investment (ROI)",
        note: "The percentage efficiency of your trade.",
        equation: "(Net Profit ÷ Total Cost) × 100 = ROI%",
      },
    ],
  },
  parameters: {
    title: "Clarifying the Parameters",
    intro:
      "To get 100% accurate results, make sure your values match these definitions. Each input should reflect your actual trade details correctly.",
    items: [
      {
        name: "Shares Quantity",
        description: "The total number of shares you own.",
      },
      {
        name: "Buy Price",
        description:
          "The average price you paid for each share, including any slippage.",
      },
      {
        name: "Sell Price",
        description:
          "The target price or the actual price at which you sell your shares.",
      },
      {
        name: "Tax Rate",
        description: "The capital gains tax rate that applies to your profit.",
      },
      {
        name: "Commissions",
        description:
          "Fixed fees or percentage-based charges your broker applies for buying or selling shares, such as with Zerodha, Charles Schwab, or Plus500.",
      },
    ],
  },
  factsTitle: "Global Investment Insights: Facts and Data",
  factsIntro:
    "Tax rules for stock profits differ from country to country. Here is how five major markets handle capital gains.",
  facts: [
    {
      title: "The Impact of Holding Periods",
      body: "In the US and Australia, holding stocks longer reduces your tax bill. In the US, selling after one year drops your tax rate to 0%, 15%, or 20%. Without that, you pay your regular income tax rate, which can go up to 37%. Australia gives a 50% tax discount for assets held over a year.",
    },
    {
      title: "Thresholds and Allowances",
      body: "The UK and India protect small investors with tax-free limits. In the UK, you can earn up to £3,000 in capital gains without paying tax. In India, long-term gains up to ₹1.25 lakh per year are tax-free. Any profit above that limit gets taxed at a flat 12.5%.",
    },
    {
      title: "The Inclusion Rate Model",
      body: "Canada handles stock profits differently from most countries. The government adds a portion of your gain to your regular taxable income. For individuals, that portion is 50% for most gains. But for gains above $250,000 in one year, the rate rises to 66.67%.",
    },
  ],
  factsTable: {
    title: "Regional Facts Summary Table",
    headers: ["Country", "Major Authority", "Key Insight"],
    rows: [
      ["USA", "IRS", "Long-term gains are taxed at 0, 15, or 20%"],
      ["UK/ England", "HMRC", "£3,000 annual tax-free allowance"],
      ["Australia", "ATO", "50% discount for assets held over 12 months"],
      ["Canada", "CRA", "50% to 66.67% inclusion rate on gains"],
      ["India", "Income Tax Dept", "20% STCG; 12.5% LTCG over ₹1.25 Lakh"],
    ],
  },
  faqs: [
    {
      question: "What if my result shows a net loss?",
      answer:
        "A net loss means you sold your shares for less than your total cost. In many countries, this is called a capital loss. You may use it to offset other capital gains and reduce your total tax for the year.",
    },
    {
      question: "Does this calculator work for crypto?",
      answer:
        "Yes, the basic logic is the same for cryptocurrency trades. You still compare your buy price and sell price. However, tax rules for crypto are different in each country, so check your local tax laws.",
    },
    {
      question: "Is the ROI shown before or after tax?",
      answer:
        "This calculator shows post-tax ROI. It helps you see how much money you actually gained after paying fees and taxes.",
    },
    {
      question: "Why do I enter commissions manually?",
      answer:
        "Each broker has a different fee structure. Some charge no commission, while others charge a fixed fee or a percentage of the trade value. Manual entry makes sure your net profit result is as accurate as possible.",
    },
    {
      question: "Does the sale price include dividends?",
      answer:
        "No, it does not. The sell price only reflects the market value of the share. Dividends are usually counted as separate income and may have separate taxes.",
    },
  ],
}
