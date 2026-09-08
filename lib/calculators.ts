import type { TablerIcon } from "@tabler/icons-react"
import {
  IconArmchair,
  IconBriefcase,
  IconChartArcs,
  IconChartDots,
  IconChartHistogram,
  IconCoin,
  IconCreditCard,
  IconHome,
  IconMathFunction,
  IconReportAnalytics,
  IconTag,
  IconTarget,
  IconTrendingUp,
} from "@tabler/icons-react"

export interface CalculatorEntry {
  slug: string
  name: string
  whatItIs: string
  whatToExpect: string
}

export interface CalculatorGroup {
  title: string
  tagline: string
  icon: TablerIcon
  accent: string
  calculators: CalculatorEntry[]
}

export interface CalculatorFaq {
  question: string
  answer: string
  bullets?: string[]
}

export interface CalculatorHub {
  slug: string
  badge: string
  title: string
  titleAccent: string
  intro: string[]
  hubNote: string
  groups: CalculatorGroup[]
  faqs: CalculatorFaq[]
}

export interface NumericInputOptions {
  min?: number
  max?: number
  integer?: boolean
}

export interface ParsedInput {
  value: number | null
  error: string | null
}

export function parseNumericInput(
  raw: string,
  { min, max, integer = false }: NumericInputOptions = {}
): ParsedInput {
  const cleaned = raw.replace(/[, $]/g, "").trim()
  if (cleaned === "") return { value: null, error: null }
  const value = Number(cleaned)
  if (!Number.isFinite(value)) return { value: null, error: "Enter a valid number" }
  if (integer && !Number.isInteger(value)) return { value: null, error: "Enter a whole number" }
  if (min !== undefined && value < min)
    return { value: null, error: `Must be ${min} or more` }
  if (max !== undefined && value > max)
    return { value: null, error: `Must be ${max} or less` }
  return { value, error: null }
}

