import type { CalculatorDetail } from "../types"

export const pooledVarianceCalculator: CalculatorDetail = {
  metaDescription:
    "Free pooled variance calculator — unlimited groups, standard deviation or variance input, Excel paste. Pooled variance, pooled SD and degrees of freedom instantly.",
  formula:
    "s²p = [(n₁−1)s₁² + (n₂−1)s₂² + … + (nₖ−1)sₖ²] ÷ [(n₁−1) + (n₂−1) + … + (nₖ−1)]",
  whenToUse: [
    "Sometimes you have data from two or more groups — Class A and Class B, or samples from several production lines — that share a similar level of spread. Instead of calculating each variance separately, pooled variance combines them into one reliable, weighted average.",
    "Why weighted? Imagine Group A has 1,000 people and Group B has 5. You should not average their variances equally — the larger group gives more reliable data. Pooled variance gives more importance to larger groups, keeping the estimate of population variability accurate.",
  ],
  howToUse: [
    "Pick the value type: Std Dev mode squares your SD values automatically (2.5 becomes 6.25); Variance mode uses values as entered.",
    "Type each group on a separate line as Size, Value — e.g. 10, 2.5 — or paste directly from Excel. Unlimited groups.",
    "Read the pooled variance (for ANOVA and F-tests) and the pooled standard deviation (for t-tests and confidence intervals), with degrees of freedom computed automatically.",
  ],
  example: {
    title: "Example: three production lines",
    body: "n=10 with SD 2.5, n=15 with SD 3.1, n=20 with SD 2.8 → variances 6.25, 9.61, 7.84 → numerator 339.75 over df 42 → pooled variance 8.0893, pooled SD 2.8442. Press Reset to reproduce every number.",
  },
  method: {
    title: "How this calculator works",
    paragraphs: [
      "Many students confuse standard deviation (s) with variance (s²) — the value-type toggle prevents that mistake. In SD mode the tool squares each value before pooling; in Variance mode it uses them as entered.",
      "Each line is one group: the first number is the sample size, the second the SD or variance. The tool weights every group's variance by its degrees of freedom (n − 1), sums, and divides by the total degrees of freedom — handling k groups at once.",
    ],
    formula: "df total = (n₁−1) + (n₂−1) + … = N total − k",
  },
  facts: [
    {
      title: "1. The assumption of homogeneity",
      body: "Pooled variance works only when groups have a similar spread — statisticians call this homoscedasticity. If one group's variance is 5 and another's is 500, pooling gives a misleading result: use Welch's t-test instead of a pooled test.",
    },
    {
      title: "2. Degrees of freedom combine",
      body: "One sample contributes n − 1 degrees of freedom; combined groups add up: df total = (n₁−1) + (n₂−1) + …, or simply N total − k. The calculator shows this value — you need it to find critical values in statistical tables.",
    },
  ],
  useCases: [
    {
      title: "Independent t-tests",
      body: "Independent t-tests compare the means of two separate groups — two medicines, two teaching methods. The pooled variance estimates the shared standard error that the test statistic is built on.",
    },
    {
      title: "ANOVA",
      body: "In ANOVA, the Mean Square Error (MSE, also called Mean Square Within) is a pooled variance. This calculator hands you that value directly — no full ANOVA table needed.",
    },
    {
      title: "Quality control",
      body: "Factories sample products from several machines each hour. Pooling the variances of all samples gives a better estimate of the factory's overall process performance than any single machine's data.",
    },
  ],
  faqs: [
    {
      question: "Can I calculate pooled variance with only sample sizes and means?",
      answer:
        "No. You also need the standard deviation or variance for each group — the mean never appears in the pooled variance formula.",
    },
    {
      question: "Is pooled variance the same as average variance?",
      answer:
        "No — they match only when sample sizes are equal. When sizes differ, pooled variance weights larger groups more heavily, so the result stays closer to the larger group's variance.",
    },
    {
      question: "What if one group has n = 1?",
      answer:
        "A group with a single value cannot be used. The formula relies on n − 1, which becomes zero when n = 1 — and variance needs at least two data points to exist.",
    },
    {
      question: "When should I avoid pooled variance?",
      answer:
        "Avoid it when group variances differ too much — for example, when one is four times larger than another — or when the data is highly skewed. In those cases the pooled result does not represent the groups; Welch's t-test is the safer route.",
    },
  ],
}
