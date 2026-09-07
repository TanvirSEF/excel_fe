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
      "Free share profit calculator with commissions and capital gains tax — net profit, ROI, break-even price and total fees for any stock trade.",
    formula: "Net Profit = (Net Revenue − Total Cost) − Tax Amount",
    whenToUse: [
      "A share profit calculator helps investors find the real profit from a trade. It shows the difference between price changes and the money you actually keep. Even if a stock price goes up, your final profit can be lower because of brokerage fees, selling charges and taxes.",
      "This tool helps you check different selling prices and plan better exit points. It also helps you find your break-even point — the price where your selling amount covers all costs. Both short-term traders and long-term investors use it to make decisions based on actual returns.",
    ],
    howToUse: [
      "Enter the shares quantity, buy price and sell price.",
      "Enter both commissions — the buy-side and sell-side fees your broker charges.",
      "Enter the capital gains tax rate for your situation (0%, 15% or 20% for long-term in the US).",
      "Read the net profit, post-tax ROI, total cost, revenue, total fees and break-even price.",
    ],
    example: {
      title: "Example: 100 shares bought at $150, sold at $200",
      body: "Total cost $15,010 (including $10 buy commission). Gross $20,000. Taxable profit $4,980. Tax at 15% = $747. Net profit $4,233 = 28.20% ROI. Press Reset to reproduce.",
    },
    excelNote: "In Excel: =(Shares*Sell-SellComm)*(1-TaxRate)-(Shares*Buy+BuyComm) for net profit.",
    method: {
      title: "The mathematical framework — 5 formulas",
      paragraphs: [
        "Total cost basis = (Shares × Buy Price) + Buy Commission. This is your total initial outlay.",
        "Gross proceeds = Shares × Sell Price. Net revenue = Gross − Sell Commission. This is what remains after paying your broker to close the position.",
        "Tax liability = (Net Revenue − Total Cost) × (Tax Rate ÷ 100), applied only on positive gains. Net profit = (Net Revenue − Total Cost) − Tax. ROI = (Net Profit ÷ Total Cost) × 100.",
      ],
      formula: "ROI = (Net Profit ÷ Total Cost) × 100",
    },
    facts: [
      {
        title: "1. Tax rules vary by country",
        body: "USA: long-term gains taxed at 0%, 15% or 20% after one year; short-term at income rates up to 37%. UK: £3,000 annual tax-free allowance. Australia: 50% discount for assets held over 12 months. Canada: 50% inclusion rate (66.67% above $250k). India: 12.5% LTCG above ₹1.25 lakh.",
      },
      {
        title: "2. Holding period matters",
        body: "In the US and Australia, holding stocks longer reduces your tax bill. In the US, selling after one year drops your rate to 0-20%. Without that, you pay your regular income tax rate — up to 37%. Australia gives a 50% tax discount for assets held over a year.",
      },
      {
        title: "3. Capital losses can offset gains",
        body: "If your result shows a net loss, this is called a capital loss. In many countries, you can use it to offset other capital gains and reduce your total tax bill for the year.",
      },
    ],
    useCases: [
      {
        title: "Planning exit points",
        body: "Before selling, test different sell prices to find the exit that maximizes profit after all costs — the break-even shows your minimum acceptable price.",
      },
      {
        title: "Comparing brokers",
        body: "Different brokers charge different fees — some free, some fixed, some percentage-based. Enter each broker's fee structure to see how much commissions eat into your returns.",
      },
      {
        title: "Post-trade tax planning",
        body: "The tax field shows exactly how much of your profit goes to the government. Adjust the tax rate to compare short-term vs long-term capital gains strategies.",
      },
    ],
    faqs: [
      {
        question: "What if my result shows a net loss?",
        answer:
          "A net loss means you sold below your total cost. This is a capital loss — in many countries you can use it to offset other capital gains and reduce your total tax for the year.",
      },
      {
        question: "Does this calculator work for crypto?",
        answer:
          "Yes, the basic logic is the same for cryptocurrency: compare buy price vs sell price. However, tax rules for crypto differ by country, so check your local laws for the correct tax rate.",
      },
      {
        question: "Is the ROI shown before or after tax?",
        answer:
          "This calculator shows post-tax ROI — it tells you how much you actually gained after paying both commissions and capital gains tax.",
      },
      {
        question: "Why do I enter commissions manually?",
        answer:
          "Each broker has a different fee structure — some charge no commission, others a fixed fee or a percentage. Manual entry ensures your net profit is accurate for your specific broker.",
      },
      {
        question: "Does the sale price include dividends?",
        answer:
          "No. The sell price only reflects the market value of the share. Dividends are counted as separate income and may have their own tax treatment.",
      },
    ],
  },
  "dividend-reinvestment-plan-calculator": {
    metaDescription:
      "Free DRIP calculator with tax — project portfolio value, dividend income and yield on cost year by year. Retirement planning and passive income modeling.",
    formula: "(Balance + Net Dividend + Addition) × (1 + Growth) = New Balance",
    whenToUse: [
      "Compounding can grow your wealth faster than you think. A Dividend Reinvestment Plan (DRIP) automatically buys more shares with your dividend payments instead of taking cash — as you own more shares, you earn more dividends, which buy even more shares.",
      "This calculator includes stock price growth and dividend taxes in the result, showing you the real picture for retirement planning or building a passive income stream.",
    ],
    howToUse: [
      "Enter your starting principal and the annual addition you plan to invest.",
      "Set the dividend yield, price growth rate and your dividend tax rate.",
      "Enter the number of years — the year-by-year table shows how compounding accelerates.",
    ],
    example: {
      title: "Example: $10,000 with $1,200/yr additions",
      body: "At 4% yield, 5% price growth and 15% tax over 20 years: portfolio reaches $113,217, generating $4,529/yr in income with a 13.32% yield on cost from $34,000 in total contributions. Press Reset to reproduce.",
    },
    excelNote: "In Excel, build a column for each year: =(prev_balance + prev_balance*yield*(1-tax) + addition)*(1+growth)",
    method: {
      title: "The math of compounding — formulas used",
      paragraphs: [
        "Annual dividend payout: Portfolio Balance × Dividend Yield = Gross Dividend. Tax deduction: Gross Dividend × (1 − Tax Rate) = Net Dividend.",
        "End of year balance: (Current Balance + Net Dividend + Annual Addition) × (1 + Price Growth) = New Balance. This compounds year after year.",
        "Yield on Cost (YOC): Final Annual Income ÷ Total Personal Contributions. Income investors track this number — after many years of reinvestment it can grow to 20–50%.",
      ],
      formula: "YOC = Final Annual Income ÷ Total Personal Contributions",
    },
    facts: [
      {
        title: "1. US Dividend Aristocrats",
        body: "The US market is known for Dividend Aristocrats — companies that raise dividends for at least 25 consecutive years. Dividends make up about 32% of the total return of the S&P 500.",
      },
      {
        title: "2. Global dividend tax differences",
        body: "Canada offers a Dividend Tax Credit that reduces tax on dividend income. Australia uses Franking Credits to avoid double taxation. The UK offers the FTSE 100 with yields often above 4%. India taxes dividends based on income tax slabs after the 2020 Finance Act.",
      },
      {
        title: "3. Reinvesting during crashes",
        body: "When stock prices fall, your dividend money buys more shares at lower prices. This helps your portfolio recover faster when the market improves — automatic dollar-cost averaging during downturns.",
      },
    ],
    useCases: [
      {
        title: "Retirement planning",
        body: "Project how your dividend portfolio grows over 20–30 years. The yield on cost shows how much passive income your contributions generate by retirement.",
      },
      {
        title: "Passive income goals",
        body: "Set a target annual income, then adjust yield, contributions and years to find the combination that reaches it.",
      },
      {
        title: "Comparing investment strategies",
        body: "Run the numbers with and without reinvestment (set yield to 0%) to see exactly how much DRIP compounding adds to your final wealth.",
      },
    ],
    faqs: [
      {
        question: "Is it better to reinvest dividends or take the cash?",
        answer:
          "If you do not need the money for daily expenses, reinvesting usually works better. It buys more shares when prices drop and supports steady growth in your portfolio over time.",
      },
      {
        question: "Can I reinvest dividends with any stock?",
        answer:
          "Most major brokerages let you turn on auto-reinvest for dividend-paying stocks. Some companies also offer Direct DRIPs that let you buy shares straight from the company.",
      },
      {
        question: "Does reinvesting dividends help during a market crash?",
        answer:
          "Yes. When stock prices fall, your dividend money buys more shares at lower prices. This helps your portfolio recover faster when the market improves.",
      },
      {
        question: "What is a safe dividend yield?",
        answer:
          "Many investors see 2% to 5% as a safer range. Yields above 8–10% can be risky — a very high yield may signal that the company has financial problems and may cut its dividend soon.",
      },
      {
        question: "Do I still pay taxes if I reinvest dividends?",
        answer:
          "Yes, in a regular brokerage account you still pay taxes — tax authorities count dividends as income even after reinvestment. In accounts like an IRA or ISA, you may delay or avoid taxes based on account rules.",
      },
    ],
  },
  "dividend-snowball-calculator": {
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