export const STATS_HUB: CalculatorHub = {
  slug: "statistics",
  badge: "Free Online Tools",
  title: "Statistics Calculators for",
  titleAccent: "Students & Professionals",
  intro: [
    "Statistical calculators are most commonly used by students and researchers — and our online statistics calculators are built to do exactly that job, for people around the world. These tools solve complex statistical formulas instantly: enter your data and get accurate, step-by-step results that help you understand the numbers behind the data. Every dedicated calculator page also explains the formula and the logic behind it.",
  ],
  hubNote:
    "This is the hub of all our statistical calculators, organized by category. Click any calculator below to open its dedicated page — enter your data and see the expected output within a second.",
  groups: [
    {
      title: "Averages & Mean Calculators",
      tagline: "Find the central tendency of your data in smarter ways than just adding everything up.",
      icon: IconMathFunction,
      accent: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
      calculators: [
        {
          slug: "weighted-average-grade-calculator",
          name: "Weighted Average Grade Calculator",
          whatItIs:
            "A tool for students to calculate their final class grade when assignments carry different weights — like a Final Exam worth 50% and Homework worth 10%.",
          whatToExpect:
            "Enter your grades and their percentage weights to see exactly where you stand in class.",
        },
        {
          slug: "geometric-mean-calculator",
          name: "Geometric Mean Calculator",
          whatItIs:
            "A specialized way to average numbers that are multiplied together — often used for growth rates or investment returns.",
          whatToExpect:
            "The correct average rate that prevents skewing by extreme high or low numbers.",
        },
        {
          slug: "harmonic-mean-calculator",
          name: "Harmonic Mean Calculator",
          whatItIs:
            "The perfect tool for averaging rates or ratios — like speed (km/h) or price-earnings ratios in finance.",
          whatToExpect:
            "A precise average for fractions and rates that a normal average would get wrong.",
        },
        {
          slug: "time-weighted-average-calculator",
          name: "Time Weighted Average (TWA) Calculator",
          whatItIs:
            "Measures a worker's daily noise or chemical exposure across an 8-hour workday, with OSHA and NIOSH safety limits built in.",
          whatToExpect:
            "Your 8-hour TWA, total dose % and a safety verdict against the legal exposure limits.",
        },
      ],
    },
    {
      title: "Variance & Analysis Tools",
      tagline: "Understand how spread out — or consistent — your data really is.",
      icon: IconChartHistogram,
      accent: "text-blue-600 dark:text-blue-400 bg-blue-500/10",
      calculators: [
        {
          slug: "coefficient-of-variance-calculator",
          name: "Coefficient of Variance Calculator",
          whatItIs:
            "Tells you how risky or volatile a dataset is compared to its own average.",
          whatToExpect:
            "A percentage that lets you compare the risk of two different things — like two stocks — even if their prices are totally different.",
        },
        {
          slug: "pooled-variance-calculator",
          name: "Pooled Variance Calculator",
          whatItIs:
            "Combines standard deviations or variances from unlimited groups into one weighted, reliable metric — with degrees of freedom handled automatically.",
          whatToExpect:
            "Pooled variance and pooled standard deviation for t-tests, ANOVA and quality control.",
        },
        {
          slug: "one-way-anova-calculator",
          name: "One Way Analysis of Variance (ANOVA) Calculator",
          whatItIs:
            "A statistical test that compares the means of three or more independent groups to see if they are significantly different.",
          whatToExpect:
            "A clear F-Statistic and P-Value that tell you whether your groups actually differ — or the results just happened by chance.",
        },
        {
          slug: "two-way-anova-calculator",
          name: "Two Way Analysis of Variance (ANOVA) Calculator",
          whatItIs:
            "A more advanced ANOVA that looks at how two different factors affect a result — for example how Diet AND Exercise affect weight loss.",
          whatToExpect: "It reveals whether there is an interaction between your two variables.",
        },
      ],
    },
    {
      title: "Probability & Z-Scores",
      tagline: "Determine the likelihood of events and where your data sits on the curve.",
      icon: IconChartDots,
      accent: "text-purple-600 dark:text-purple-400 bg-purple-500/10",
      calculators: [
        {
          slug: "z-score-to-percentile-calculator",
          name: "Z Score to Percentile Calculator",
          whatItIs:
            "Converts a Z-Score (standard deviations) into a simple percentile ranking — like Top 10%.",
          whatToExpect:
            "A percentage that tells you exactly what portion of the population is below or above a specific score.",
        },
        {
          slug: "critical-z-value-calculator",
          name: "Critical Z Value Calculator",
          whatItIs:
            "Finds the boundary mark (cut-off point) on a bell curve needed to reject a hypothesis at a certain confidence level.",
          whatToExpect:
            "The precise Z-value needed for hypothesis testing — like 1.96 for a 95% confidence level.",
        },
        {
          slug: "p-value-from-z-score-calculator",
          name: "P Value from Z Score Calculator",
          whatItIs:
            "The ultimate evidence calculator: the probability of finding a result as extreme as the one you observed.",
          whatToExpect:
            "A small decimal (the P-Value) — if it is low, usually under 0.05, your result is statistically significant.",
        },
      ],
    },
    {
      title: "Business & Applied Statistics",
      tagline: "Specialized statistics tools for payroll, trading, and operations.",
      icon: IconBriefcase,
      accent: "text-amber-600 dark:text-amber-400 bg-amber-500/10",
      calculators: [
        {
          slug: "weighted-average-overtime-calculator",
          name: "Weighted Average Overtime Calculator",
          whatItIs:
            "FLSA blended-rate overtime calculator for employees working multiple jobs at different pay rates, with bonuses and commissions included.",
          whatToExpect:
            "The DOL 4-step process: blended regular rate, half-time premium and total gross pay — computed instantly.",
        },
        {
          slug: "vwap-calculator",
          name: "Volume Weighted Average Price (VWAP) Calculator",
          whatItIs:
            "A trading benchmark that shows the average price a stock traded at throughout the day, based on both price and volume.",
          whatToExpect:
            "A trend line that helps traders decide whether they are buying a stock at a good price or an expensive one.",
        },
      ],
    },
  ],
  faqs: [
    {
      question: "Are these calculators accurate enough for professional research?",
      answer:
        "Yes. While we designed these tools to be simple enough for students, they use rigorous, industry-standard statistical algorithms. Whether you are working on a university thesis, a business market analysis, or professional data modeling, you can trust the accuracy of the results.",
    },
    {
      question: "Do they just show the answer, or do they explain the math?",
      answer:
        "We explain the math. We believe in helping you understand the why behind the numbers. Along with your final result, most of our tools provide:",
      bullets: [
        "The Formula — the actual equation used to solve the problem",
        "Real-Life Examples — practical scenarios showing how the statistic is used in the real world",
        "Step-by-Step Logic — a breakdown that helps you learn the process",
      ],
    },
    {
      question: "How do I enter my data?",
      answer:
        "It is designed to be flexible. For most calculators you can type your data points manually — and to save time with larger datasets, several tools also let you paste data directly from spreadsheets or text documents.",
    },
    {
      question: "Can I download my results as a PDF or image?",
      answer:
        "Not at this time. Results are displayed instantly on your screen for immediate use. We are working on PDF and image downloads for the future — stay tuned for updates!",
    },
    {
      question: "Is my data saved or stored?",
      answer:
        "No, never. Just like our financial tools, your privacy is guaranteed. The data you enter is processed in your browser and is never stored on our servers. Once you close the tab or refresh the page, your data is completely wiped.",
    },
  ],
}

