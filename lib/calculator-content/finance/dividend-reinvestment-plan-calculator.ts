import type { CalculatorDetail } from "../types"

export const dividendReinvestmentPlanCalculator: CalculatorDetail = {
  metaDescription:
    "Free Dividend Reinvestment Plan (DRIP) calculator — see how reinvesting dividends with yearly contributions, stock price growth and tax builds wealth over time, with yield on cost.",
  whenToUse: [
    "A Dividend Reinvestment Plan, or DRIP, is a simple investment strategy that helps you buy more shares with your dividend payments. Instead of taking cash from the company, you use that money to purchase more shares of the same company.",
    "Many long-term investors use this method to grow their money. As you own more shares, you earn more dividends. Those extra dividends help you buy even more shares. This cycle keeps your investment growing faster.",
    "This calculator helps you measure that growth. It also includes stock price growth and taxes in the result.",
  ],
  method: {
    title: "The Math of Compounding: Formulas Used",
    paragraphs: [
      "The calculator uses a year-by-year compounding method to give accurate results:",
    ],
    equations: [
      {
        label: "Annual Dividend Payout",
        equation: "Portfolio Balance × Dividend Yield = Gross Dividend",
      },
      {
        label: "Tax Deduction",
        equation: "Gross Dividend × (1 − Tax Rate) = Net Dividend",
      },
      {
        label: "End of Year Balance",
        equation:
          "(Current Balance + Net Dividend + Annual Addition) × (1 + Price Growth) = New Balance",
      },
      {
        label: "Yield on Cost (YOC)",
        note: "This measures your return based on the actual dollars you invested from your pocket.",
        equation: "Final Annual Income ÷ Total Personal Contributions = YOC",
      },
    ],
  },
  parameters: {
    title: "Clarifying the Advanced Parameters",
    items: [
      {
        name: "Annual Addition",
        description: "This is the extra money you invest each year from your salary.",
      },
      {
        name: "Price Appreciation",
        description:
          "This shows how much the stock price may grow each year. The S&P 500 often grows around 7% to 8% yearly.",
      },
      {
        name: "Tax Rate",
        description:
          "Your dividend tax depends on your account type. A 401(k) or IRA works differently from a taxable brokerage account. Many people pay around 15% tax on dividends.",
      },
      {
        name: "Yield on Cost (YOC)",
        description:
          "Income investors often track this number. It shows your dividend yield based on the money you invested. After many years of reinvestment, this number can grow to 20% to 50%.",
      },
    ],
  },
  factsTitle: "Global Investment Facts: Dividends by Region",
  facts: [
    {
      title: "United States (USA)",
      body: "The US market is well known for Dividend Aristocrats. These companies raise their dividends for at least 25 years in a row. Standard & Poor's says dividends make up about 32% of the total return of the S&P 500.",
    },
    {
      title: "Canada (CAN)",
      body: "Canada attracts many income investors, especially in banking and energy. The Dividend Tax Credit helps Canadian residents pay less tax on dividend income than on interest income. This can help when you enter your tax rate.",
    },
    {
      title: "England / United Kingdom (UK)",
      body: "The UK stock market, especially the FTSE 100, offers high average dividend yields. These yields often go above 4%. Many UK investors use DRIPs to protect their money from inflation over time.",
    },
    {
      title: "Australia (AUS)",
      body: "Australia uses a system called Franking Credits. This system helps investors avoid double taxation. Shareholders can claim credit for the tax that the company already pays on its profits. This increases the net dividend for Australian residents.",
    },
    {
      title: "India (IND)",
      body: "Dividend investing in India has changed in recent years. After the Finance Act 2020, investors now pay tax on dividends based on their income tax slab. Even so, many investors still trust blue-chip companies for steady growth and stability.",
    },
  ],
  faqs: [
    {
      question: "Is It Better to Reinvest Dividends or Take the Cash?",
      answer:
        "If you do not need the money for daily expenses, reinvesting usually works better. It helps you buy more shares when prices drop. This method also supports steady growth in your portfolio over time.",
    },
    {
      question: "Can I Reinvest Dividends with Any Stock?",
      answer:
        "Most major brokerages let you turn on Auto-Reinvest for dividend-paying stocks. Some companies also offer Direct DRIPs. These plans let you buy shares straight from the company.",
    },
    {
      question: "Does Reinvesting Dividends Help During a Market Crash?",
      answer:
        "Yes, it helps. When stock prices fall, your dividend money buys more shares at lower prices. This helps your portfolio recover faster when the market improves again.",
    },
    {
      question: "What Is a Safe Dividend Yield?",
      answer:
        "Many investors see a dividend yield between 2% and 5% as a safer range. Yields above 8% to 10% can be risky. A very high yield may show that the company has financial problems and may reduce its dividend soon.",
    },
    {
      question: "Do I Still Pay Taxes If I Reinvest Dividends?",
      answer:
        "Yes, in a regular brokerage account, you still pay taxes. Tax authorities count dividends as income, even after reinvestment. In accounts like an IRA or ISA, you may delay taxes or avoid them, based on the account rules.",
    },
  ],
}
