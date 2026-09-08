import type { CalculatorDetail } from "../types"

export const enterpriseSeoRoiCalculator: CalculatorDetail = {
  metaDescription:
    "Free enterprise SEO ROI calculator — organic traffic, conversion and close rates against agency, salary and tool costs give monthly ROI, revenue, leads and CAC.",
  whenToUse: [
    "An Enterprise SEO ROI Calculator is a financial modeling tool. Organizations use it to measure the return on their organic search investments. Enterprise SEO is not like small-business SEO. It runs at a much larger scale. It often covers thousands of pages and large monthly budgets.",
    "Measuring ROI for SEO is not easy. Organic search takes time to show results. This calculator helps by using your current performance data. It looks at traffic and conversion rates. It also factors in lead-to-close rates and customer value. Together, these numbers project your annual profitability.",
    "CMOs and SEO managers can use this tool to justify their SEO budget. It shows exactly how much revenue each dollar generates. That includes spending on agency fees, internal salaries, and SEO software.",
  ],
  method: {
    title: "The Formulas and Logic Used",
    paragraphs: [
      "The calculator follows a clear path to give you numbers you can present to any boardroom:",
    ],
    equations: [
      {
        label: "Lead Generation",
        equation: "Traffic × Conversion Rate = Total Leads",
      },
      {
        label: "Sales Volume",
        equation: "Total Leads × Lead-to-Close Rate = Total Sales",
      },
      {
        label: "Gross Monthly Revenue",
        equation: "Total Sales × Average Order Value (AOV) = Monthly Revenue",
      },
      {
        label: "Total Investment",
        equation: "Agency Fees + Internal Salaries + Software Costs = Monthly Investment",
      },
      {
        label: "Net Profit",
        equation: "Monthly Revenue − Monthly Investment = Monthly Profit",
      },
      {
        label: "SEO ROI Percentage",
        equation: "(Monthly Profit ÷ Monthly Investment) × 100 = ROI%",
      },
    ],
  },
  parameters: {
    title: "Clarifying the Advanced Parameters",
    items: [
      {
        name: "Lead-to-Close Rate",
        description:
          "This is a key enterprise metric. It measures how well your sales team turns an SEO lead into a paying customer.",
      },
      {
        name: "Internal Salary",
        description:
          "Enterprise SEO is not free. You need to count the cost of your in-house SEO managers, content writers, and developers.",
      },
      {
        name: "Customer Acquisition Cost (CAC)",
        description:
          "The calculator shows your organic CAC. It tells you exactly what you pay to gain one customer through SEO.",
      },
    ],
  },
  factsTitle: "Global Investment Facts",
  facts: [
    {
      title: "United States (USA)",
      body: "The US market is the most competitive for enterprise SEO. Forrester Research shows that US enterprise companies often spend over $20,000 per month to maintain rankings. They focus on fast content production and strong technical systems.",
    },
    {
      title: "Canada (CAN)",
      body: "Canadian businesses give strong attention to bilingual SEO in English and French. Search Engine Journal data shows that Canadian firms build ROI models that account for cross-border traffic. Many Canadian sites serve a large US audience as well.",
    },
    {
      title: "England/United Kingdom (UK)",
      body: "The UK has some of the highest cost-per-click rates in Europe. This makes SEO ROI even more valuable. Many UK enterprises use SEO as their main defense against rising Google Ads costs.",
    },
    {
      title: "Australia (AUS)",
      body: "Australia has a strong digital-first economy. This has pushed large retail chains to focus on local enterprise SEO. Many use ROI calculators to track how organic search drives in-store visits through online-to-offline conversion models.",
    },
    {
      title: "India (IND)",
      body: "India is a global hub for SEO execution. Internal salaries are lower than in the US, but the traffic volume is often ten times higher. Indian enterprises focus on scale ROI. Even a small lift in conversion rate can produce massive revenue gains due to the size of the population.",
    },
  ],
  faqs: [
    {
      question: "How long does it take to see a positive ROI from SEO?",
      answer:
        "Enterprise SEO often takes 6 to 12 months to show strong ROI. After that, results can grow faster. In many cases, SEO gives much better returns than paid ads over time.",
    },
    {
      question: "Why should I include software costs?",
      answer:
        "Enterprise tools like Botify, Screaming Frog, and Ahrefs can cost thousands of dollars each year. A true ROI calculation must treat these as operating expenses.",
    },
    {
      question: "Is SEO ROI higher than PPC ROI?",
      answer:
        "PPC delivers faster results at the start. But over time, SEO ROI is almost always higher. You don’t pay for every click. As traffic grows, your cost per visit keeps dropping.",
    },
    {
      question: "What is a good SEO ROI?",
      answer:
        "Most enterprises consider 300% to 500% ROI a strong result. Top-performing companies can sometimes reach 1,000% or even more.",
    },
  ],
}
