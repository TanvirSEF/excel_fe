import type { CalculatorDetail } from "../types"

export const rentalPropertyRoiCalculator: CalculatorDetail = {
  metaDescription:
    "Free rental property ROI calculator for cash investors — purchase costs, rent, vacancy and expenses give your cash-on-cash return, NOI and monthly profit, with no debt needed.",
  whenToUse: [
    "A Rental Property ROI Calculator is a financial tool for property investors. It helps you measure how profitable a real estate investment really is. This calculator focuses on the Cash-on-Cash Return model, not only rent versus price.",
    "This tool is very useful for investors who avoid interest or prefer to buy property with cash. It subtracts costs like maintenance, insurance, vacancy loss, and management fees from your monthly rent. The result is your Net Operating Income (NOI). This helps you compare properties and pick the one with the best return.",
  ],
  method: {
    title: "The Core Logic: Formulas and Equations",
    paragraphs: [
      "Our calculator uses standard financial equations to give you accurate and reliable results.",
    ],
    equations: [
      {
        label: "Total Cost Basis (Capital Invested)",
        equation: "Purchase Price + Closing Costs + Initial Repairs = Total Investment",
      },
      {
        label: "Effective Gross Income (EGI)",
        note: "This accounts for the reality that a property may sit empty for a few weeks a year.",
        equation: "(Monthly Rent × 12) − Vacancy Loss = Effective Gross Income",
      },
      {
        label: "Total Operating Expenses",
        equation:
          "Property Taxes + Insurance + Maintenance + Management Fees + Utilities = Total Expenses",
      },
      {
        label: "Net Operating Income (NOI)",
        equation: "Effective Gross Income − Total Operating Expenses = NOI",
      },
      {
        label: "Annual ROI (Cap Rate for Cash Buyers)",
        equation: "(NOI ÷ Total Investment) × 100 = ROI%",
      },
    ],
  },
  parameters: {
    title: "Clarifying the Parameters",
    intro:
      "Understanding these inputs helps you make a more realistic financial plan.",
    items: [
      {
        name: "Closing Costs",
        description:
          "These are fees for title insurance, legal work, and government recording. They usually fall between 2% and 5% of the property price.",
      },
      {
        name: "Vacancy Rate",
        description:
          "This is how often your property sits empty. A safe estimate to use is between 5% and 8%.",
      },
      {
        name: "Maintenance/Yr",
        description:
          "This is the money you set aside for repairs each year. For older homes, a good rule is 1% of the property value.",
      },
      {
        name: "Management Fee",
        description:
          "This is what you pay a property manager to handle tenants. It typically runs between 8% and 12% of the rent collected.",
      },
    ],
  },
  factGroups: [
    {
      title: "Essential Facts About Rental Property Investing",
      items: [
        {
          title: "Cash Flow vs. Appreciation",
          body: "Real estate investors earn money in two main ways. The first is Cash Flow, which is the monthly profit from rent. The second is Appreciation, which is the rise in property value over time. Strong cash flow protects you when the market slows down and property prices fall.",
        },
        {
          title: "Operating Expense Ratios",
          body: "Many experienced investors use the “50% Rule” as a quick screening tool. It says that operating expenses will use up about 50% of your gross rent over time. You can use this benchmark to check if your expense estimates are realistic.",
        },
        {
          title: "The No-Interest Advantage",
          body: "Investing without interest-based loans greatly reduces your financial risk. Without a monthly mortgage, you can survive long vacancy periods or market downturns without facing foreclosure. This debt-free approach is the foundation of many Shariah-compliant strategies and long-term wealth building.",
        },
      ],
    },
    {
      title: "Global Investment Facts: Insights by Region",
      intro:
        "Rental rules and tax treatments differ across major property markets worldwide.",
      items: [
        {
          title: "United States (USA)",
          body: "In the US, Cash-on-Cash return is the main metric most equity investors use. The IRS lets you claim depreciation as a yearly tax deduction. This reduces your taxable income. In the first few years, your cash flow can end up nearly tax-free.",
        },
        {
          title: "United Kingdom (UK)",
          body: "The UK Buy-to-Let market has gone through major regulatory changes in recent years. Cash investors still hold a strong position since interest-deduction rules only affect mortgage holders. Keep in mind that Stamp Duty Land Tax (SDLT) adds a 3% surcharge on second homes, which makes it a significant upfront cost.",
        },
        {
          title: "Australia (AUS)",
          body: "Australia is well known for Negative Gearing, but cash investors focus more on Gross Rental Yield. Cities like Perth and Brisbane tend to offer higher yields than Sydney or Melbourne. The Australian Tax Office also allows Capital Works Deductions for newer properties, which helps reduce taxable income.",
        },
        {
          title: "Canada (CAN)",
          body: "The Canadian rental market faces high demand and tight supply right now. Cash buyers typically use the Capitalization Rate as their main performance metric. Many Canadian provinces have strict Rent Control rules that limit annual rent increases and directly affect your long-term ROI.",
        },
        {
          title: "India (IND)",
          body: "Real estate has long been a trusted way to store wealth in India. Residential rental yields tend to sit between 2% and 3%, which is lower than the US market. However, the potential for capital appreciation is much higher. Indian landlords also get a 30% Standard Deduction under Section 24 of the Income Tax Act. This deduction directly reduces their taxable rental income each year.",
        },
      ],
    },
  ],
  faqs: [
    {
      question: "What is a good ROI for a rental property?",
      answer:
        "A good ROI depends on the location. For residential properties bought with cash, 6% to 10% is a strong return. High-risk areas usually need 12% or more to be worth your money. In stable, high-demand cities, returns typically fall between 4% and 5%.",
    },
    {
      question: "Why should I include a Vacancy Rate if I already have a tenant?",
      answer:
        "Tenants eventually move out. A 5% vacancy rate helps you save money for the gap between leases. You will need that time to clean, fix, and re-list the property for a new tenant.",
    },
    {
      question: "Is Maintenance a fixed cost?",
      answer:
        "No, maintenance costs change from year to year. Some years you spend nothing at all. Other years you may need to replace a roof or a water heater. The calculator uses an annual average to help you plan your budget with more accuracy.",
    },
    {
      question: "How do closing costs affect my ROI?",
      answer:
        "Closing costs add to your total investment amount. Since ROI divides your income by your total investment, higher closing costs bring your return percentage down slightly.",
    },
    {
      question: "Can I use this calculator for commercial property?",
      answer:
        "Yes, you can. The NOI and ROI calculations work the same way for shops, warehouses, and offices. You only need to adjust the maintenance and insurance fields to fit your property type.",
    },
  ],
}
