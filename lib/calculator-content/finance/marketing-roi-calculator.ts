import type { CalculatorDetail } from "../types"

export const marketingRoiCalculator: CalculatorDetail = {
  metaDescription:
    "Free marketing ROI calculator — ad spend, labor costs, COGS and revenue give your true return yield, ROAS, gross margin and break-even revenue.",
  whenToUse: [
    "A Marketing ROI Calculator is a financial tool that helps your businesses track their marketing performance. Many marketers focus on likes, shares, and traffic numbers. But those numbers do not tell you if you are actually making money.",
    "This tool shows you exactly how much profit you make for every dollar spent on marketing. Your Cost of Goods Sold (COGS) and labor costs are both factored in. This gives you a more accurate view of your results than a basic ROAS formula.",
    "It is a must-have tool for anyone who wants to improve their marketing funnel. This calculator also helps you show your team and stakeholders the true value of your campaigns.",
  ],
  method: {
    title: "The Formulas and Logic Used",
    paragraphs: [
      "Our calculator uses solid accounting logic to give you accurate results:",
    ],
    equations: [
      {
        label: "Total Marketing Investment",
        equation: "Ad Spend + Labor/Agency Costs = Total Investment",
      },
      {
        label: "Gross Margin",
        note: "This accounts for the cost of producing the product or service sold.",
        equation: "Gross Revenue × (1 − COGS%) = Gross Margin",
      },
      {
        label: "Net Marketing Profit",
        equation: "Gross Margin − Total Investment = Net Profit",
      },
      {
        label: "Marketing ROI Percentage",
        equation: "(Net Profit ÷ Total Investment) × 100 = ROI%",
      },
      {
        label: "ROAS (Return on Ad Spend)",
        note: "A common metric for evaluating specific ad efficiency.",
        equation: "Gross Revenue ÷ Ad Spend = ROAS",
      },
    ],
  },
  parameters: {
    title: "Clarifying the Advanced Parameters",
    items: [
      {
        name: "Cost of Goods Sold (COGS)",
        description:
          "This is what it costs you to deliver your product. It covers things like manufacturing and shipping. For example, if you sell a $100 item and it costs $30 to make, your COGS is 30%.",
      },
      {
        name: "Labor/Admin Cost",
        description:
          "Running marketing takes more than ad spend. It also includes your team’s salaries or the fees you pay to an outside agency.",
      },
      {
        name: "Customer Lifetime Value (CLV)",
        description:
          "For many businesses, the first sale is only the start. CLV shows you if your marketing pays off over time, even when the upfront cost to get a customer is high.",
      },
    ],
  },
  factsTitle: "Global Marketing Insights",
  facts: [
    {
      title: "United States (USA)",
      body: "The US has one of the most competitive marketing landscapes in the world, with some of the highest Cost-Per-Click (CPC) rates. According to eMarketer, US companies are shifting their focus toward “Efficiency Ratios” instead of just chasing volume. More businesses are using ROI calculators to move their budgets toward customer segments with higher lifetime value.",
    },
    {
      title: "Canada (CAN)",
      body: "Canadian businesses often deal with a fragmented market. The Canadian Marketing Association notes that Canadian companies focus on ROI models that account for high shipping and logistics costs. This makes the COGS parameter in our calculator very important for getting accurate results.",
    },
    {
      title: "England/United Kingdom (UK)",
      body: "UK businesses have moved strongly toward privacy-first marketing. After strict GDPR rules came into effect, companies now use ROI tools to justify the higher costs of collecting first-party data and running permission-based campaigns.",
    },
    {
      title: "Australia (AUS)",
      body: "Australia’s digital economy is growing fast, but its smaller population makes market saturation a real concern. Australian marketers use ROI calculators to spot when their campaigns start losing steam. This helps them avoid overspending once they’ve reached their target audience.",
    },
    {
      title: "India (IND)",
      body: "India leads the world in high-volume, low-cost customer acquisition. Many Indian businesses focus on scalability ROI. With a huge mobile-first population, even a small improvement in conversion rate can lead to a big jump in profit.",
    },
  ],
  faqs: [
    {
      question: "What is a “Good” Marketing ROI?",
      answer:
        "A common benchmark in the industry is a 5:1 ratio. This means five dollars in revenue for every one dollar spent. A 10:1 ratio is seen as excellent. A 2:1 ratio often shows that marketing is only covering basic costs after expenses.",
    },
    {
      question: "What is the difference between ROI and ROAS?",
      answer:
        "ROAS looks at revenue from ad spend only. For example, 100 dollars in revenue from 20 dollars in ads gives a 5x ROAS. ROI goes deeper and includes labor, software, and product costs. It shows the full profit of your marketing efforts.",
    },
    {
      question: "Why should I include Customer Lifetime Value (CLV)?",
      answer:
        "If you only count the first sale, marketing may look unprofitable. But many customers buy again over time. If they return and buy more, your marketing can become highly profitable in the long run.",
    },
    {
      question: "How do I lower my break-even price?",
      answer:
        "You can lower your break-even point by reducing product costs. You can also reduce labor costs or adjust your pricing. Each change helps improve your overall profit margin.",
    },
    {
      question: "Should I calculate ROI monthly or annually?",
      answer:
        "Monthly tracking helps you adjust your ads quickly. It works well for short-term decisions. Annual tracking helps you understand long-term performance and overall business health.",
    },
  ],
}
