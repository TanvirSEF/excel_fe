import type { CalculatorDetail } from "../types"

export const livingOffDividendsCalculator: CalculatorDetail = {
  metaDescription:
    "Free living off dividends calculator — find the portfolio size and time to financial freedom for your target monthly income, with taxes, inflation and dividend growth factored in.",
  whenToUse: [
    "Many income investors aim to live off dividends. Your portfolio generates enough cash income to cover rent, food, and bills. It also covers your lifestyle costs through regular payouts. You do not sell any shares to fund your expenses.",
    "The 4% Rule asks you to sell assets for income. A dividend strategy keeps your main investment intact. This calculator helps you find your Freedom Number. It shows the portfolio size needed for your target monthly income.",
  ],
  method: {
    title: "The Logic: Calculating Your Freedom Number",
    paragraphs: [
      "The calculator uses a dynamic compounding model that accounts for the “Moving Goalpost” of inflation:",
      "The Inflation Factor: If you need $4,000/month today, in 20 years you might need $7,200/month to buy the same goods (assuming 3% inflation). Our calculator adjusts your target every year to ensure your future income retains its purchasing power.",
      "The Growth Engine: It calculates how fast your portfolio grows through three levers: Contributions — money you add from your job. Reinvestment — dividends buying more shares. Appreciation — the stock price going up.",
    ],
    equations: [
      {
        label: "The Base Equation",
        equation: "Portfolio Needed = Annual Expenses ÷ Dividend Yield × (1 − Tax Rate)",
      },
    ],
  },
  parameters: {
    title: "Clarifying the Advanced Parameters",
    items: [
      {
        name: "Target Monthly Income",
        description:
          "This is the amount of cash you need in your bank account every month to live freely.",
      },
      {
        name: "Tax Rate on Dividends",
        description:
          "This one matters a lot. In the US, qualified dividends get taxed at 0%, 15%, or 20%. So if you need $4,000 net per month and your tax rate is 15%, you actually need to generate around $4,700 in gross dividends to cover that.",
      },
      {
        name: "Dividend Growth Rate",
        description:
          "Think of this as the raise your portfolio gives you every year. If inflation runs at 3% but your stocks raise their dividend by 8%, your purchasing power grows over time.",
      },
      {
        name: "Inflation-Adjusted Goal",
        description:
          "Your lifestyle costs more in the future than it does today. This parameter shows you what your current $4,000 monthly budget will actually cost by the time you retire.",
      },
    ],
  },
  factsTitle: "Global Investment Facts: The “FIRE” Movement Worldwide",
  facts: [
    {
      title: "United States (USA)",
      body: "In the US, investors use a Roth IRA to grow tax free income. They withdraw qualified dividends without paying tax in retirement. Early retirees often use a brokerage account before age 59. US investors focus on Dividend Growth stocks to stay ahead of inflation.",
    },
    {
      title: "Canada (CAN)",
      body: "Canada offers the Eligible Dividend Tax Credit for dividend income. Many retirees earn up to 50,000 CAD with little tax. Investors must plan carefully with US stocks in a TFSA. The US charges a 15% withholding tax on those dividends. Investors often hold US stocks in an RRSP to avoid this tax.",
    },
    {
      title: "England or United Kingdom (UK)",
      body: "UK investors use an ISA (Individual Savings Account) for tax free growth. They can invest up to 20,000 pounds each year. All dividend income stays tax free inside the ISA. Investors focus on building a large balance for steady income.",
    },
    {
      title: "Australia (AUS)",
      body: "Australian retirees rely on Superannuation and the Age Pension. Some retirees build their own dividend income plans. The Franking Credit system boosts their dividend returns. Investors receive tax refunds if their tax rate stays at zero.",
    },
    {
      title: "India (IND)",
      body: "In India, investors add dividends to total income for tax. Higher income investors often pay higher tax on dividends. Many investors choose SWP (Systematic Withdrawal Plans) from mutual funds. This method can reduce tax and provide steady income.",
    },
  ],
  faqs: [
    {
      question: "How much money do I need to live off dividends?",
      answer:
        "A common rule uses the Rule of 25 or 30 for safety. If you need 40,000 dollars each year, you need about 1,000,000 to 1,200,000 dollars. This assumes a yield of 3 to 4 percent.",
    },
    {
      question: "Is a high yield above 8 percent better for faster retirement?",
      answer:
        "Not always. High yield stocks often come with weak or falling prices. Many investors call these yield traps. A 3 to 4 percent yield with steady growth works better over time.",
    },
    {
      question: "What happens during a market crash?",
      answer:
        "You still receive dividend income from your portfolio. You do not sell shares at low prices. You collect the income and wait for recovery.",
    },
    {
      question: "Should I reinvest dividends after retirement?",
      answer:
        "You take cash payouts once you reach your goal. You use this income to cover your expenses. You can reinvest extra cash to handle rising costs.",
    },
    {
      question: "Does this include Social Security or pension income?",
      answer:
        "This calculator focuses on your portfolio income only. You can subtract your pension from your target income. This step shows how much income your portfolio must provide.",
    },
  ],
}
