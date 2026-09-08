import type { CalculatorDetail } from "../types"

export const dividendSnowballCalculator: CalculatorDetail = {
  metaDescription:
    "Free dividend snowball calculator — project passive income growth with monthly contributions, dividend increases and tax. Year-by-year timeline and yield on cost.",
  formula: "Next Year's Income = (New Balance × Yield) × (1 + Dividend Growth Rate)",
  whenToUse: [
    "The Dividend Snowball describes the compounding power of dividend growth investing. Like rolling a snowball down a hill, your reinvested dividends start buying more shares than your contributions do — eventually your portfolio generates passive income that covers your living expenses.",
    "Over time, your reinvested dividends start buying more shares than your monthly contributions do. This is where the snowball effect kicks in — you never need to sell a single share to get there.",
  ],
  howToUse: [
    "Enter your starting portfolio value, initial dividend yield and tax rate.",
    "Add your monthly contribution and the years you plan to invest.",
    "Set the dividend growth rate (5–10% for Dividend Aristocrats) and price appreciation (7–8% for the S&P 500).",
    "Read the future annual income, equivalent hourly wage, yield on cost and year-by-year timeline.",
  ],
  example: {
    title: "Example: $10k + $500/mo over 20 years",
    body: "Starting at 3.5% yield with 8% dividend growth and 7% price growth (15% tax): the portfolio reaches $465,621 and generates $19,629/yr — a 15.10% yield on cost. Press Reset to reproduce.",
  },
  excelNote: "Track shares, div/share and price in separate columns: shares += net_div/price, then price and div/share grow by their rates.",
  method: {
    title: "How the snowball accelerates — two growth engines",
    paragraphs: [
      "Capital appreciation: the stock price rises about 7% each year, increasing your total portfolio value. Dividend growth: the company raises its dividend per share — about 8% each year. This part drives the snowball effect: even when the stock price stays flat, your income still grows.",
      "The calculator tracks shares, dividend per share and price separately. Each year: net dividends and contributions buy more shares, then price and dividend per share both grow. This mirrors real dividend-growth portfolios like SCHD or Dividend Aristocrats.",
      "The hourly wage metric divides your yearly dividend income by 2,080 hours (40 hours/week × 52 weeks) — it answers: how much does your portfolio earn per hour if it acts like a job?",
    ],
    formula: "Hourly Wage = Annual Income ÷ 2,080",
  },
  facts: [
    {
      title: "1. US Dividend Aristocrats & Kings",
      body: "The US market includes companies that raise dividends for 25+ years (Aristocrats) and even 50+ years (Kings). ETFs like SCHD give around 3.5% yield with 10–12% yearly dividend growth — many snowball investors prefer this balance.",
    },
    {
      title: "2. Global snowball advantages",
      body: "Canada's TFSA grows wealth tax-free. Australia's franking credits raise effective yields to 6–8% (BHP, Commonwealth Bank). The UK's FTSE 100 offers 5–7% starting yields from Shell, BP and British American Tobacco. India's PSU companies give high yields but need high dividend growth to fight inflation.",
    },
    {
      title: "3. The crossover point",
      body: "The crossover happens when your dividend income exceeds your yearly expenses — your investments can support your lifestyle. Many investors also track an earlier milestone: when dividends exceed yearly contributions, the portfolio grows faster on its own.",
    },
  ],
  useCases: [
    {
      title: "Financial independence planning",
      body: "Set a target monthly income, then adjust contributions, yield and years to find the combination that reaches it. The hourly wage metric shows how close you are to replacing a salary.",
    },
    {
      title: "Comparing yield vs growth strategies",
      body: "High-yield snowballs (4–5%, like SCHD or O) vs high-growth snowballs (1–2%, like AAPL or MSFT). Run both to see which fits your timeline better.",
    },
    {
      title: "Visualizing the crossover",
      body: "The year-by-year table shows exactly when dividend income overtakes your contributions — the point where the snowball starts rolling on its own.",
    },
  ],
  faqs: [
    {
      question: "What is the hourly wage metric?",
      answer:
        "This divides your yearly dividend income by 2,080 hours — a standard work year of 40 hours/week across 52 weeks. It shows how much your portfolio earns per hour if it acts like a job.",
    },
    {
      question: "Can I build a snowball with ETFs?",
      answer:
        "Yes — many investors prefer ETFs for safety and balance. VIG and SCHD focus on companies with strong dividend history and help maintain steady dividend growth over time.",
    },
    {
      question: "How does the tax rate affect the snowball?",
      answer:
        "Taxes reduce the money you can reinvest each year. A 15% tax on dividends lowers your reinvested income by the same amount, slowing compounding. Over many years this can lower your total wealth significantly. Use tax-advantaged accounts like Roth IRA, ISA or TFSA to reduce the impact.",
    },
    {
      question: "When does the snowball cross over?",
      answer:
        "The crossover point happens when your dividend income becomes higher than your yearly expenses — your investments can support your lifestyle. Many investors also track an earlier milestone: when dividends exceed their yearly contributions, the portfolio grows faster on its own.",
    },
  ],
}
