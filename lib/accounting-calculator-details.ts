import type { StatsCalculatorDetail } from "@/lib/stats-calculator-details"

export type AccountingSlug =
  | "retail-profit-margin-calculator"
  | "wholesale-margin-calculator"
  | "reverse-margin-calculator"
  | "amazon-seller-commission-calculator"
  | "salesperson-profitability-calculator"
  | "payroll-overtime-calculator"
  | "gross-up-payroll-calculator"
  | "prorated-bonus-calculator"
  | "sales-commission-calculator"
  | "payroll-conversion-calculator"
  | "retained-earnings-calculator"
  | "cash-conversion-cycle-calculator"
  | "debt-payoff-extra-payments-calculator"
  | "debt-snowball-vs-avalanche-calculator"
  | "marginal-propensity-to-consume-calculator"

export const ACCOUNTING_DETAILS: Record<AccountingSlug, StatsCalculatorDetail> = {
  "retail-profit-margin-calculator": {
    metaDescription:
      "Free retail profit margin calculator — cost and selling price give margin, markup and profit per unit instantly, with the formula explained.",
    formula: "Margin = (Price − Cost) ÷ Price × 100%",
    whenToUse: [
      "Pricing a product on your store's shelf — before you commit to a supplier price.",
      "Checking whether your markup style (markup on cost) translates to a healthy margin on price.",
    ],
    howToUse: [
      "Enter what the product costs you per unit.",
      "Enter your selling price.",
      "Read margin, markup and the profit you keep per sale.",
    ],
    example: {
      title: "Example: $60 cost, $100 price",
      body: "Margin 40%, markup 66.67% — you keep $40 of every $100 sale. Press Reset to reproduce it.",
    },
    excelNote: "In Excel: =(Price−Cost)/Price, formatted as a percentage.",
  },
  "wholesale-margin-calculator": {
    metaDescription:
      "Free wholesale margin calculator — bulk cost, quantity and bulk price give the total profit, margin percentage and effective unit price.",
    formula: "Margin = (Bulk price − Units × Unit cost) ÷ Bulk price × 100%",
    whenToUse: [
      "Quoting a bulk price to a retail store — know your real margin before you negotiate.",
      "Comparing per-unit economics between wholesale and direct-to-customer sales.",
    ],
    howToUse: [
      "Enter your manufacturing cost per unit.",
      "Enter how many units are in the bulk order.",
      "Enter the price you charge for the whole lot.",
    ],
    example: {
      title: "Example: 1,000 units at $5 cost, sold for $7,000",
      body: "Total cost $5,000, profit $2,000 — a 28.57% wholesale margin at an effective $7 per unit.",
    },
  },
  "reverse-margin-calculator": {
    metaDescription:
      "Free reverse margin calculator — given your selling price and target margin, find the maximum cost you can afford per unit.",
    formula: "Target cost = Price × (1 − Margin%)",
    whenToUse: [
      "When the market fixes your price and you need to know your cost ceiling.",
      "Negotiating with suppliers — walk in knowing the most you can pay.",
    ],
    howToUse: [
      "Enter the selling price the market will bear.",
      "Enter the margin your business needs.",
      "Read the maximum cost you can afford per unit.",
    ],
    example: {
      title: "Example: $100 price with a 40% target margin",
      body: "Target cost = $60 — any sourcing plan above $60/unit misses the margin. Press Reset to verify.",
    },
  },
  "amazon-seller-commission-calculator": {
    metaDescription:
      "Free Amazon seller commission calculator — referral fees, FBA fulfillment and closing fees show what you actually keep per sale.",
    formula: "Net = Price − (Price × Referral%) − Fulfillment − Closing",
    whenToUse: [
      "Pricing a product for Amazon — the fee stack routinely surprises new sellers.",
      "Auditing whether an existing listing is still profitable after a fee change.",
    ],
    howToUse: [
      "Enter the sale price and the referral fee percentage for your category (usually 8–15%).",
      "Enter the per-unit fulfillment fee and any closing fee from Seller Central.",
      "Add your product cost to see the true profit and margin.",
    ],
    example: {
      title: "Example: $100 sale, 15% referral, $8 FBA",
      body: "Amazon keeps $23 (23%) — you receive $77, and after a $40 product cost, profit is $37. Press Reset to verify.",
    },
  },
  "salesperson-profitability-calculator": {
    metaDescription:
      "Free salesperson profitability calculator — gross profit from their sales vs their full employment cost gives a hire/not-hire ROI.",
    formula: "ROI = (Revenue × Gross margin − Total comp) ÷ Total comp × 100%",
    whenToUse: [
      "Deciding whether to keep, coach or restructure a sales role.",
      "Setting realistic quota targets — the revenue a salesperson must clear to be an asset.",
    ],
    howToUse: [
      "Enter the revenue they generated and the gross margin on those sales.",
      "Enter their full cost: salary, commissions and benefits.",
      "Read the ROI and the asset verdict.",
    ],
    example: {
      title: "Example: $500k revenue at 40% margin, $110k package",
      body: "Gross profit $200k vs $110k cost → 81.8% ROI. Every $1 spent on this rep returns $1.82 in gross profit.",
    },
  },
  "payroll-overtime-calculator": {
    metaDescription:
      "Free payroll calculator with overtime — regular hours at base rate plus overtime at any multiplier, with the full FLSA breakdown.",
    formula: "Gross = Hours × Rate + OT hours × Rate × Multiplier",
    whenToUse: [
      "Running payroll for hourly employees who worked overtime.",
      "Checking a paycheck's overtime math against the FLSA time-and-a-half standard.",
    ],
    howToUse: [
      "Enter the hourly rate, regular hours and overtime hours.",
      "Keep the 1.5 multiplier for standard FLSA overtime, or change it for double-time.",
      "Read the gross pay with the regular/overtime breakdown.",
    ],
    example: {
      title: "Example: $20/h × 40 + 10 OT hours at 1.5×",
      body: "$800 regular + $300 overtime = $1,100 gross pay. Press Reset to verify.",
    },
    excelNote: "In Excel: =Reg*Rate + OT*Rate*1.5",
  },
  "gross-up-payroll-calculator": {
    metaDescription:
      "Free gross-up payroll calculator — find the gross pay that nets an employee exactly their target take-home after tax.",
    formula: "Gross = Net ÷ (1 − Tax rate)",
    whenToUse: [
      "Promising an employee a specific take-home amount — bonuses, relocations, sign-ons.",
      "Calculating the employer's cost of covering taxes on a promised net payment.",
    ],
    howToUse: [
      "Enter the take-home amount you want the employee to receive.",
      "Enter their total tax rate — federal + state + payroll.",
      "Read the gross pay to issue and the tax that gets withheld.",
    ],
    example: {
      title: "Example: $5,000 net at a 30% total tax rate",
      body: "Gross = 5,000 ÷ 0.70 = $7,142.86 — the gross-up factor is 1.429×. Press Reset to verify.",
    },
  },
  "prorated-bonus-calculator": {
    metaDescription:
      "Free prorated bonus calculator — a fair, months-worked share of the annual bonus for part-year employees and mid-year hires.",
    formula: "Prorated = Full bonus × Months worked ÷ 12",
    whenToUse: [
      "Bonus season with employees who joined mid-year or took extended leave.",
      "Making defensible, consistent bonus decisions for everyone who worked a partial year.",
    ],
    howToUse: [
      "Enter the full annual bonus for the role.",
      "Enter how many months of the bonus period the employee worked.",
      "Read the fair prorated amount.",
    ],
    example: {
      title: "Example: $5,000 bonus, 8 months worked",
      body: "$5,000 × 8/12 = $3,333.33 — two-thirds of the full bonus. Press Reset to verify.",
    },
  },
  "sales-commission-calculator": {
    metaDescription:
      "Free sales commission calculator — exact commission from sales amount and rate, with optional base draw and effective rate.",
    formula: "Commission = Sales × Rate",
    whenToUse: [
      "Checking a commission check against your comp plan.",
      "For tiered plans: run it once per tier with each slice of sales.",
    ],
    howToUse: [
      "Enter the sales amount the commission is paid on.",
      "Enter the commission rate percentage.",
      "Optionally add a base or draw — read the total payout and effective rate.",
    ],
    example: {
      title: "Example: $100,000 in sales at 5%",
      body: "Commission = $5,000 exactly. Press Reset to verify.",
    },
  },
  "payroll-conversion-calculator": {
    metaDescription:
      "Free payroll conversion calculator — annual salary into hourly, weekly, biweekly, semimonthly and monthly wages, adjusted for your schedule.",
    formula: "Hourly = Salary ÷ (Hours per week × Weeks per year)",
    whenToUse: [
      "Comparing a salaried offer against an hourly job — the honest apples-to-apples rate.",
      "Setting up payroll schedules: see what each paycheck looks like on every cadence.",
    ],
    howToUse: [
      "Enter the annual salary.",
      "Enter hours per week and working weeks per year — 52 if no unpaid leave.",
      "Read the hourly rate plus every paycheck cadence.",
    ],
    example: {
      title: "Example: $60,000 at 40 h/week, 52 weeks",
      body: "$28.85/hour · $1,153.85 weekly · $2,307.69 biweekly · $5,000 monthly. Press Reset to verify.",
    },
  },
  "retained-earnings-calculator": {
    metaDescription:
      "Free retained earnings calculator — beginning balance, net income and dividends give the ending retained earnings and retention ratio.",
    formula: "RE(end) = RE(begin) + Net income − Dividends",
    whenToUse: [
      "Preparing the statement of retained earnings for financial statements.",
      "Seeing how much profit the business keeps versus pays out to owners.",
    ],
    howToUse: [
      "Enter last period's ending retained earnings.",
      "Enter this year's net income and dividends paid.",
      "Read the new ending balance and the retention ratio.",
    ],
    example: {
      title: "Example: $100k + $50k income − $20k dividends",
      body: "Ending retained earnings = $130,000, with a 60% retention ratio. Press Reset to verify.",
    },
  },
  "cash-conversion-cycle-calculator": {
    metaDescription:
      "Free cash conversion cycle calculator — inventory days, receivable days and payable days from your balance sheet give the CCC.",
    formula: "CCC = DIO + DSO − DPO",
    whenToUse: [
      "Measuring how fast your business converts inventory spending back into cash.",
      "Diagnosing working capital problems — high DIO or DSO shows exactly where cash is stuck.",
    ],
    howToUse: [
      "Enter average inventory, receivables and payables from the balance sheet.",
      "Enter annual COGS and revenue from the income statement.",
      "Read DIO, DSO, DPO and the cash conversion cycle in days.",
    ],
    example: {
      title: "Example: 50 DIO + 30 DSO − 40 DPO",
      body: "CCC = 40 days — a dollar is tied up for 40 days between paying suppliers and collecting cash. Press Reset to verify.",
    },
    excelNote: "In Excel: DIO = Inventory/COGS*365, DSO = AR/Revenue*365, DPO = AP/COGS*365.",
  },
  "debt-payoff-extra-payments-calculator": {
    metaDescription:
      "Free debt payoff calculator with extra payments — see your debt-free date with and without the extra, and the interest you save.",
    formula: "Extra payments cut principal → every future month's interest shrinks",
    whenToUse: [
      "Deciding whether an extra $50–$500 a month is worth it (spoiler: it cuts years).",
      "Comparing payoff dates before committing to any debt-consolidation offer.",
    ],
    howToUse: [
      "Enter the balance, APR and your minimum payment.",
      "Enter the extra amount you could add each month.",
      "Read both debt-free dates, the months saved and the interest saved.",
    ],
    example: {
      title: "Example: $10,000 at 12% APR, $250 minimum + $150 extra",
      body: "52 months on minimums becomes 29 with the extra — about 2 years faster and roughly $1,400 of interest saved. Press Reset to verify.",
    },
  },
  "debt-snowball-vs-avalanche-calculator": {
    metaDescription:
      "Free snowball vs avalanche calculator — enter all your debts and see which payoff strategy is faster and cheaper for you, month by month.",
    formula: "Snowball: smallest balance first · Avalanche: highest APR first",
    whenToUse: [
      "Starting a debt payoff plan and choosing between the two famous strategies.",
      "Checking whether the motivational snowball really costs you much more than the mathematically optimal avalanche.",
    ],
    howToUse: [
      "Enter every debt with its balance, APR and minimum payment.",
      "Enter the extra monthly budget above the minimums.",
      "Both strategies simulate month by month — compare timelines, interest and first payoffs.",
    ],
    example: {
      title: "Example: three debts, $200 extra per month",
      body: "The default three-debt stack pays off in about 2 yr 8 mo either way — the calculator shows the exact interest gap for your numbers.",
    },
  },
  "marginal-propensity-to-consume-calculator": {
    metaDescription:
      "Free marginal propensity to consume calculator — how much of every extra dollar you earn gets spent versus saved, from your raise.",
    formula: "MPC = ΔConsumption ÷ ΔIncome · MPS = 1 − MPC",
    whenToUse: [
      "Economics coursework — the foundational Keynesian consumption function.",
      "Personally: see what a raise actually does to your spending before lifestyle creep sets in.",
    ],
    howToUse: [
      "Enter the change in your income — the raise or extra earnings.",
      "Enter how much of it you actually spent.",
      "Read your MPC and MPS, always between 0 and 1.",
    ],
    example: {
      title: "Example: $1,000 raise, $850 more spending",
      body: "MPC = 0.85, MPS = 0.15 — 85 cents of every extra dollar gets spent. Press Reset to verify.",
    },
  },
}
