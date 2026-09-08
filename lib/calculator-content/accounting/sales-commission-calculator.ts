import type { CalculatorDetail } from "../types"

export const salesCommissionCalculator: CalculatorDetail = {
  metaDescription:
    "Free sales commission calculator — base salary, revenue, quota and accelerator rates give total earnings, commission and quota attainment for flat or tiered plans.",
  whenToUse: [
    "Sales commission is a type of pay that depends on the money an employee brings in. It changes based on performance and links income to sales results.",
    "This pay structure pushes sales professionals to perform better. Higher sales lead to higher earnings.",
    "Most pay plans include two parts: Base Salary — a base salary gives a fixed amount of income in every pay cycle. Commission — a commission adds extra pay based on a share of the sales a person makes.",
  ],
  factGroups: [
    {
      title: "How Does Our Calculator Work?",
      intro:
        "Sales plans often reward strong performance with extra pay for higher results. This calculator supports both simple plans and more advanced structures.",
      items: [
        {
          title: "Standard Commission (Flat Rate)",
          body: "A flat commission plan pays the same rate on all sales. The calculator follows this model when the accelerator option stays off. The system applies the base commission rate to total revenue. A 5% rate means every dollar earns the same percentage.",
        },
        {
          title: "Quotas and Accelerators (Tiered)",
          body: "Many sales plans set a quota as a target amount. A quota of $40,000 is a common example. Earnings follow two steps under this setup. Sales up to the quota use the base rate. Sales above the quota use a higher accelerator rate. The calculator splits income across these two levels. It applies 10% on the first $40,000. It applies 15% on any amount above that. A $50,000 sale with a $40,000 quota earns pay from both rates.",
        },
        {
          title: "OTE (On-Target Earnings)",
          body: "OTE shows expected income when the quota reaches full completion. The system displays an attainment percentage in the results. A 100% attainment level signals full target performance. At that point, earnings match the planned on-target amount.",
        },
      ],
    },
    {
      title: "Important Facts About Sales Pay",
      items: [
        {
          title: "Accelerators Change the Game",
          body: "Accelerators shape how pay grows. A strong plan increases commission after reaching the target. Many plans double the rate after hitting 100 percent of the quota. This structure pushes higher effort near the end of a sales cycle. The over-quota rate often matters during job offer talks.",
        },
        {
          title: "Revenue vs Gross Margin",
          body: "Sales pay often uses revenue as the base. Revenue means the full sales amount. Some industries use gross profit instead. Gross profit equals revenue minus product cost. Hardware and construction roles often follow this model. Correct input in the revenue field helps produce accurate results.",
        },
        {
          title: "The “Cliff”",
          body: "Some plans include a cliff. A cliff stops commission until a minimum sales level. A salesperson earns nothing before reaching that level. Some plans start payouts after 50 percent of the quota. Most modern tech and service roles pay from the first sale. This calculator follows that common setup.",
        },
      ],
    },
  ],
  useCases: [
    {
      title: "End-of-Month Planning",
      body: "The month is almost over and the quota sits close. The calculator helps check how much extra income a final deal can bring. A $5,000 deal may push sales into an “Accelerator” level. That step can raise the commission more than expected.",
    },
    {
      title: "Job Offer Comparison",
      body: "One company gives a $60k base salary with 5% commission. Another company offers a $40k base salary with 10% commission. Both options need comparison based on total earnings. Expected yearly sales, such as $500k, help test both cases in the calculator. A lower base can still bring higher income for strong performers.",
    },
    {
      title: "Setting Personal Goals",
      body: "Monthly needs may include $8,000 for expenses and savings. The calculator helps work backward from that number. Base salary goes into the tool first. Sales targets then adjust until the result reaches the income goal. This method sets a clear sales target for the month.",
    },
  ],
  faqs: [
    {
      question: "Is commission taxed differently than salary?",
      answer:
        "Tax systems in many countries treat commission as supplemental income. Employers often apply a flat withholding rate when they pay it out. This rate can be higher than normal income tax brackets. At the end of the year, tax offices treat commission as regular earned income. A refund can apply if the withheld amount exceeds the final tax due.",
    },
    {
      question: "What does “Draw against Commission” mean?",
      answer:
        "A draw works like an advance payment. The company pays a fixed amount at the start of the period. This amount acts like a temporary loan against future earnings. Later commissions cover this advance first. Any extra commission above the draw goes into the final payout.",
    },
    {
      question: "Can this tool handle tiered commission structures with 3+ levels?",
      answer:
        "The calculator supports simple structures with a base rate and one bonus level. More complex plans with three or four tiers need separate calculations. Each tier can be calculated on its own. The final earnings come from adding all tier results together.",
    },
    {
      question: "Should sales tax be included in the sales number?",
      answer:
        "Sales tax or VAT should stay out of the calculation. The commission uses net revenue, which means the sale price without tax. Adding tax increases the base amount incorrectly. That leads to higher commission numbers than actual earnings.",
    },
    {
      question: "What is a “Clawback”?",
      answer:
        "A clawback happens after a refund or order cancellation. The company removes the related commission from a later paycheck. This adjustment balances out the earlier payout. The calculator estimates earnings based on completed and valid sales only.",
    },
  ],
}
