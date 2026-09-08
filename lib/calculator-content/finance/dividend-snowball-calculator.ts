import type { CalculatorDetail } from "../types"

export const dividendSnowballCalculator: CalculatorDetail = {
  metaDescription:
    "Free dividend snowball calculator — track how reinvested dividends, monthly contributions and yearly dividend increases turn a small cash flow into growing passive income, with yield on cost.",
  whenToUse: [
    "The Dividend Snowball is a popular investing metaphor. It describes the compounding power of dividend growth investing. Think of rolling a small snowball down a hill. At first, it moves slowly and stays small. But as it picks up more snow and speed, it grows bigger and bigger on its own.",
    "The same idea applies to your investments. Over time, your reinvested dividends start buying more shares than your monthly contributions do. This is where the snowball effect kicks in. Eventually, your portfolio grows large enough to generate passive income that covers your living expenses. You never need to sell a single share to get there.",
  ],
  method: {
    title: "The Math: How the Snowball Accelerates",
    paragraphs: [
      "Our calculator uses a compounding loop. It shows two main ways your investment grows:",
      "Capital Appreciation: The stock price rises over time. For example, it can grow about 7% each year. This growth increases your total portfolio value.",
      "Dividend Growth: The company raises its dividend per share. For example, it can grow about 8% each year. This part drives the snowball effect. Even when the stock price stays flat, your income still grows.",
    ],
    formula:
      "The Core Equation: Next Year's Income = (New Balance × Yield) × (1 + Dividend Growth Rate)",
  },
  parameters: {
    title: "Clarifying the Advanced Parameters",
    items: [
      {
        name: "Initial Yield (%)",
        description:
          "This shows the starting dividend yield of your portfolio. A high yield snowball often starts at 4% to 5%. Stocks like SCHD or O fit this range. A high growth snowball often starts at 1% to 2%. Stocks like AAPL or MSFT fit this style.",
      },
      {
        name: "Dividend Growth Rate (%)",
        description:
          "This shows how fast the dividend grows each year. It measures the average yearly increase in payouts. Dividend Aristocrats often grow dividends by 5% to 10% each year.",
      },
      {
        name: "Monthly Contribution",
        description:
          "This shows the new money you add each month. In the early years, this money drove most of the growth. In later years, dividends often become larger than your contributions.",
      },
      {
        name: "Yield on Cost (YOC)",
        description:
          "This shows your true income return over time. You buy a stock at $100 with a $3 dividend. The yield starts at 3%. After 10 years, the dividend rises to $6. Your yield on cost becomes 6%. The current stock price does not change this value.",
      },
    ],
  },
  factsTitle: "Global Investment Facts",
  facts: [
    {
      title: "United States (USA)",
      body: "The US market includes Dividend Aristocrats and Dividend Kings. These companies raise dividends for 25 years or more, and even 50 years or more. Investors often use ETFs like SCHD, also known as Schwab US Dividend Equity. This ETF gives a mix of around 3.5% yield and 10% to 12% yearly dividend growth. Many snowball investors prefer this balance.",
    },
    {
      title: "Canada (CAN)",
      body: "Canadian investors often build their snowball with large banks and telecom companies. These include Bell and Telus, along with the Big Five banks. The Tax-Free Savings Account (TFSA) helps investors grow wealth without taxes. This account supports long-term compounding and tax-free withdrawals.",
    },
    {
      title: "Australia (AUS)",
      body: "Australia strengthens the snowball effect with franking credits. Companies pay tax before they distribute dividends. Investors then receive a tax credit for that payment. This system raises the effective yield for many stocks. Companies like BHP and Commonwealth Bank often reach 6% to 8% yields. This setup helps compounding grow faster.",
    },
    {
      title: "United Kingdom (UK)",
      body: "The UK market on the LSE offers high starting yields. Many stocks pay 5% to 7% dividends. Energy companies like Shell and BP, along with British American Tobacco, lead this group. Dividend growth stays slower in many cases. Investors often rely more on reinvestment than growth for compounding.",
    },
    {
      title: "India (IND)",
      body: "Dividend investing continues to grow in India. PSU companies often give high dividend yields. Investors compare dividend yields with fixed deposit rates. Inflation often runs higher in India. A strong snowball needs high dividend growth to protect buying power against the rupee value.",
    },
  ],
  faqs: [
    {
      question: "What is the “Hourly Wage” metric?",
      answer:
        "This metric divides your yearly dividend income by 2,080 hours. This number comes from a standard work year of 40 hours per week across 52 weeks. It helps you see your income in simple terms. It answers one key question: how much does your portfolio earn per hour if it acts like a job?",
    },
    {
      question: "Can I build a snowball with ETFs?",
      answer:
        "Yes, you can build a dividend snowball with ETFs. Many investors prefer this approach because it adds safety and balance. ETFs like VIG and SCHD focus on companies with strong dividend history. These funds help maintain steady dividend growth over time.",
    },
    {
      question: "How does the tax rate affect the snowball?",
      answer:
        "Taxes reduce the money you can reinvest each year. A 15% tax on dividends lowers your reinvested income by the same amount. This reduction slows down compounding over time. Over many years, this effect can lower your total wealth by a large amount. Many investors use tax-advantaged accounts like Roth IRA, ISA, or TFSA to reduce this impact.",
    },
    {
      question: "When does the snowball “cross over”?",
      answer:
        "The crossover point happens when your dividend income becomes higher than your yearly expenses. At that stage, your investments can support your lifestyle. Many investors also track an earlier milestone. They reach it when dividends exceed their yearly contributions. At that point, the portfolio grows faster on its own.",
    },
  ],
}
