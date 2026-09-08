import type { CalculatorDetail } from "../types"

export const solarRoiCalculator: CalculatorDetail = {
  metaDescription:
    "Free solar ROI calculator — system cost with tax credits, bill offset and utility inflation give your payback period, 25-year savings and total return.",
  whenToUse: [
    "A Solar ROI Calculator is a financial tool that helps you measure the value of installing a solar photovoltaic (PV) system. Solar is not only a home upgrade but a long-term financial investment.",
    "This tool shows how much money you can save by reducing power bills. It also helps you find the Payback Period. This is the time needed for your savings to cover the full system cost. The calculator also measures the Internal Rate of Return (IRR), which shows how strong your investment can be over time.",
    "It includes benefits like the Federal Investment Tax Credit (ITC) and yearly utility rate increases. This gives you a better view of your total savings across a 25-year system life.",
  ],
  method: {
    title: "The Formulas and Logic Used",
    paragraphs: [
      "This calculator uses a compounding model that reflects how energy markets actually work:",
    ],
    equations: [
      {
        label: "Net System Cost",
        equation: "Gross Cost − Tax Credits/Rebates = Net Cost",
      },
      {
        label: "Annual Energy Savings",
        equation:
          "(Monthly Bill × 12 × System Offset) + Incentive Income = Annual Savings",
      },
      {
        label: "Utility Inflation Adjustment",
        note: "Utilities typically raise rates by 3-5% annually. The calculator compounds this every year:",
        equation: "Yearly = Yearly × (1 + Utility Inflation Rate)",
      },
      {
        label: "Payback Period",
        note: "The point in time where your compounded savings equal the net cost.",
        equation: "Σ Compounded Savings = Net Cost",
      },
    ],
  },
  parameters: {
    title: "Clarifying the Advanced Parameters",
    items: [
      {
        name: "Bill Offset (%)",
        description:
          "Most solar systems are designed to cover 80 to 100 percent of your energy needs. If you still plan to draw some power from the grid, you can adjust this percentage to match your situation.",
      },
      {
        name: "Utility Price Rise",
        description:
          "This is one of the most overlooked factors in solar planning. In many areas, electricity prices go up faster than the general cost of living. Even a 4 percent annual rise can noticeably shorten your payback period, so it is worth getting this number right.",
      },
      {
        name: "Other Income (SRECs)",
        description:
          "In some markets, you can earn Solar Renewable Energy Certificates for the power your system produces. These certificates can be sold for extra cash income, which adds another layer of return on top of your energy savings.",
      },
    ],
  },
  factsTitle: "Global Investment Facts: Solar Markets",
  facts: [
    {
      title: "United States (USA)",
      body: "The USA solar market depends on the Federal Investment Tax Credit (ITC). This incentive lets homeowners deduct 30% of their solar installation costs from their federal taxes. That is a significant reduction in your upfront cost. In many cases, it cuts the payback period from around 12 years down to under 8 years. For most homeowners, the ITC is the single biggest factor in making solar a smart financial decision.",
    },
    {
      title: "Canada (CAN)",
      body: "Solar ROI in Canada varies a lot depending on the province. Areas with high electricity prices, like Ontario, tend to see faster returns. Provinces with heavily subsidized hydro power take longer to break even. The Canada Greener Homes Grant has also played a big role in improving ROI for Canadian homeowners over the years.",
    },
    {
      title: "England/United Kingdom (UK)",
      body: "The UK solar market runs on the Smart Export Guarantee (SEG). This program replaced the old Feed-in Tariff scheme. Under the SEG, homeowners earn money by sending their excess solar energy back to the grid. Energy prices in Europe have been volatile in recent years, and that has made solar a much more attractive investment for UK homeowners today.",
    },
    {
      title: "Australia (AUS)",
      body: "Australia receives very strong sunlight across the country. This helps solar systems deliver fast returns. The Small-scale Technology Certificates (STCs) reduce upfront system costs. Many households recover their investment in about 4 to 6 years.",
    },
    {
      title: "India (IND)",
      body: "India leads in solar use due to strong sunlight across the country. The PM-Surya Ghar: Muft Bijli Yojana gives subsidies for home solar systems. Many states also support net metering. This allows users to send extra power to the grid and use it later. It can help reduce electricity bills to nearly zero.",
    },
  ],
  faqs: [
    {
      question: "Does solar increase my property value?",
      answer:
        "Yes. Homes with solar panels often sell for more. Zillow and the National Renewable Energy Laboratory (NREL) report about a 4% higher sale price for solar homes. Each $1 saved on energy can add around $20 to home value.",
    },
    {
      question: "What is the typical lifespan of a solar system?",
      answer:
        "Most modern solar panels come with a 25-year warranty. They can still produce power after that period. Their output slowly drops over time. Many systems can work for 30 to 40 years.",
    },
    {
      question: "Does the ROI include a battery (like a Tesla Powerwall)?",
      answer:
        "A battery improves energy independence, but it also raises the upfront cost. This often increases the payback time. This calculator works for both setups. You can add battery cost under total system cost.",
    },
    {
      question: "What happens if I sell my house before the payback period?",
      answer:
        "Solar panels often increase your home value. If you sell your house early, the higher sale price can help you recover the remaining system cost.",
    },
    {
      question: "Does solar work in cloudy climates?",
      answer:
        "Yes. Solar panels generate power from light, not heat. Countries like Germany and the UK use solar widely despite cloudy weather.",
    },
  ],
}
