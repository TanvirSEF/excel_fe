import type { CalculatorDetail } from "../types"

export const retirementRateOfReturnCalculator: CalculatorDetail = {
  metaDescription:
    "Free retirement rate of return calculator — current age, savings, step-up contributions and expected returns project your corpus, purchasing power and 4% monthly income.",
  whenToUse: [
    "The retirement rate of return is the yearly percentage your investments earn. It is what makes your money grow. Your savings rate matters, but the rate of return does most of the work over many years.",
    "Even a small difference in this rate can change your outcome by a lot. For example, earning 6% instead of 8% over 30 years can mean a difference of hundreds of thousands of dollars. This calculator lets you test different return rates. You can see if your current plan is on track to meet your retirement goals.",
  ],
  method: {
    title: "The Formulas and Logic Used",
    paragraphs: [
      "This calculator uses a future value model that accounts for compound growth, changing contributions, and inflation:",
      "Step-Up Contributions: Most people earn more as their careers progress. The “Annual Step-Up” feature increases your monthly contribution by a fixed percentage each year to reflect salary growth and higher savings.",
    ],
    equations: [
      {
        label: "Compound Growth",
        note: "The calculator compounds returns monthly to match how most savings accounts and investment portfolios grow.",
        equation: "Balance month = (Previous Balance + Contribution) × (1 + Monthly ROI)",
      },
      {
        label: "Inflation Adjustment",
        note: "The calculator also adjusts your future savings for inflation so you can see their real purchasing power.",
        equation: "Real Value = Future Value ÷ (1 + Inflation Rate)^Years",
        terms: [
          {
            name: "Why",
            description:
              "Money loses value over time because of inflation. For example, $1 million in 30 years will not buy the same amount of goods and services that it can buy today — this adjustment gives you a more realistic estimate of your future savings.",
          },
        ],
      },
    ],
  },
  parameters: {
    title: "Clarifying the Advanced Parameters",
    items: [
      {
        name: "Annual Step-Up (%)",
        description:
          "Many people skip this field, but it makes a big difference. If you get a 3% raise at work and add that extra amount to your retirement contributions, you can reach your goal much sooner.",
      },
      {
        name: "Expected Rate of Return",
        description:
          "Conservative: 4-5% (Bonds and Cash). Moderate: 6-8% (Balanced Portfolio). Aggressive: 9-10% (Equity Heavy, S&P 500 historical average).",
      },
      {
        name: "Wealth Multiplier",
        description:
          "This number shows you the power of time in the market. A 3.0x multiplier means that for every $1 you put in, the market adds $2 in growth. Your money ends up tripling in total.",
      },
    ],
  },
  factsTitle: "Global Retirement Systems: Facts & Benchmarks",
  facts: [
    {
      title: "United States (USA)",
      body: "The 401(k) and IRA are the main retirement tools in the US — the stock market has delivered an inflation-adjusted return of about 7% over time. Many US investors use the 4% Rule to figure out how much they need to save — our calculator estimates this target number for you.",
    },
    {
      title: "United Kingdom (UK)",
      body: "UK pension pots get tax relief at the source — which helps them grow faster. The State Pension gives you a starting base, but a private pension like a SIPP is important for a comfortable retirement. UK calculators often use lower growth estimates of around 5-6%. This is because traditional UK pension funds hold more bonds than stocks.",
    },
    {
      title: "Australia (AUS)",
      body: "Australia requires all employers to contribute to your Super fund. The guarantee rate is currently rising to 12%. These funds are often invested in local stocks and banking shares, which tend to pay strong dividends. This can boost your overall rate of return gradually.",
    },
    {
      title: "Canada (CAN)",
      body: "Canadians use the RRSP and TFSA to save for retirement. The TFSA is a great option for high-growth investments. You do not pay capital gains tax when you withdraw from it, so your effective return ends up being higher.",
    },
    {
      title: "India (IND)",
      body: "In India, the EPF and NPS are the two main retirement options. In the past, many Indians relied on Fixed Deposits that paid 7-8%. But with inflation running at 5-6%, the net gain was quite small. Now, more Indian retirees are turning to Equity Mutual Funds through SIPs. These target returns of 12-15% to help build a bigger retirement fund.",
    },
  ],
  faqs: [
    {
      question: "What is a realistic rate of return for retirement?",
      answer:
        "A common benchmark is 7% to 8% — based on a balanced mix of stocks and bonds. Planning for 12% or more can lead to under-saving. If the market performs poorly, you may not have enough to retire comfortably.",
    },
    {
      question: "How much do I need to retire?",
      answer:
        "Many financial experts recommend saving about 25 times your yearly expenses. For example, if you spend $40,000 a year, you need about $1 million saved. Check the Monthly Income result in our calculator to see if you are on track.",
    },
    {
      question: "Why does the purchasing power number matter?",
      answer:
        "Inflation reduces what your money can buy. Our calculator might show $2 million in 30 years — but that amount may only buy what $800,000 buys today. Always base your retirement plan on the purchasing power number to stay safe.",
    },
    {
      question: "What is the step-up feature?",
      answer:
        "This feature assumes you raise your savings as your income grows. It is the most effective way to catch up if you started saving later than you wanted to.",
    },
  ],
}
