import type { CalculatorDetail } from "../types"

export const zScoreToPercentileCalculator: CalculatorDetail = {
  metaDescription:
    "Free z-score to percentile calculator with bell curve graph — see your percentile rank, probability and how many people you scored above, instantly.",
  formula: "Percentile = Φ(z) × 100%  ·  z = (x − μ) ÷ σ",
  whenToUse: [
    "A test score alone does not say much — a score of 75 may rank very high or very low. You need your percentile rank to understand your position. This calculator converts your z-score to a percentile and shows how many people you scored above.",
    "The z-score is the distance: how far a data point is from the average. A z-score of 0 means exactly average; +1 means one standard deviation above. The percentile is the rank: how many values fall below yours — the 80th percentile means you scored higher than 80% of the group.",
  ],
  howToUse: [
    "Enter a z-score directly, or switch to Raw Score mode and provide your score, the mean and the standard deviation.",
    "The calculator evaluates the cumulative distribution function (CDF) — the area under the bell curve from the left up to your z-score.",
    "Read the percentile, the probability, the right-tail percentage and the bell curve visualization with the shaded area.",
  ],
  example: {
    title: "A simple example — height",
    body: "The average height for men is 70 inches with a standard deviation of 3 inches. Your height is 76 inches. Subtract the average: 76 − 70 = 6. Divide by the SD: 6 ÷ 3 = 2. Your z-score is 2.0, which equals the 97.7th percentile — you are taller than about 98% of men.",
  },
  excelNote: "In Excel use =NORM.S.DIST(z, TRUE) for the probability, then format as a percentage.",
  method: {
    title: "How this calculator works — the CDF",
    paragraphs: [
      "The calculator uses the cumulative distribution function. The bell curve represents the full population, and the area under the curve shows probability. The curve splits into two equal parts at z = 0, which gives a percentile of 50% — the exact middle.",
      "A positive z-score moves above the average: the calculator measures the area from the left side of the curve to your score. A negative z-score moves below the average, where the area becomes smaller. People once used a large chart called a Z-Table to find percentiles by hand — this calculator replaces it with instant, more exact results.",
    ],
    formula: "Percentile = Φ(z) × 100",
  },
  facts: [
    {
      title: "1. The 68-95-99.7 rule",
      body: "68% of all people fall between z = −1 and +1 — the average group. 95% fall between −2 and +2; outside this range you are unusual. 99.7% fall between −3 and +3; falling outside is extremely rare. Use this rule to estimate percentiles without a calculator.",
    },
    {
      title: "2. Percentiles can never reach 100%",
      body: "The 100th percentile is mathematically impossible — the bell curve stretches forever in both directions without ever touching the bottom. Even a z-score of 5.0 only reaches 99.99997%. Most tests report a highest percentile of 99.9th.",
    },
    {
      title: "3. Symmetry is key",
      body: "The normal distribution is perfectly symmetrical. A z-score of +1.0 equals the 84th percentile; a z-score of −1.0 equals the 16th percentile. Notice that 100 − 84 = 16. If you know the percentile for a positive z-score, you already know the negative version — just subtract from 100.",
    },
  ],
  useCases: [
    {
      title: "Standardized tests",
      body: "A raw SAT or IQ score does not show your full ranking. An IQ score of 130 has a z-score of +2.0, which falls near the 98th percentile — the top 2% of test takers.",
    },
    {
      title: "Baby growth charts",
      body: "Doctors use percentiles to track child growth: a baby in the 15th percentile for weight weighs more than 15 out of 100 babies of the same age. Z-scores help doctors follow growth over time and spot problems early.",
    },
    {
      title: "Product quality checks",
      body: "Factories use z-scores to keep products consistent — a soda machine aiming for 500 ml with fills at 498 or 502 ml. Engineers study the z-scores of fill amounts; the Six Sigma method targets a z-score close to 6.",
    },
  ],
  faqs: [
    {
      question: "Can a percentile be negative?",
      answer:
        "No. Percentiles always stay between 0% and 100%. A z-score, however, can be negative — meaning your value falls below the average. A z-score of −2.0 matches the 2.28th percentile: a low rank, but still positive.",
    },
    {
      question: "What is a good z-score?",
      answer:
        "It depends on what you measure. Test scores and income favor higher values — a positive z-score above +1.0 is often good. Golf scores and race times favor lower values — a negative z-score below −1.0 is better. In most situations, a z-score between −1 and +1 falls within the normal range.",
    },
    {
      question: "Why does the graph never touch the bottom line?",
      answer:
        "The normal distribution follows a special pattern — the curve moves closer to zero as the z-score increases, but never fully reaches it. This means rare events can still happen: the chance becomes very small, but never completely disappears.",
    },
    {
      question: "How do I calculate my z-score if I don't have it?",
      answer:
        "Subtract the average from your raw score, then divide by the standard deviation: z = (x − μ) ÷ σ. Or simply switch to Raw Score mode above and the calculator derives it for you.",
    },
  ],
}
