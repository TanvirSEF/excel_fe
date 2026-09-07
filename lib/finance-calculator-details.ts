import type { StatsCalculatorDetail } from "@/lib/stats-calculator-details"

export type FinanceSlug =
  | "share-profit-calculator"
  | "dividend-reinvestment-plan-calculator"
  | "dividend-snowball-calculator"
  | "living-off-dividends-calculator"
  | "cost-of-equity-calculator"
  | "rental-property-roi-calculator"
  | "cash-on-cash-roi-calculator"
  | "solar-roi-calculator"
  | "marketing-roi-calculator"
  | "enterprise-seo-roi-calculator"
  | "b2b-roi-calculator"
  | "venture-capital-calculator"
  | "irr-calculator"
  | "accounting-rate-of-return-calculator"
  | "holding-period-return-calculator"
  | "retirement-rate-of-return-calculator"
  | "savings-withdrawal-calculator"

export const FINANCE_DETAILS: Record<FinanceSlug, StatsCalculatorDetail> = {
  "share-profit-calculator": {
    metaDescription:
      "Free share profit calculator — enter buy price, sell price, shares and fees to see your total stock profit, ROI percentage and break-even price.",
    formula: "Profit = (Sell − Buy) × Shares − Fees",
    whenToUse: [
      "After closing any stock or ETF position — one glance tells you what the trade actually earned after fees.",
      "Before selling: the break-even price shows the minimum price that covers your costs.",
    ],
    howToUse: [
      "Enter the price you bought at and the price you sold at.",
      "Enter the number of shares and any brokerage fees.",
      "Read your profit, ROI percentage and the break-even sell price.",
    ],
    example: {
      title: "Example: 100 shares bought at $50, sold at $65",
      body: "(65 − 50) × 100 = $1,500 profit — a 30% return on the $5,000 cost. Press Reset to reproduce it.",
    },
    excelNote: "In Excel: =(Sell−Buy)*Shares−Fees for profit, or =IRR() for multi-year trades.",
  },
  "dividend-reinvestment-plan-calculator": {
    metaDescription:
      "Free dividend reinvestment (DRIP) calculator — project portfolio value and dividend income year by year with contributions, dividend growth and price growth.",
    formula: "Each year: buy more shares with dividends → income = shares × dividend/share",
    whenToUse: [
      "To see the full compounding effect of automatically reinvesting dividends instead of spending them.",
      "When comparing a dividend-growth portfolio against just holding cash or a plain index fund.",
    ],
    howToUse: [
      "Enter your initial investment and the portfolio's starting dividend yield.",
      "Add your annual contribution, dividend growth rate and expected price growth.",
      "Watch the year-by-year table — value and income accelerate as dividends buy more shares.",
    ],
    example: {
      title: "Example: $10,000 at 4%, adding $1,000/yr",
      body: "With 5% dividend growth and 3% price growth, the portfolio reaches roughly $39,200 in 10 years with dividends alone contributing over $4,900.",
    },
  },
  "dividend-snowball-calculator": {
    metaDescription:
      "Free dividend snowball calculator — watch your passive income roll from small earnings into larger ones year after year, with a full income timeline.",
    formula: "Reinvested dividends earn their own dividends — income compounds on itself",
    whenToUse: [
      "To visualize why dividend income stays small for years and then suddenly accelerates.",
      "For planning how long it takes for passive income to reach a meaningful monthly amount.",
    ],
    howToUse: [
      "Enter your starting investment, yield and contributions — like any DRIP plan.",
      "Give dividend growth a realistic 5–7% for dividend-growth portfolios.",
      "Follow the income timeline — the multiple between year 1 and the final year is the snowball effect.",
    ],
    example: {
      title: "Example: $10,000 at 4% with 6% dividend growth",
      body: "Over 15 years the annual income grows several times over — the same money quietly working harder every single year.",
    },
  },
  "living-off-dividends-calculator": {
    metaDescription:
      "Free living off dividends calculator — find the exact portfolio size you need to cover your monthly expenses entirely with dividend income.",
    formula: "Goal portfolio = (Monthly expenses × 12) ÷ Dividend yield",
    whenToUse: [
      "To turn your monthly budget into one clear target number for financial independence.",
      "To check whether your current savings already generate enough income to quit.",
    ],
    howToUse: [
      "Enter your realistic monthly expenses in retirement.",
      "Enter your portfolio's dividend yield — 3–4% is sustainable for most portfolios.",
      "See the goal portfolio, your income today and how far you still have to go.",
    ],
    example: {
      title: "Example: $4,000 per month at a 4% yield",
      body: "$48,000 of annual expenses ÷ 0.04 = a $1,200,000 portfolio. Press Reset to verify.",
    },
  },
  "cost-of-equity-calculator": {
    metaDescription:
      "Free cost of equity calculator using CAPM — risk-free rate, beta and market return give the return investors demand for holding a stock.",
    formula: "Ke = rf + β × (rm − rf)",
    whenToUse: [
      "When valuing a company with DCF — the cost of equity is the discount rate for its cash flows.",
      "To judge whether a stock's expected return beats the return its risk demands.",
    ],
    howToUse: [
      "Enter the risk-free rate — usually the current 10-year Treasury yield.",
      "Enter the stock's beta (over 1 means more volatile than the market).",
      "Enter the expected market return — long-term averages run 8–10%.",
    ],
    example: {
      title: "Example: the classic CAPM case",
      body: "rf 4.2%, beta 1.35, market return 9.7% → Ke = 4.2% + 1.35 × 5.5% = 11.625%.",
    },
    excelNote: "In Excel: =rf + beta*(rm - rf) — or look up beta on any stock data page.",
  },
  "rental-property-roi-calculator": {
    metaDescription:
      "Free rental property ROI calculator — rent, taxes, insurance, maintenance and vacancy give you the cap rate, NOI and gross yield of the deal.",
    formula: "Cap rate = Net operating income ÷ Purchase price",
    whenToUse: [
      "To compare rental deals on equal footing — the cap rate strips out financing effects.",
      "Before offering: check whether the rent realistically covers taxes, insurance and upkeep.",
    ],
    howToUse: [
      "Enter the purchase price and expected monthly rent.",
      "Add annual property tax, insurance and typical maintenance and vacancy allowances.",
      "Read the cap rate, NOI and gross yield — compare cap rates across properties.",
    ],
    example: {
      title: "Example: $250k property renting for $2,000/mo",
      body: "After $3,000 tax, $1,200 insurance, 10% maintenance and 5% vacancy, NOI is $16,200 → a 6.48% cap rate. Press Reset to verify.",
    },
  },
  "cash-on-cash-roi-calculator": {
    metaDescription:
      "Free cash on cash ROI calculator — annual pre-tax cash flow divided by the cash you actually invested in a rental property, with payback period.",
    formula: "CoC = Annual pre-tax cash flow ÷ Cash invested",
    whenToUse: [
      "When you financed the purchase — this metric shows the return on your actual cash, mortgage included.",
      "To compare leveraged deals: good ones often beat the property's cap rate.",
    ],
    howToUse: [
      "Enter the cash you put in: down payment, closing costs and any rehab.",
      "Enter the annual pre-tax cash flow: rent minus mortgage, taxes, insurance and repairs.",
      "Read your cash on cash return, monthly flow and payback period.",
    ],
    example: {
      title: "Example: $60,000 invested, $7,200 annual flow",
      body: "$7,200 ÷ $60,000 = a 12% cash on cash return — the cash pays itself back in about 8.3 years.",
    },
  },
  "solar-roi-calculator": {
    metaDescription:
      "Free solar panel ROI and payback calculator — system cost with the 30% tax credit, electricity rate, degradation and escalation give your break-even year.",
    formula: "Payback = Net system cost ÷ Annual electricity savings (with degradation & escalation)",
    whenToUse: [
      "Before signing a solar contract — verify the payback period the salesperson quotes.",
      "To compare financing options or system sizes by their true break-even point.",
    ],
    howToUse: [
      "Enter the installed cost and your incentives — the US federal credit covers 30%.",
      "Enter your electricity rate and annual kWh consumption from your utility bill.",
      "Keep the industry-standard 0.5% degradation and 2.5% rate escalation unless you know better.",
    ],
    example: {
      title: "Example: $20,000 system with the 30% credit",
      body: "Net cost $14,000 and first-year savings of $1,500 (10,000 kWh at $0.15) — payback lands around year 8.6, with about $48,000 saved over 25 years.",
    },
  },
  "marketing-roi-calculator": {
    metaDescription:
      "Free marketing ROI calculator — instantly see if a campaign was a winner or loser: ROI percentage, net profit and return per dollar of ad spend.",
    formula: "ROI = (Attributed revenue − Spend) ÷ Spend × 100",
    whenToUse: [
      "After any campaign — ads, email, influencer — to decide scale-up or shut-down.",
      "To compare channels: the one with the highest ROI per dollar deserves the budget.",
    ],
    howToUse: [
      "Enter what the campaign cost, all in.",
      "Enter the revenue it brought in — use attributed revenue from your analytics.",
      "Read the verdict, ROI and return per dollar (ROAS).",
    ],
    example: {
      title: "Example: $5,000 spend returning $15,000",
      body: "ROI = (15,000 − 5,000) ÷ 5,000 = 200% — every dollar returned $3. A clear winner.",
    },
  },
  "enterprise-seo-roi-calculator": {
    metaDescription:
      "Free enterprise SEO ROI calculator — projected added traffic, conversion rate and order value vs the SEO investment give revenue, ROI and net value.",
    formula: "Added revenue = Visitors × Conversion rate × Average order value",
    whenToUse: [
      "When deciding whether to fund an enterprise SEO program or agency retainer.",
      "To sanity-check an agency's traffic projections against your own conversion economics.",
    ],
    howToUse: [
      "Enter the projected added organic visitors per month.",
      "Enter your conversion rate and average order value.",
      "Enter the monthly SEO cost — read the added revenue, annual ROI and net monthly value.",
    ],
    example: {
      title: "Example: 5,000 added visitors at 2% and $100 AOV",
      body: "$10,000/month in added revenue against $5,000/month of SEO cost — a 100% annual ROI that compounds as rankings stick.",
    },
  },
  "b2b-roi-calculator": {
    metaDescription:
      "Free B2B ROI calculator — annual cost vs the value of hours saved gives net value, ROI, payback months and a clear yes/no verdict on the purchase.",
    formula: "ROI = (Hours saved × Hourly value − Annual cost) ÷ Annual cost × 100",
    whenToUse: [
      "Before renewing any B2B SaaS subscription — does it still pay for itself?",
      "To build the business case for a tool your team is asking for.",
    ],
    howToUse: [
      "Enter the tool or service's annual cost.",
      "Estimate the team hours it saves per year and the loaded hourly cost of that time.",
      "Read the net value, ROI, payback months — and the verdict.",
    ],
    example: {
      title: "Example: $12,000 tool saving 500 hours at $50",
      body: "$25,000 of value − $12,000 cost = $13,000 net → 108.3% ROI, paying back in under 6 months. A yes.",
    },
  },
  "venture-capital-calculator": {
    metaDescription:
      "Free venture capital dilution calculator — pre-money valuation, new investment and your stake give post-money value, investor share and your diluted ownership.",
    formula: "Post-money = Pre-money + Investment · Investor % = Investment ÷ Post-money",
    whenToUse: [
      "When negotiating a term sheet — see exactly what that valuation offer costs you in ownership.",
      "To model multiple rounds: repeat with each round's numbers to build a cap table.",
    ],
    howToUse: [
      "Enter the agreed pre-money valuation and the new investment amount.",
      "Enter your current ownership percentage.",
      "Read the post-money value, the investor's share and your diluted stake.",
    ],
    example: {
      title: "Example: $8M pre-money, $2M investment, you own 60%",
      body: "Post-money $10M — the investor gets 20% and your stake dilutes to 48%. Press Reset to verify.",
    },
  },
  "irr-calculator": {
    metaDescription:
      "Free IRR calculator — paste any cash flow series and get the exact internal rate of return, with an NPV check that confirms the solution.",
    formula: "IRR is the rate where NPV = Σ CFₜ ÷ (1+r)ᵗ = 0",
    whenToUse: [
      "Comparing investments with irregular cash flows — equipment purchases, business deals, real estate.",
      "Whenever someone quotes an 'annual return' on a lumpy project — IRR is the honest number.",
    ],
    howToUse: [
      "Enter year 0 first — the initial investment as a negative number.",
      "Then each year's cash flow, separated by commas, spaces or new lines.",
      "Read the IRR and the NPV check — it should be ≈ $0, confirming the solution.",
    ],
    example: {
      title: "Example: −1000, then 400 for three years",
      body: "IRR = 9.70% — the investment compounds your money at that rate each year. Press Reset to verify.",
    },
    excelNote: "In Excel use =IRR(range) — the same math this calculator runs.",
  },
  "accounting-rate-of-return-calculator": {
    metaDescription:
      "Free accounting rate of return calculator — average annual profit against average investment gives the ARR managers use to approve projects.",
    formula: "ARR = Average annual profit ÷ ((Initial investment + Salvage) ÷ 2)",
    whenToUse: [
      "For a quick approval check on capital projects before doing a full NPV analysis.",
      "When comparing projects on accounting profit rather than cash flow.",
    ],
    howToUse: [
      "Enter the project's average annual profit after depreciation and tax.",
      "Enter the initial investment and the salvage value at the end.",
      "Read the ARR — many companies approve projects above a 15% hurdle.",
    ],
    example: {
      title: "Example: $20,000 average profit on $100,000",
      body: "With $10,000 salvage, average investment is $55,000 → ARR = 36.36%. Press Reset to verify.",
    },
  },
  "holding-period-return-calculator": {
    metaDescription:
      "Free holding period return calculator — total return for the entire time you owned an asset, including income received, with annualized equivalent.",
    formula: "HPR = (Ending − Starting + Income) ÷ Starting",
    whenToUse: [
      "To state what an investment actually returned over the full holding period — one month or ten years.",
      "To annualize that return so it can be compared with other investments fairly.",
    ],
    howToUse: [
      "Enter the starting and ending values of the investment.",
      "Add any income received while holding — dividends, interest or rent.",
      "Enter the years held for the annualized figure, and toggle between total and annualized.",
    ],
    example: {
      title: "Example: $10,000 → $12,500 plus $200 income",
      body: "HPR = 27% over the period — about 12.7% annualized over 2 years. Press Reset to verify.",
    },
  },
  "retirement-rate-of-return-calculator": {
    metaDescription:
      "Free retirement rate of return calculator — the exact annual return your savings need to hit your retirement target, with a risk read on how aggressive you must be.",
    formula: "Solve for r: Savings×(1+r)ⁿ + Contributions×[((1+r)ⁿ−1)÷r] = Target",
    whenToUse: [
      "When a retirement calculator told you a target number but not what it takes to get there.",
      "To decide whether your plan needs more risk, more savings, or more years.",
    ],
    howToUse: [
      "Enter current savings, annual contributions and years until retirement.",
      "Enter your target nest egg and the return you currently expect.",
      "Read the required return, the projected value at your current rate, and the risk read.",
    ],
    example: {
      title: "Example: $100k + $10k/yr targeting $1M in 20 years",
      body: "The required return is about 8.53% per year — realistic for a stock-heavy portfolio but above what bonds deliver.",
    },
  },
  "savings-withdrawal-calculator": {
    metaDescription:
      "Free savings withdrawal calculator — month-by-month simulation of how long your savings last with regular withdrawals and investment growth.",
    formula: "Each month: balance += interest − withdrawal, until the money runs out",
    whenToUse: [
      "For retirement drawdown planning — how long the nest egg holds at your spending rate.",
      "For sabbaticals, emergencies or any period of living off savings.",
    ],
    howToUse: [
      "Enter your total savings, planned monthly withdrawal and expected annual return.",
      "The simulator compounds monthly and withdraws monthly — just like a real account.",
      "Read how long the money lasts and compare your rate with the 4% safe-withdrawal rule.",
    ],
    example: {
      title: "Example: $500k, $3,500/mo at 6% return",
      body: "The money lasts about 20.4 years. Drop the withdrawal to $2,500 and it stretches past 60 years. Press Reset to verify.",
    },
  },
}
