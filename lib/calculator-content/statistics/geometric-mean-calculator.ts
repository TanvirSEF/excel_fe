import type { CalculatorDetail } from "../types"

export const geometricMeanCalculator: CalculatorDetail = {
  metaDescription:
    "Free geometric mean calculator — handles large datasets with the logarithmic method, no overflow. Instant results with formula, AM comparison and worked examples.",
  formula: "GM = ⁿ√(x₁ · x₂ · … · xₙ)",
  whenToUse: [
    "When data grows or compounds over time, a regular average often gives you the wrong answer. Investment returns, bacteria populations, and viral spread all multiply instead of adding — the geometric mean handles this kind of data correctly.",
    "The Arithmetic Mean asks: if all numbers had the same value, what number would give the same total when added? The Geometric Mean asks: if all numbers had the same value, what number would give the same result when multiplied?",
  ],
  howToUse: [
    "Enter your data series — comma separated, integers and decimals both work.",
    "Zeros are removed automatically; negative numbers are not allowed (see the FAQs below).",
    "Read the geometric mean, plus the arithmetic mean and total product for comparison.",
  ],
  example: {
    title: "Example: find the geometric mean of 2 and 8",
    body: "Multiply: 2 × 8 = 16. Count: n = 2. Root: take the square root of 16. Result: 4. Note — the arithmetic mean would be (2 + 8) ÷ 2 = 5. The geometric mean (4) is smaller and works better for multiplicative relationships.",
  },
  excelNote: "In Excel use =GEOMEAN(range).",
  method: {
    title: "How this calculator works — the log method",
    paragraphs: [
      "You can multiply small lists like 2 and 8 without any problem. But large datasets create huge numbers — multiply 50 numbers together and many standard calculators show Error or Infinity.",
      "This calculator converts each number into its natural logarithm, averages those logarithms, then converts the result back. The method produces accurate results and avoids memory overflow entirely.",
    ],
    formula: "GM = exp( Σ ln(xᵢ) ÷ n )",
  },
  facts: [
    {
      title: "1. It is always ≤ the arithmetic mean",
      body: "This is the AM-GM inequality, a basic rule of mathematics. The two means are equal only when every number in the dataset is the same (like 5, 5, 5). When numbers have a large gap — such as 1 and 100 — the geometric mean falls far below the arithmetic mean, because it dampens large swings in the data.",
    },
    {
      title: "2. It handles compounding correctly",
      body: "Imagine an investment grows +10% in year 1 (×1.10) then drops −10% in year 2 (×0.90). The arithmetic mean says (1.10 + 0.90) ÷ 2 = 1.00 — no gain or loss. Reality: 1.10 × 0.90 = 0.99 — you lost 1%. The geometric mean, √(1.10 × 0.90) = 0.9949, shows the true effect on your return.",
    },
    {
      title: "3. It requires positive numbers",
      body: "The geometric mean is undefined for datasets containing zero or negative numbers. Zero multiplies the full product to 0, so the root is also 0. Negative numbers produce imaginary roots, which standard statistical analysis does not use.",
    },
  ],
  useCases: [
    {
      title: "Finance (CAGR)",
      body: "The geometric mean is the standard way to calculate the Compound Annual Growth Rate of an investment. A simple average of yearly returns makes growth look higher than it actually is — the geometric mean shows the true, steady rate.",
    },
    {
      title: "Social media & marketing",
      body: "Marketers compare engagement rates across platforms with very different audience sizes — Instagram 1M users, Twitter 100k. A simple average of likes overweights the larger platform; the geometric mean balances the scales and shows the typical performance level.",
    },
    {
      title: "Biology & science",
      body: "Scientists use it for cell growth, bacterial multiplication and viral spread — processes that grow exponentially. Because this data follows a log-normal distribution rather than a bell curve, the geometric mean gives the true average growth or infection rate.",
    },
  ],
  faqs: [
    {
      question: "Can I use negative numbers?",
      answer:
        "No. The standard geometric mean does not work with negative numbers — you cannot take an even root, such as a square root or 4th root, of a negative number in the real number system.",
    },
    {
      question: "Why is the geometric mean better for ratios?",
      answer:
        "Ratios — such as aspect ratios 16:9 or price-to-earnings P/E — work on a multiplication scale, not an addition scale. The geometric mean treats a 2× increase and a 0.5× decrease as opposite changes that balance each other. The arithmetic mean pushes the result higher and gives a misleading value.",
    },
    {
      question: "How does this compare to the harmonic mean?",
      answer:
        "The harmonic mean always stays smaller: Arithmetic Mean ≥ Geometric Mean ≥ Harmonic Mean. People use the harmonic mean for rates like speed, the geometric mean for growth, and the arithmetic mean for sums and regular averages.",
    },
    {
      question: "What if my input has a zero?",
      answer:
        "Mathematically, any zero makes the full product zero and the geometric mean becomes 0. To keep results meaningful, this calculator removes zeros automatically before computing — the notice above the results tells you when that happened.",
    },
  ],
}
