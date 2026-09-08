import type { CalculatorDetail } from "../types"

export const cashConversionCycleCalculator: CalculatorDetail = {
  metaDescription:
    "Free cash conversion cycle calculator — revenue, COGS, inventory, receivables and payables give your CCC with DIO, DSO and DPO breakdown.",
  whenToUse: [
    "The Cash Conversion Cycle (CCC) shows how many days a business needs to turn money spent on inventory into cash from sales. It measures the time between buying products and collecting payment from customers.",
    "Business owners often use this metric to track how long their money stays tied up in daily operations. A shorter cycle means the business buys inventory, sells products, and receives payment faster. In Contrast, a longer cycle means money remains locked in unsold stock or unpaid customer bills for a longer time. As a result, a business can face cash shortages even when sales remain strong.",
  ],
  method: {
    title: "The Core Formula",
    paragraphs: [
      "The Cash Conversion Cycle (CCC) combines three time periods that track how cash moves through a business.",
      "The formula adds DIO and DSO because both periods represent time spent waiting for cash to come in. The formula subtracts DPO because extra time before supplier payments helps a business keep cash on hand for longer.",
    ],
    equations: [
      {
        label: "CCC",
        equation: "CCC = DIO + DSO − DPO",
        terms: [
          {
            name: "(+) DIO",
            description:
              "Days Inventory Outstanding: Measures the number of days a business needs to sell its inventory.",
          },
          {
            name: "(+) DSO",
            description:
              "Days Sales Outstanding: Measures the number of days a business needs to collect payment from customers.",
          },
          {
            name: "(−) DPO",
            description:
              "Days Payable Outstanding: Measures the number of days a business takes to pay suppliers.",
          },
        ],
      },
      {
        label: "A Simple Example",
        note: "A furniture store buys a sofa for resale. It takes 50 days to sell a sofa (DIO), customers pay 30 days after purchase (DSO), and the supplier gets paid 40 days after delivery (DPO).",
        equation: "CCC = 50 + 30 − 40 = 40 days",
      },
    ],
  },
  factGroups: [
    {
      title: "How This Calculator Works",
      intro:
        "Manual calculation takes time. It also requires checking different financial statements. This calculator handles that work by using common values from the balance sheet and income statement.",
      items: [
        {
          title: "Revenue and COGS (Base Data)",
          body: "Income statements provide the first set of numbers. Revenue: It shows total sales for a period. Cost of Goods Sold (COGS): It shows the direct cost of producing those goods. The calculator uses these figures to set a base for the calculation.",
        },
        {
          title: "Working Capital Inputs",
          body: "Balance sheets provide the next set of values. Average Inventory: It means the goods are ready for sale. Accountants often find it by adding opening and closing inventory and dividing by two. Accounts receivable: It shows money that customers still owe after credit sales. Accounts payable shows money owed to suppliers for purchases.",
        },
        {
          title: "Final Result",
          body: "The calculator turns these values into days based on the selected time period. Most users pick 365 days for a full year. After that, the tool combines the numbers and produces the final cycle result.",
        },
      ],
    },
    {
      title: "Important Facts About Cash Flow",
      items: [
        {
          title: "Negative CCC is Possible (and Powerful)",
          body: "Some companies, especially large online retailers, run a negative cash conversion cycle. They move inventory fast (low DIO). Customers pay instantly by card (low DSO). They negotiate 60 to 90 days to pay suppliers (high DPO). A negative CCC means customers pay before the business pays its suppliers. Essentially, suppliers end up funding business growth at zero cost.",
        },
        {
          title: "Efficiency vs. Risk",
          body: "Stretching DPO improves the score, but pushing it too far creates real problems. Suppliers who keep getting paid late may cut off the account, drop product quality, or remove early-payment discounts. The target is better operations, not strained supplier relationships.",
        },
        {
          title: "Industry Benchmarks Matter",
          body: "A 60-day CCC could mean trouble for a grocery store where products spoil fast, yet signal strong performance for a construction firm handling long projects. Comparing numbers to Apple or Amazon tells you nothing useful. Match the benchmark to businesses in the same industry.",
        },
      ],
    },
  ],
  useCases: [
    {
      title: "Identifying Cash Traps",
      body: "High sales but an empty bank account often point to a cycle problem. Running the numbers might show a DSO of 75 days from slow invoice follow-up. That specific figure tells you exactly where to act: collections.",
    },
    {
      title: "Supplier Negotiation",
      body: "Hard data makes supplier negotiations stronger. A DPO sitting for 15 days leaves a lot of room to push for better terms. Calculate how much cash flow a move to Net 45 would free up before walking into that conversation.",
    },
    {
      title: "Inventory Planning",
      body: "A rising DIO year over year means stock stays on shelves longer than it should. That pattern signals dead stock or poor product selection. Tracking this number lets you adjust purchase orders before unsold goods eat into your cash.",
    },
  ],
  faqs: [
    {
      question: "Is a lower CCC always better?",
      answer:
        "A lower CCC usually helps a business. It means cash returns faster and the company depends less on outside funding. Still, very low inventory days can create problems. A business may run out of stock and miss sales. Customers may also lose trust if products are not available.",
    },
    {
      question: "Does this include operating expenses?",
      answer:
        "The CCC does not cover general business costs. It focuses on working capital that links to products. It tracks inventory, customer payments, and supplier payments. Costs like rent, salaries, utilities, and marketing do not fall under this measure.",
    },
    {
      question: "Why use COGS instead of revenue?",
      answer:
        "COGS helps measure inventory and payables because it reflects the cost recorded in accounting books. Revenue works for receivables because invoices use sales value. This approach keeps the numbers aligned and supports correct calculations.",
    },
    {
      question: "How can I improve my CCC?",
      answer:
        "A business can improve CCC in three main ways. Faster sales reduce inventory holding time. Quick invoicing and strong follow-ups help collect payments sooner. Longer supplier payment terms also help keep cash longer in the business.",
    },
    {
      question: "Does this calculator work for service businesses?",
      answer:
        "Service businesses often have no physical stock, so inventory stays at zero. The formula still works in that case. CCC becomes less important for service firms than for retailers, wholesalers, or manufacturers that manage physical goods.",
    },
  ],
}