export const STATS_CALCULATORS: CalculatorEntry[] = STATS_HUB.groups.flatMap(
  (group) => group.calculators
)

export function getStatsCalculator(slug: string): CalculatorEntry | undefined {
  return STATS_CALCULATORS.find((calculator) => calculator.slug === slug)
}

export function getStatsGroupForCalculator(slug: string): CalculatorGroup {
  return (
    STATS_HUB.groups.find((group) =>
      group.calculators.some((calculator) => calculator.slug === slug)
    ) ?? STATS_HUB.groups[0]
  )
}

export const FINANCE_HUB: CalculatorHub = {
  slug: "finance",
  badge: "Free Online Tools",
  title: "Financial Calculator Hub:",
  titleAccent: "Business, Real Estate & Investing",
  intro: [
    "Online financial calculators offer a great way to get you out of the spreadsheets and make your money calculations easier. Whether you want to see how your investment will grow, check if a business idea is profitable, or plan for a happy retirement — our financial calculators are here to do the work.",
    "We built these tools on logical formulas and packed in all the input options you need. Every result is instant, private and free.",
  ],
  hubNote:
    "This page is the directory of all our financial calculators. Click any calculator below to open its dedicated page — enter your numbers and see the result within a second.",
  groups: [
    {
      title: "Investment & Profit Calculators",
      tagline:
        "These tools help you see how much money you can make from stocks and shares.",
      icon: IconTrendingUp,
      accent: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
      calculators: [
        {
          slug: "share-profit-calculator",
          name: "Share Profit Calculator",
          whatItIs:
            "Improve your trading decisions with our Share Profit Calculator. This tool simply calculates your actual profit or loss by considering your purchase price, selling price, brokerage fees, and capital gains tax.",
          whatToExpect:
            "It gives you a clear view of your actual ROI and the amount you take home.",
        },
        {
          slug: "dividend-reinvestment-plan-calculator",
          name: "Dividend Reinvestment Plan (DRIP) Calculator",
          whatItIs:
            "Compounding can grow your wealth faster than you think. Our Dividend Reinvestment Plan (DRIP) Calculator shows you how. It helps you see how reinvesting your dividends can build real wealth over time.",
          whatToExpect:
            "You can also add yearly contributions and factor in stock growth. The result gives you a clear idea of where your money could be spent. It works great for retirement planning or building a passive income stream.",
        },
        {
          slug: "dividend-snowball-calculator",
          name: "Dividend Snowball Calculator",
          whatItIs:
            "Find out your path to financial freedom with our Dividend Snowball Calculator. This tool helps you track how dividend reinvestment grows your income over time.",
          whatToExpect:
            "It also shows how monthly contributions and yearly dividend increases boost your portfolio faster. A small cash flow can grow into a strong stream of passive income.",
        },
        {
          slug: "living-off-dividends-calculator",
          name: "Living Off Dividends Calculator",
          whatItIs:
            "Want to live off dividends and leave the rat race behind? Our Living Off Dividends Calculator helps you figure out how much money you need to cover all your living expenses with dividend income.",
          whatToExpect:
            "It also shows you how long it will take to get there. The calculator factors in taxes, inflation, and dividend growth so you get a complete and accurate result.",
        },
        {
          slug: "cost-of-equity-calculator",
          name: "Cost of Equity Calculator",
          whatItIs:
            "Use our Cost of Equity Calculator to find the return your shareholders expect. This tool gives you two simple methods for calculation. You can use the Capital Asset Pricing Model (CAPM) or the Dividend Capitalization Model.",
          whatToExpect:
            "Both methods help finance teams and investors estimate the required return for a stock or project.",
        },
      ],
    },
    {
      title: "Real Estate & Energy Savings",
      tagline: "Use these calculators before you buy property or solar panels.",
      icon: IconHome,
      accent: "text-blue-600 dark:text-blue-400 bg-blue-500/10",
      calculators: [
        {
          slug: "rental-property-roi-calculator",
          name: "Rental Property ROI Calculator",
          whatItIs:
            "Our Rental Property ROI Calculator helps you get the most from your real estate investment. It is built for cash investors and Shariah-compliant financing models. The calculator shows your cash-on-cash return, net operating income, and long-term profit in a simple way.",
          whatToExpect:
            "It works without interest-based debt or complex formulas. You only enter your numbers and see clear results.",
        },
        {
          slug: "cash-on-cash-roi-calculator",
          name: "Cash on Cash ROI Calculator",
          whatItIs:
            "Track your property returns with our Cash on Cash ROI Calculator. This tool helps you measure the yearly return on your own invested money. It includes down payments, closing costs, and repair expenses in the calculation.",
          whatToExpect:
            "This helps you see the exact return on your cash investment.",
        },
        {
          slug: "solar-roi-calculator",
          name: "Solar ROI Calculator",
          whatItIs:
            "Plan your move to renewable energy with our Solar ROI Calculator. This tool checks your installation costs, government incentives, and rising utility rates. It helps you estimate your payback period, monthly savings, and long-term financial savings.",
          whatToExpect:
            "You can use it to make better decisions for your home or business before you invest your money.",
        },
      ],
    },
    {
      title: "Business & Marketing Tools",
      tagline:
        "Perfect for business owners who need to know if their spending is working.",
      icon: IconTarget,
      accent: "text-amber-600 dark:text-amber-400 bg-amber-500/10",
      calculators: [
        {
          slug: "marketing-roi-calculator",
          name: "Marketing ROI Calculator",
          whatItIs:
            "Track how well your advertising campaigns are performing with our Marketing ROI Calculator. This tool breaks down your profitability by looking at ad spend, labor costs, COGS, and customer lifetime value.",
          whatToExpect:
            "You get clear numbers that help you grow your marketing budget with confidence.",
        },
        {
          slug: "enterprise-seo-roi-calculator",
          name: "Enterprise SEO ROI Calculator",
          whatItIs:
            "Forecast your organic growth with confidence using our Advanced Enterprise SEO ROI Calculator. This tool is built for marketing directors and SEO strategists who need more than basic traffic numbers. It goes deeper than simple estimates. It breaks down conversion value, resource costs, and long-term profitability.",
          whatToExpect:
            "You can use it to build a stronger SEO budget with clear and useful data.",
        },
        {
          slug: "b2b-roi-calculator",
          name: "B2B ROI Calculator",
          whatItIs:
            "Measure how well your sales team is performing with our B2B ROI Calculator. This tool is built for high-ticket business sales. It connects your marketing leads to your final revenue numbers.",
          whatToExpect:
            "You can track SQL conversion rates, win rates, and team costs. It shows you exactly where your money goes.",
        },
        {
          slug: "venture-capital-calculator",
          name: "Venture Capital Calculator",
          whatItIs:
            "Our Venture Capital Calculator helps you understand startup valuations with ease. It uses the industry-standard VC Method to guide you through the numbers. You can find post-money valuations, required ownership stakes, and implied IRR.",
          whatToExpect:
            "The tool also accounts for future dilution and exit timelines. It works great for both founders and investors.",
        },
      ],
    },
    {
      title: "Advanced Performance Metrics",
      tagline: "Deep-dive math for serious financial planning.",
      icon: IconChartArcs,
      accent: "text-purple-600 dark:text-purple-400 bg-purple-500/10",
      calculators: [
        {
          slug: "irr-calculator",
          name: "Internal Rate of Return (IRR) Calculator",
          whatItIs:
            "Use our Internal Rate of Return (IRR) Calculator to find the true return on your investment. This tool is useful for corporate finance, real estate deals, and private equity projects. It uses a smart method to work through different cash flows and find the annual return rate.",
          whatToExpect:
            "You can use it to see if a project is worth the risk.",
        },
        {
          slug: "accounting-rate-of-return-calculator",
          name: "Accounting Rate of Return Calculator",
          whatItIs:
            "Looks at the average profit you expect to earn from a project compared to its average cost.",
          whatToExpect:
            "A quick snapshot to help managers approve or reject a new project.",
        },
        {
          slug: "holding-period-return-calculator",
          name: "Holding Period Return Calculator",
          whatItIs:
            "Our Holding Period Return (HPR) Calculator helps you measure your investment performance accurately. It works for stocks, real estate, and more. The tool adds up your capital gains and income to give you a total percentage return.",
          whatToExpect:
            "It also shows your Annualized Return so you can compare short-term and long-term investments fairly.",
        },
      ],
    },
    {
      title: "Retirement & Future Planning",
      tagline: "Tools to help you plan for a secure future.",
      icon: IconArmchair,
      accent: "text-teal-600 dark:text-teal-400 bg-teal-500/10",
      calculators: [
        {
          slug: "retirement-rate-of-return-calculator",
          name: "Retirement Rate of Return Calculator",
          whatItIs:
            "Our Retirement Rate of Return Calculator helps you plan your financial future. It shows you how your savings can grow over time. You can add your monthly contributions and expected salary increases.",
          whatToExpect:
            "The tool also factors in compound interest to estimate your total savings. It adjusts for inflation too, so you can see what your money will actually be worth.",
        },
        {
          slug: "savings-withdrawal-calculator",
          name: "Savings Withdrawal Calculator",
          whatItIs:
            "Use our Savings Withdrawal Calculator to plan your financial future with confidence. This tool helps you estimate how long your savings may last. You can use it for retirement, a career break, or a fixed inheritance.",
          whatToExpect:
            "This calculator includes Inflation and Investment Returns in the estimate. It gives you a more practical view of your withdrawal period.",
        },
      ],
    },
  ],
  faqs: [
    {
      question: "Do I need to pay or sign up to use these?",
      answer:
        "No. All of our calculators are 100% free. We believe financial planning should be easy for everyone — no account, no email list, no fees. Just open the page and start calculating.",
    },
    {
      question: "Is my financial data safe?",
      answer:
        "Yes, completely. Your privacy is our top priority. We do not save, store, or look at any numbers you type in. The data only exists on your screen while you use the tool — close or refresh the page and it disappears forever.",
    },
    {
      question: "Can I use these for currencies other than US Dollars?",
      answer:
        "Currently our tools are designed for USD ($). The math works for other currencies, but the formatting and symbols are built for the US system to ensure the highest accuracy.",
    },
    {
      question: "Do the investment tools show live stock market prices?",
      answer:
        "No — and that is on purpose. To keep the calculators lightning-fast and reliable, we do not wait for slow connections to the stock market. You simply type in the current share price yourself, which guarantees an instant answer with no loading delays.",
    },
    {
      question: "Do the results include taxes?",
      answer:
        "No. The profit numbers you see are pre-tax. Since everyone's tax rate is different, we show the raw potential of your investment first, before the government's share.",
    },
    {
      question: "Does the math account for inflation (rising costs)?",
      answer:
        "That is up to you. Our tools calculate exactly what you type in. We recommend entering values based on current scenarios — what things cost today — which gives you a clear snapshot of your finances right now.",
    },
    {
      question: "Can I use these results for my official tax filing?",
      answer:
        "No. These calculators are powerful tools for estimation and planning only — great for setting goals and exploring what-if scenarios, but not a replacement for a professional accountant. Please do not use these numbers for legal or tax documents.",
    },
  ],
}

