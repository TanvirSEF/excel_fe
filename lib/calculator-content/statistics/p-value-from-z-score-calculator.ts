import type { CalculatorDetail } from "../types"

export const pValueFromZScoreCalculator: CalculatorDetail = {
  metaDescription:
    "Free p-value calculator with bell curve graph — exact one or two-tailed p-values from any z-score, with significance verdict and rejection region visualization.",
  formula: "P = 2 × (1 − Φ(|z|)) for two-tailed · P = 1 − Φ(z) for one-tailed",
  whenToUse: [
    "In statistics, numbers need proper meaning. You may find a difference in your results, but that difference may come from random chance. The p-value measures that chance — it shows how likely your result appeared by accident.",
    "The p-value is a number between 0 and 1 that measures the strength of evidence against the null hypothesis (H₀). The null hypothesis means nothing changed — a medicine shows no effect, or two groups stay the same. The p-value shows the chance of getting results this extreme if the null hypothesis is true.",
  ],
  howToUse: [
    "Enter your z-score — the test statistic from your z-test or analysis.",
    "Pick the hypothesis type: two-tailed (any difference), left-tailed (decrease), or right-tailed (increase).",
    "Pick the significance level (α) — 0.05 is standard, 0.01 is strict, 0.10 is exploratory.",
    "Read the p-value, the significance verdict, and the bell curve showing the p-value as the shaded area.",
  ],
  example: {
    title: "Example: the classic boundary",
    body: "z = 1.96 with a two-tailed test gives p = 0.0500 — exactly at the edge of significance at α = 0.05. A z-score of 2.576 gives p = 0.0100; a z of 3.00 gives p = 0.0027 (extremely significant).",
  },
  excelNote: "In Excel: =2*(1-NORM.S.DIST(ABS(z),TRUE)) for two-tailed, or =1-NORM.S.DIST(z,TRUE) for right-tailed.",
  method: {
    title: "How to use this calculator — tails & alpha",
    paragraphs: [
      "Two-tailed test (standard): use when you check for a difference in any direction. 'Is Class A's average height different from Class B?' — it could be taller or shorter. The calculator doubles the single-tail probability to cover both extremes.",
      "Left-tailed test: use when you test for a decrease. 'Did the new engine design lower fuel consumption?' The calculator finds the area on the far left of the z-score. Right-tailed test: use when you test for an increase. 'Did the study course improve scores?' The area sits on the far right.",
    ],
    formula: "Two-tailed: P = 2 × tail area · One-tailed: P = single tail area",
  },
  facts: [
    {
      title: "1. The 0.05 alpha level",
      body: "Most scientific fields use 0.05 (5%) as the significance cutoff, called alpha (α). A p-value of 0.04 passes; 0.06 does not. But the threshold varies: particle physicists require 0.0000003 (5 Sigma) for a discovery, while social scientists may accept 0.10.",
    },
    {
      title: "2. P-value is NOT the probability of truth",
      body: "A p-value of 0.05 does NOT mean 'there is a 95% chance my hypothesis is true.' It means 'there is a 5% chance of getting this data if the hypothesis is wrong.' The p-value measures how unusual the data looks — it does not prove a theory is true.",
    },
    {
      title: "3. Z-score relationship",
      body: "The p-value connects directly to the z-score. At z = 0, p = 1.0 (exactly average). At z = 1.96, p = 0.05 (the edge of significance). At z = 3.00, p = 0.0027 (extremely significant).",
    },
  ],
  useCases: [
    {
      title: "A/B testing conversion rates",
      body: "Marketers compare two website versions. Version B gives a z-score of 2.5 → p = 0.012 (two-tailed). The result likely did not happen by chance — the new layout works better.",
    },
    {
      title: "Quality control",
      body: "A factory machine fills bottles with 500ml of soda. One batch averages only 495ml. A z-test measures the chance of a 5ml error. A low p-value tells the team to inspect the machine.",
    },
    {
      title: "Medical trials",
      body: "Researchers compare people who took a drug with people who took a placebo. They calculate a z-score from the difference in results. The final p-value helps experts decide if the drug works well enough for FDA approval.",
    },
  ],
  faqs: [
    {
      question: "Why is the p-value 0.00000?",
      answer:
        "A very high or very low z-score (above 4 or below −4) creates a tiny probability that rounds to zero. This result shows very strong statistical significance — your result is extremely unlikely to have happened by chance.",
    },
    {
      question: "Can I use this for t-scores?",
      answer:
        "No. T-scores use a different formula that includes degrees of freedom. People use t-scores for small sample sizes (n < 30). This calculator works only with z-scores and normal distribution data.",
    },
    {
      question: "What does statistically significant mean?",
      answer:
        "This term means your p-value falls below the significance level (usually 0.05). It tells you the result likely did not happen by chance — there is a real effect worth investigating.",
    },
    {
      question: "Why does the graph change shape?",
      answer:
        "The bell curve keeps the same shape every time. The shaded area changes with your hypothesis type — left-tailed, right-tailed, or two-tailed. The shaded red part shows the p-value percentage visually.",
    },
  ],
}
