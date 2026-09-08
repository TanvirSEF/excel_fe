import type { CalculatorDetail } from "../types"

export const criticalZValueCalculator: CalculatorDetail = {
  metaDescription:
    "Free critical z-value calculator with rejection region graph — find critical values for any confidence level (90%, 95%, 99%), one or two-tailed. Instant results.",
  formula: "z_critical = Φ⁻¹(1 − α) [one-tailed] · z_critical = ±Φ⁻¹(1 − α/2) [two-tailed]",
  whenToUse: [
    "Every scientific experiment has a turning point — the point where data stops looking average and becomes statistically significant. The Critical Z-Value Calculator finds this boundary in seconds, whether you use a 95% confidence level or a stricter 99% study.",
    "Think of a game where you throw a ball into a bucket: a small miss feels normal, a large miss feels unusual. The critical z-value sets that limit — if your result stays inside the acceptance region, it is normal chance. If it goes into the rejection zone, you call it statistically significant.",
  ],
  howToUse: [
    "Pick the significance level (α): 0.05 for most studies, 0.01 for medical studies, or 0.10 for exploratory marketing work.",
    "Choose the test type: two-tailed (standard — checks for any difference) or one-tailed (left/right — checks one direction only).",
    "Read the critical z-value, the rejection region area, and the confidence level — the curve shows the rejection zones in red.",
  ],
  example: {
    title: "Example: 95% confidence, two-tailed",
    body: "α = 0.05 split into two tails of 2.5% each. The calculator finds the cutoff for both ends: ±1.960. If your z-score goes above 1.96 or below −1.96, you reject the null hypothesis.",
  },
  excelNote: "In Excel use =NORM.S.INV(1 − α/2) for two-tailed critical values, or =NORM.S.INV(1 − α) for one-tailed.",
  method: {
    title: "Understanding the logic — tails and alpha",
    paragraphs: [
      "The significance level (α) sets your risk limit: 0.05 means 95% confident, 0.01 means 99% confident, 0.10 means 90% confident. Most studies use 0.05; medical studies prefer 0.01 for extra safety.",
      "Two-tailed test (the standard): you look for any kind of difference — the calculator splits α in half, putting α/2 on each side of the curve. One-tailed test: you care about only one direction — the calculator places the full α on one side, which lowers the cutoff to 1.645 instead of 1.96, making significance easier to reach.",
    ],
    formula: "Two-tailed: α/2 in each tail · One-tailed: full α in one tail",
  },
  facts: [
    {
      title: "1. The big three numbers",
      body: "Statisticians memorize three critical values: ±1.645 for 90% confidence (or 95% one-tailed), ±1.960 as the standard for 95% confidence, and ±2.576 for 99% confidence in strict tests. If you see a z-score of 3.0, it already passes all three.",
    },
    {
      title: "2. Critical values define the rejection region",
      body: "The red zone on the graph is the rejection region — where the null hypothesis fails. If your test statistic enters this zone beyond the critical value, you reject the null. Most experiments aim for this result because it shows a meaningful finding.",
    },
    {
      title: "3. Z vs. T — the sample size rule",
      body: "This calculator uses critical z-values, which work when your sample size exceeds 30. With a small sample — like 5 patients — z-values do not work well; you need a critical t-value instead, which uses a higher cutoff to handle the uncertainty.",
    },
  ],
  useCases: [
    {
      title: "A/B testing (marketing)",
      body: "You test two website headlines at 95% confidence. Before collecting data, set the cutoff at 1.96. After a week, your z-score of 2.1 exceeds 1.96 — the result is significant, switch to the new headline.",
    },
    {
      title: "Quality assurance (factories)",
      body: "A factory making 10mm steel bolts sets a strict 99% confidence level (α = 0.01), giving a critical value of ±2.576. A batch returns a z-score of −2.8 — in the rejection region. The bolts are too thin; the manager stops the machine.",
    },
    {
      title: "Political polling",
      body: "When news channels say 'Candidate A leads by 4 points with a margin of error of 3%,' they base the margin on critical values. The margin of error equals the critical value multiplied by the standard error — 1.96 for 95% confidence.",
    },
  ],
  faqs: [
    {
      question: "What is the difference between a z-score and a critical value?",
      answer:
        "Think of the critical value as the goal post and the z-score as the ball. The critical value sets a fixed line before the test — it depends on your confidence level. The z-score shows your result after collecting data. You score a goal when your z-score passes the critical value.",
    },
    {
      question: "Why is the critical value lower for a one-tailed test?",
      answer:
        "A one-tailed test puts the full error budget on one side, moving the cutoff closer to the center. Two-tailed at 5%: cutoff is 1.96. One-tailed at 5%: cutoff is 1.645. This makes significance easier to reach, but you must ignore results in the opposite direction.",
    },
    {
      question: "Can a critical value be negative?",
      answer:
        "Yes. A left-tailed test uses a negative value because it looks for a decrease — for example, −1.645. A two-tailed test uses both sides, so it includes a positive and a negative value such as ±1.96.",
    },
    {
      question: "What happens if my z-score matches the critical value?",
      answer:
        "This is a borderline case. Most rules say you reject only when |z| exceeds the critical value strictly. At exactly 1.96 vs. 1.96, you fail to reject — you are close but do not pass. Collect more data for a clearer result.",
    },
    {
      question: "Does the sample size change the critical z-value?",
      answer:
        "No. The z-distribution keeps it fixed: a 95% confidence level always uses 1.96, whether you have 50 people or 5 million. Note: this rule does not apply to t-tests, where t-values change with sample size.",
    },
  ],
}
