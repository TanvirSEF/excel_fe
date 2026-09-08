import type { CalculatorDetail } from "../types"

export const b2bRoiCalculator: CalculatorDetail = {
  metaDescription:
    "Free B2B ROI calculator — leads, SQL conversion, win rates and deal value against team and software costs give your annual yield, CAC and monthly wins.",
  whenToUse: [
    "A B2B ROI Calculator is a tool that helps you measure the profit from your sales and marketing efforts. B2B means one business selling to another business.",
    "B2B sales are very different from regular consumer purchases. Consumers often buy quickly and spend less money. But B2B sales take longer and cost more. They involve many decision-makers and need a lot of work from your sales team.",
    "This calculator goes beyond basic ad spend tracking. It shows your true return on investment. It also includes costs that people often forget. These include your team’s salaries and your CRM or lead software fees.",
    "If you are a B2B Marketing Director, this tool can help you a lot. It gives you the numbers you need to request a bigger budget from your CFO.",
  ],
  method: {
    title: "The Formulas and Logic Used",
    paragraphs: [
      "The calculator uses a funnel-based attribution model:",
    ],
    equations: [
      {
        label: "Sales Qualified Leads (SQLs)",
        equation: "Total Leads × Lead-to-SQL Rate = Total SQLs",
      },
      {
        label: "Monthly Wins (Closed Deals)",
        equation: "Total SQLs × SQL-to-Win Rate = Monthly Wins",
      },
      {
        label: "Gross Monthly Revenue",
        equation: "Monthly Wins × Average Deal Value = Monthly Revenue",
      },
      {
        label: "Total Monthly Investment",
        equation: "Ad Spend + Sales Staff Costs + Software Costs = Total Investment",
      },
      {
        label: "Net B2B ROI",
        equation: "(Monthly Revenue − Total Investment) ÷ Total Investment × 100 = ROI%",
      },
    ],
  },
  parameters: {
    title: "Clarifying the Advanced Parameters",
    items: [
      {
        name: "Lead-to-SQL (%)",
        description:
          "This is the percentage of your raw leads that your sales team accepts as real opportunities. These leads are called MQLs before your team reviews them.",
      },
      {
        name: "SQL-to-Win (%)",
        description:
          "This is your closing rate. It shows how many accepted leads turn into paying customers. In B2B sales, a win means a signed contract.",
      },
      {
        name: "Customer Acquisition Cost (CAC)",
        description:
          "This is the total amount you spend to win one new business customer. It includes all related costs. If your CAC is higher than your deal value, your business model will not be sustainable.",
      },
    ],
  },
  factsTitle: "Global Investment Facts: B2B Markets",
  facts: [
    {
      title: "United States (USA)",
      body: "The US has the most developed B2B market in the world. According to Gartner, the average B2B sales cycle in the US now takes close to 7 months. US companies focus more on long-term customer value than on quick returns. They often accept a loss on the first deal. The goal is to lock in a multi-year contract and earn more over time.",
    },
    {
      title: "Canada (CAN)",
      body: "Canadian B2B companies put a lot of focus on relationship-based sales. They work hard to keep their existing customers happy. Research from BDC Canada shows that customer retention drives B2B ROI in Canada. Canadian firms use ROI calculators to measure how well their Account-Based Marketing (ABM) strategies are working.",
    },
    {
      title: "England / United Kingdom (UK)",
      body: "The UK has strict rules for B2B businesses, especially around data privacy. GDPR is a big part of how companies operate here. Getting leads the right way can cost a lot of money. But contract values in London’s finance and tech sectors tend to be high. UK businesses use ROI tools to find the right balance between these costs and returns.",
    },
    {
      title: "Australia (AUS)",
      body: "In Australia, long geographic distances make digital B2B sales more efficient. This makes digital and remote sales a smart choice for B2B businesses. Many Australian companies are now moving away from field sales. They are switching to inside sales to cut travel costs and improve their ROI.",
    },
    {
      title: "India (IND)",
      body: "India is a global leader in B2B SaaS and services. Domestic deal values may be lower than in the US. But the cost of acquiring customers is much lower too. This is due to affordable labor costs. Many Indian firms run large outbound sales teams. This approach often delivers B2B ROI above 500%.",
    },
  ],
  faqs: [
    {
      question: "What is a “good” B2B ROI?",
      answer:
        "B2B deals usually involve large amounts of money. Because of this, a good ROI starts at 3:1, which means 300% or higher. Top SaaS companies often aim for a 5:1 ratio. This gives them enough profit to reinvest and grow faster.",
    },
    {
      question: "Why should I include “Internal Costs”?",
      answer:
        "In B2B sales, your team closes the deals, not your ads. You might spend $5,000 on LinkedIn ads, but your sales rep also puts in 40 hours to close those leads. That rep’s salary is a real cost. If you leave it out, your ROI numbers will look better than they are. Always include internal costs to get an honest result.",
    },
    {
      question: "How does the “Lead-to-SQL” rate affect ROI?",
      answer:
        "The Lead-to-SQL rate affects the quality of your ROI. If you have 1,000 leads but only 1% become SQLs, your ROI stays low. Your team spends time on weak leads instead of strong opportunities. Better ROI comes from high-quality SQLs, not only from more leads.",
    },
    {
      question: "Can I use this for B2B Events?",
      answer:
        "Yes, you can. Add up all your event costs, including your booth, travel, and sponsorships. Then enter that total into the “Ad/Marketing Spend” field. After the event, enter the number of leads you got from it. The calculator will do the rest.",
    },
    {
      question: "Is LTV more important than ROI?",
      answer:
        "ROI tells you if your campaign is making money right now. LTV, or Lifetime Value, looks further ahead. It shows how much profit a customer brings over the next three years. For B2B businesses, LTV is often the more valuable metric to watch long-term.",
    },
  ],
}