export const FINANCE_CALCULATORS: CalculatorEntry[] = FINANCE_HUB.groups.flatMap(
  (group) => group.calculators
)

export function getFinanceCalculator(slug: string): CalculatorEntry | undefined {
  return FINANCE_CALCULATORS.find((calculator) => calculator.slug === slug)
}

export function getFinanceGroupForCalculator(slug: string): CalculatorGroup {
  return (
    FINANCE_HUB.groups.find((group) =>
      group.calculators.some((calculator) => calculator.slug === slug)
    ) ?? FINANCE_HUB.groups[0]
  )
}

export const ACCOUNTING_HUB: CalculatorHub = {
  slug: "accounting",
  badge: "Free Online Tools",
  title: "Accounting Calculators",
  titleAccent: "Hub",
  intro: [
    "Accounting calculators and tools are not only for professional bookkeepers. They are also for a small business owner, a student learning accounting, or anyone trying to figure out how much time it takes to pay off a debt.",
    "We have built 15 online calculators so far — and we plan to build a massive library of accounting tools. As demand grows we will keep adding calculators, and you will always find the full list here by category.",
  ],
  hubNote:
    "Click any calculator below to open its dedicated page — enter your numbers and see the result within a second.",
  groups: [
    {
      title: "Profit Margin & Sales",
      tagline: "Calculate how much money you will keep from every sale.",
      icon: IconTag,
      accent: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
      calculators: [
        {
          slug: "retail-profit-margin-calculator",
          name: "Retail Profit Margin Calculator",
          whatItIs:
            "Finds the percentage of profit you make on a single product sold by your store.",
          whatToExpect:
            "It indicates whether your markup is good enough to cover your costs and still make a profit.",
        },
        {
          slug: "wholesale-margin-calculator",
          name: "Wholesale Margin Calculator",
          whatItIs:
            "Calculates the profit margin for a bulk amount of products when you sell them all to a store.",
          whatToExpect:
            "It reveals the profit gap between the manufacturing cost of the whole bulk and the price you set for it.",
        },
        {
          slug: "reverse-margin-calculator",
          name: "Reverse Margin Calculator",
          whatItIs:
            "Built to find the maximum cost price that still makes a profit when you have already set the selling price.",
          whatToExpect:
            "The target cost — how much you can afford to spend on manufacturing per unit.",
        },
        {
          slug: "amazon-seller-commission-calculator",
          name: "Amazon Seller Commission Calculator",
          whatItIs: "Estimates the overall fees Amazon cuts from your sales.",
          whatToExpect:
            "A breakdown of referral fees and closing costs that shows what you actually earn.",
        },
        {
          slug: "salesperson-profitability-calculator",
          name: "Salesperson Profitability Calculator",
          whatItIs:
            "Measures whether a salesperson brings in enough revenue to cover their salary and commissions.",
          whatToExpect:
            "An ROI number that tells you if a salesperson is an asset for your business.",
        },
      ],
    },
    {
      title: "Payroll, Salary & Commissions",
      tagline: "Tools to manage employee pay, bonuses, and overtime correctly.",
      icon: IconCoin,
      accent: "text-blue-600 dark:text-blue-400 bg-blue-500/10",
      calculators: [
        {
          slug: "payroll-overtime-calculator",
          name: "Payroll Calculator with Overtime",
          whatItIs:
            "Calculates a paycheck that includes regular work hours and overtime.",
          whatToExpect:
            "A gross pay figure that ensures employees are paid properly for extra work.",
        },
        {
          slug: "gross-up-payroll-calculator",
          name: "Gross Up Payroll Calculator",
          whatItIs:
            "Figures out how much to pay an employee so they take home an exact amount after tax.",
          whatToExpect:
            "The higher gross pay that fulfills the employee's take-home target.",
        },
        {
          slug: "prorated-bonus-calculator",
          name: "Prorated Bonus Calculator",
          whatItIs:
            "Determines the fair bonus for an employee who worked only part of the year.",
          whatToExpect:
            "A fair, adjusted bonus amount based on the joining date within the year.",
        },
        {
          slug: "sales-commission-calculator",
          name: "Sales Commission Calculator",
          whatItIs:
            "Calculates the commission on sales earned by an employee or sales representative.",
          whatToExpect: "The exact commission amount for a salesperson.",
        },
        {
          slug: "payroll-conversion-calculator",
          name: "Payroll Conversion Calculator",
          whatItIs:
            "Converts a salary into wages on different timelines — hourly, weekly, monthly.",
          whatToExpect:
            "A full breakdown of the annual salary into every timeline's wage.",
        },
      ],
    },
    {
      title: "Business Health & Equity",
      tagline: "Check if your company is efficient and financially stable.",
      icon: IconReportAnalytics,
      accent: "text-amber-600 dark:text-amber-400 bg-amber-500/10",
      calculators: [
        {
          slug: "retained-earnings-calculator",
          name: "Retained Earnings Calculator",
          whatItIs:
            "Estimates the total profit a company has kept since its beginning after paying dividends to owners.",
          whatToExpect:
            "A cumulative savings amount that signals the company's potential for financial growth.",
        },
        {
          slug: "cash-conversion-cycle-calculator",
          name: "Cash Conversion Cycle (CCC) Calculator",
          whatItIs:
            "Measures how long it takes your business to turn money spent on inventory back into cash in the bank.",
          whatToExpect:
            "A timeline that indicates how healthy and fast your business's growth really is.",
        },
      ],
    },
    {
      title: "Debt & Personal Accounting",
      tagline: "Manage your personal debts and adjust your spending.",
      icon: IconCreditCard,
      accent: "text-purple-600 dark:text-purple-400 bg-purple-500/10",
      calculators: [
        {
          slug: "debt-payoff-extra-payments-calculator",
          name: "Debt Payoff Calculator with Extra Payments",
          whatItIs:
            "Shows how much faster you can be debt-free if you add extra money to your monthly payment.",
          whatToExpect: "A new debt-free date — and the interest you save.",
        },
        {
          slug: "debt-snowball-vs-avalanche-calculator",
          name: "Debt Snowball vs Avalanche Calculator",
          whatItIs:
            "Compares two popular payoff strategies: smallest balance first (snowball) vs highest interest first (avalanche).",
          whatToExpect:
            "A side-by-side comparison showing which method gets you debt-free faster and cheaper.",
        },
        {
          slug: "marginal-propensity-to-consume-calculator",
          name: "Marginal Propensity to Consume Calculator",
          whatItIs:
            "An economics tool that tells you how much of a raise you will spend versus save.",
          whatToExpect:
            "A decimal between 0 and 1 that captures your spending habits as income rises.",
        },
      ],
    },
  ],
  faqs: [
    {
      question: "Which country's tax laws do these tools follow?",
      answer:
        "Primarily the United States — tax-specific tools follow US IRS guidelines. However, for general business math like profit margins, debt payoff, or commissions, the formulas are universal and work for business owners anywhere in the world.",
    },
    {
      question: "Do the payroll tools automatically deduct taxes?",
      answer:
        "No — and that helps accuracy. Tax rates change based on where you live and your personal situation. Instead of guessing, our calculators ask you to enter your specific tax rate manually, so the final paycheck number is accurate for you rather than a generic estimate.",
    },
    {
      question: "Does the Amazon calculator update fees automatically?",
      answer:
        "No. Amazon changes its fee structure frequently. To ensure you never get an outdated result, you input the current fee percentage yourself — guaranteeing the calculation reflects the real fees you are paying today.",
    },
    {
      question: "Is my salary and payroll data private?",
      answer:
        "Yes, 100%. We understand salary data is sensitive. Just like our other tools, nothing is ever saved on our servers — your payroll and debt numbers exist only in your browser and disappear when you close the page.",
    },
    {
      question: "Can I use these tools with currencies other than US Dollars?",
      answer:
        "It depends on the tool:",
      bullets: [
        "Universal tools — Debt Payoff, Profit Margins and general math work in any currency (Euros, Rupees, Pounds); the math is the same regardless of the symbol",
        "US-specific tools — tax-specific fields are formatted for USD ($) to match US tax forms",
      ],
    },
  ],
}

export const ACCOUNTING_CALCULATORS: CalculatorEntry[] = ACCOUNTING_HUB.groups.flatMap(
  (group) => group.calculators
)

export function getAccountingCalculator(slug: string): CalculatorEntry | undefined {
  return ACCOUNTING_CALCULATORS.find((calculator) => calculator.slug === slug)
}

export function getAccountingGroupForCalculator(slug: string): CalculatorGroup {
  return (
    ACCOUNTING_HUB.groups.find((group) =>
      group.calculators.some((calculator) => calculator.slug === slug)
    ) ?? ACCOUNTING_HUB.groups[0]
  )
}
