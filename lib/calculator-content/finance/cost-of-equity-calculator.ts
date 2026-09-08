import type { CalculatorDetail } from "../types"

export const costOfEquityCalculator: CalculatorDetail = {
  metaDescription:
    "Free cost of equity calculator with two methods — CAPM and the Dividend Capitalization Model. Benchmark return, beta and market return give the required return shareholders expect.",
  whenToUse: [
    "The Cost of Equity shows the return shareholders expect from a company. This return rewards them for the risk of owning the stock. Debt has a fixed interest rate, but equity works differently. The cost of equity does not come as a fixed payment. It shows the return investors expect from their investment.",
    "For investors, this number works as a Required Rate of Return. If a stock does not give this return through growth or dividends, many investors avoid it. For companies, this number helps calculate the Weighted Average Cost of Capital, or WACC. Companies use WACC to decide if a new project or factory can bring enough profit.",
  ],
  method: {
    title: "The Formulas: Two Ways to Calculate",
    paragraphs: [
      "Our calculator uses two common methods to find Ke:",
    ],
    equations: [
      {
        label: "The CAPM Method (Capital Asset Pricing Model)",
        note: "This is the most common method, linking the stock's return to the overall market risk.",
        equation: "Ke = Rf + β(Rm − Rf)",
        terms: [
          {
            name: "Rf (Benchmark Return)",
            description:
              "The return on a “safe” investment, typically a 10-year government bond.",
          },
          {
            name: "β (Beta)",
            description:
              "A measure of volatility. A Beta of 1.5 means the stock moves 50% more than the market.",
          },
          {
            name: "Rm − Rf (Equity Risk Premium)",
            description:
              "The extra return investors demand for choosing stocks over bonds (historically 5-6%).",
          },
        ],
      },
      {
        label: "The Dividend Capitalization Model (DCM)",
        note: "Also known as the Gordon Growth Model, this is best for stable, dividend-paying utility or blue-chip stocks.",
        equation: "Ke = (D1/P0) + g",
        terms: [
          {
            name: "D1",
            description: "The dividend expected next year.",
          },
          {
            name: "P0",
            description: "The current stock price.",
          },
          {
            name: "g",
            description: "The annual dividend growth rate.",
          },
        ],
      },
    ],
  },
  parameters: {
    title: "Clarifying the Advanced Parameters",
    items: [
      {
        name: "Beta (β)",
        description:
          "You can find this on most financial sites (Yahoo Finance, Bloomberg). β < 1: Low risk such as Utilities, Consumer Staples. β > 1: High risk such as Tech, Biotech.",
      },
      {
        name: "Market Return (%)",
        description:
          "This is the average return the stock market has delivered over time. The S&P 500 is a common reference point. Most analysts use 10% as a standard starting figure.",
      },
      {
        name: "Dividend Growth (%)",
        description:
          "This is the rate at which a company increases its dividend each year. Be careful not to set this too high. Very few companies can sustain a growth rate above 10% for a long time.",
      },
    ],
  },
  factsTitle: "Global Investment Facts: Cost of Equity by Region",
  factsIntro:
    "The inputs for this calculator change across regions. The Risk-Free Rate (Rf) and Country Risk Premiums drive these changes.",
  facts: [
    {
      title: "United States (USA)",
      body: "Analysts use the US 10-Year Treasury Yield as the risk-free rate. The US market acts as a global reserve benchmark. US companies often show a lower cost of equity than emerging markets. A typical blue-chip stock shows a cost of equity near 7% to 9%.",
    },
    {
      title: "Canada (CAN)",
      body: "Canadian analysts use the Government of Canada 10-Year Bond yield. The TSX includes many energy and financial companies. These stocks often have betas close to 1.0. Many firms also pay higher dividends. Investors often use the Dividend Capitalization Model for valuation.",
    },
    {
      title: "United Kingdom (UK)",
      body: "Analysts use UK gilts as the risk-free rate. Many experts add a small country risk premium after Brexit. This step accounts for currency swings in the British pound. These factors push the cost of equity slightly higher for UK firms.",
    },
    {
      title: "Australia (AUS)",
      body: "Australia relies on the mining and banking sectors. The Franking Credit system affects dividend calculations. Companies pay tax before they give dividends. Investors receive tax credits from this system. Many investors accept a lower pre-tax return due to this benefit. This setup lowers the effective cost of equity for local firms.",
    },
    {
      title: "India (IND)",
      body: "India uses the 10-Year Government Bond as the risk-free rate. This rate often stays near 6% to 7%. The cost of equity in India often ranges from 12% to 16%. Investors ask for higher returns due to inflation and currency risks.",
    },
  ],
  faqs: [
    {
      question: "Why is Cost of Equity higher than Cost of Debt?",
      answer:
        "Equity carries more risk than debt. Bondholders receive payment first if a company fails. Shareholders receive payment last in that order. Investors demand a higher return (Ke) to accept that risk.",
    },
    {
      question: "Which method should I use: CAPM or Dividend Growth?",
      answer:
        "Use CAPM for companies without dividends. Google and Amazon fit this case. Use Dividend Growth for stable dividend companies. Coca-Cola and Duke Energy fit this case.",
    },
    {
      question: "What happens if the Cost of Equity increases?",
      answer:
        "A higher Ke lowers company value. The discount rate rises in valuation models. Future cash flows lose value in present terms.",
    },
    {
      question: "Can Beta be negative?",
      answer:
        "Yes, but it rarely happens. Some gold mining stocks show negative beta. These stocks often rise when markets fall.",
    },
    {
      question: "Is a higher Cost of Equity good or bad?",
      answer:
        "Investors prefer a higher cost of equity. They expect higher returns. Companies prefer a lower cost of equity. They raise capital at a lower cost.",
    },
  ],
}
