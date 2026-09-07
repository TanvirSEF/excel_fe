export interface StatsCalculatorDetail {
  metaDescription: string
  formula: string
  whenToUse: string[]
  howToUse: string[]
  example: { title: string; body: string }
  excelNote?: string
  faqs?: { question: string; answer: string }[]
}

export type StatisticsSlug =
  | "weighted-average-grade-calculator"
  | "geometric-mean-calculator"
  | "harmonic-mean-calculator"
  | "time-weighted-average-calculator"
  | "coefficient-of-variance-calculator"
  | "pooled-variance-calculator"
  | "one-way-anova-calculator"
  | "two-way-anova-calculator"
  | "z-score-to-percentile-calculator"
  | "critical-z-value-calculator"
  | "p-value-from-z-score-calculator"
  | "weighted-average-overtime-calculator"
  | "vwap-calculator"

export const STATS_DETAILS: Record<StatisticsSlug, StatsCalculatorDetail> = {
  "weighted-average-grade-calculator": {
    metaDescription:
      "Free weighted average grade calculator — enter grades and weights to see your current class grade, letter grade and the exact final exam score you need for your target.",
    formula: "Weighted Grade = Σ(Score × Weight) ÷ ΣWeights",
    whenToUse: [
      "Keeping grades on top gets stressful when different assignments carry different weights. A simple average fails you when a Final Exam is worth 40% and Homework is worth only 5% — in a weighted grading system, some assignments simply affect your final grade more than others.",
      "Imagine two grades: Homework 100% (worth 10% of the class) and Midterm 70% (worth 90%). The simple average says (100 + 70) ÷ 2 = 85% — looks like a B. The weighted average says (100 × 0.10) + (70 × 0.90) = 73% — actually a C. The weighted average is the accurate one, because the midterm carries the weight.",
    ],
    howToUse: [
      "Add assignments: enter the assignment name if you want, then your grade (%) and its weight (%).",
      "Ignore the total for now: your weights do not need to equal 100% yet. If you have completed only 30% of the coursework, the calculator averages that 30% — your finished work is the full picture so far.",
      "Read the result: Current Average shows your class grade on completed work, with your letter grade alongside.",
      "Use the Final Exam Planner: your current average fills in automatically — enter your target grade (e.g. 90 for an A) and the final exam's weight, and the planner shows the minimum score you need on the final.",
    ],
    example: {
      title: "Example: the built-in sample",
      body: "Homeworks 88 (20%), Midterm 76 (30%) and Lab Project 92 (20%) — 70% of the course done — give a current average of 84.00%, a B. Press Reset above to load these exact numbers, then try the Final Exam Planner with target 90% and final weight 30%.",
    },
    excelNote: "In Excel use =SUMPRODUCT(grades, weights) / SUM(weights).",
    faqs: [
      {
        question: "What if my weights don't add up to 100%?",
        answer:
          "That is normal — your semester may still be in progress and completed work may only cover 60% or 70% so far. The calculator adjusts the average based on your finished work and treats it as the full progress right now. Add assignments as they arrive and the picture updates.",
      },
      {
        question: "What if I need more than 100% on the final?",
        answer:
          "If the planner shows something like 105%, you cannot reach that target with the final exam alone. Line up extra credit, or set a lower target — a B+ instead of an A, for example. The planner tells you this honestly so you can plan realistically.",
      },
      {
        question: "Can I use points instead of percentages?",
        answer:
          "Yes — just stay consistent across your entries. For example, 45 points out of 50 equals 90%, so you can enter either the percentage directly or convert your points first. Both work with the same weighted formula.",
      },
      {
        question: "What is the difference between average and weighted average?",
        answer:
          "A simple average gives every assignment equal value. A weighted average gives more value to some assignments — exams usually count more than homework. Most schools use weighted averages for final grades, which is why this calculator exists.",
      },
    ],
  },
  "geometric-mean-calculator": {
    metaDescription:
      "Free geometric mean calculator — paste your numbers and get the geometric mean instantly, with the log-domain method, formula and a worked example.",
    formula: "GM = ⁿ√(x₁ · x₂ · … · xₙ)",
    whenToUse: [
      "For growth rates and investment returns, where values multiply rather than add — averaging +50% then −50% is not 0%, and the geometric mean gets that right.",
      "Any positive data set where extreme values would skew a normal average.",
    ],
    howToUse: [
      "Enter your positive numbers, separated by commas, spaces or new lines.",
      "The calculator averages their logarithms and converts back — numerically stable even for large data sets.",
      "Compare with the arithmetic mean shown alongside: the gap tells you how skewed your data is.",
    ],
    example: {
      title: "Example: 2 and 18",
      body: "GM = √(2 × 18) = √36 = 6 — while the arithmetic mean is 10. Press “Reset to example” above to see it live.",
    },
    excelNote: "In Excel use =GEOMEAN(range).",
  },
  "harmonic-mean-calculator": {
    metaDescription:
      "Free harmonic mean calculator — the correct average for rates like speed or price ratios. Instant results with formula, steps and worked example.",
    formula: "HM = n ÷ (1/x₁ + 1/x₂ + … + 1/xₙ)",
    whenToUse: [
      "Whenever you average rates over equal distances or amounts — speed over identical legs of a trip, or price-to-earnings ratios.",
      "When small values should matter more: the harmonic mean leans toward the low end of the data.",
    ],
    howToUse: [
      "Enter your rates as positive numbers — one per value.",
      "The calculator sums the reciprocals, divides the count by that sum, and shows the result.",
      "Check the arithmetic mean alongside to see exactly how much a naive average would overstate things.",
    ],
    example: {
      title: "Example: driving at 40 and 60 km/h",
      body: "Over equal distances the true average speed is 2 ÷ (1/40 + 1/60) = 48 km/h — not 50. Press “Reset to example” to verify.",
    },
    excelNote: "In Excel use =HARMEAN(range).",
  },
  "time-weighted-average-calculator": {
    metaDescription:
      "Free time-weighted average calculator — average values over uneven time periods correctly, removing the distortion of timing. Formula and steps included.",
    formula: "TWA = Σ(valueᵢ × periodᵢ) ÷ Σ(periodᵢ)",
    whenToUse: [
      "When values held for different lengths of time — interest rates that changed mid-year, exposure levels measured over uneven windows, prices over unequal holding periods.",
      "Whenever a simple average would treat a two-day spike the same as a nine-month stretch.",
    ],
    howToUse: [
      "Enter each value along with how long it held (months, days — any consistent unit).",
      "The calculator multiplies each value by its period, sums them, and divides by the total time.",
      "The result is the true average over the whole timeline.",
    ],
    example: {
      title: "Example: 8 for 3 months, 6 for 9 months",
      body: "(8×3 + 6×9) ÷ 12 = 78 ÷ 12 = 6.50 — a plain average would wrongly say 7. Press “Reset to example” to see it.",
    },
  },
  "coefficient-of-variance-calculator": {
    metaDescription:
      "Free coefficient of variance calculator — measure relative volatility as a percentage of the mean. Sample or population, with formula and steps.",
    formula: "CV = (σ ÷ |μ|) × 100%",
    whenToUse: [
      "To compare the risk or consistency of two things measured on different scales — a $200 stock and a $20 stock, or exam scores in different subjects.",
      "Standard deviation alone depends on units; the CV normalizes it so you can compare apples to apples.",
    ],
    howToUse: [
      "Pick Sample (divisor n − 1) when your data is a sample of a bigger population, or Population (divisor n) when you have every value.",
      "Enter your numbers — separated by commas, spaces or new lines.",
      "Read the CV percentage along with the mean, SD and variance it came from.",
    ],
    example: {
      title: "Example: 10, 20, 30",
      body: "Sample mode gives mean 20, SD 10 and CV = 50.0000%. Press “Reset to example” to reproduce it.",
    },
    excelNote: "In Excel: =STDEV.S(range) / AVERAGE(range), formatted as a percentage.",
  },
  "pooled-variance-calculator": {
    metaDescription:
      "Free pooled variance calculator — combine two sample variances into one weighted estimate for T-Tests. Formula, steps and pooled SD included.",
    formula: "s²p = ((n₁−1)s₁² + (n₂−1)s₂²) ÷ (n₁+n₂−2)",
    whenToUse: [
      "Before running a two-sample T-Test, when you assume both groups share the same underlying variance.",
      "To get a better, more stable estimate of variability by combining two small samples rather than trusting either alone.",
    ],
    howToUse: [
      "Enter both data sets — each needs at least 2 values.",
      "The calculator computes each group's sample variance, then weights them by group size.",
      "Use the pooled SD shown alongside directly in your T-Test formula.",
    ],
    example: {
      title: "Example: {1,2,3} and {3,5,7}",
      body: "Both groups have variance 1 and 4 with n = 3 each: ((2×1) + (2×4)) ÷ 4 = 2.50, pooled SD ≈ 1.5811. Press “Reset to example” to verify.",
    },
  },
  "one-way-anova-calculator": {
    metaDescription:
      "Free one-way ANOVA calculator — compare 3 or more group means with the full ANOVA table: SS, df, MS, F statistic and exact p-value. Copy to Excel.",
    formula: "F = MS(between) ÷ MS(within)",
    whenToUse: [
      "When you want to know whether three or more group means genuinely differ — plant yields under different fertilizers, sales across regions, test scores across teaching methods.",
      "As the gatekeeper before pairwise comparisons: a significant F tells you at least one mean differs.",
    ],
    howToUse: [
      "Enter each group's values in its own box — at least 2 values per group, 2 or more groups.",
      "The calculator builds the full ANOVA table: sums of squares, degrees of freedom, mean squares, F and the exact p-value.",
      "Use “Copy for Excel” to paste the whole table into a spreadsheet.",
    ],
    example: {
      title: "Example: three tidy groups",
      body: "Groups {3,4,5}, {7,8,9}, {10,11,12} give SS-between 74, SS-within 6, F = 37 and p ≈ 0.0004 — a significant difference. Press “Reset to example” to reproduce every number.",
    },
    excelNote: "In Excel: Data → Data Analysis → Anova: Single Factor, or F.DIST.RT(F, df1, df2) for the p-value.",
  },
  "two-way-anova-calculator": {
    metaDescription:
      "Free two-way ANOVA calculator — test how two factors and their interaction affect a result. Full ANOVA table with F statistics and p-values.",
    formula: "F = MS(factor) ÷ MS(error), computed for rows, columns and interaction",
    whenToUse: [
      "When two factors might both matter — Diet AND Exercise, Machine AND Shift — and you want each factor's effect plus whether they interact.",
      "With one value per cell you get the unreplicated model (like Excel's Two-Factor Without Replication); with the same 2+ values per cell you also get the interaction term.",
    ],
    howToUse: [
      "Set the grid size with the row and column steppers (2–6 each).",
      "Fill every cell — a single value per cell for the unreplicated model, or the same 2+ values per cell to test interaction.",
      "Read the ANOVA table: rows test factor A, columns test factor B, and interaction (when replicated) tests whether the factors combine non-additively.",
    ],
    example: {
      title: "Example: 3×3 grid",
      body: "The default grid gives SS-rows 56, SS-cols 56, SS-error 16 with F = 7 and p ≈ 0.0494 for both factors — significant at the 5% level.",
    },
    excelNote: "In Excel: Data → Data Analysis → Anova: Two-Factor with or without Replication.",
  },
  "z-score-to-percentile-calculator": {
    metaDescription:
      "Free z-score to percentile calculator — convert any z-score into its percentile rank on the normal curve, with areas below, above and between.",
    formula: "Percentile = Φ(z) × 100%",
    whenToUse: [
      "To translate a standardized score into plain language — z = 1.96 means the 97.5th percentile.",
      "For test scores (IQ, SAT), growth charts and any normally distributed measurement.",
    ],
    howToUse: [
      "Enter the z-score directly, or switch to Raw score mode and provide the score, mean and standard deviation.",
      "The calculator evaluates the standard normal CDF for your z.",
      "Read the percentile plus the area above and the central area between ±|z|.",
    ],
    example: {
      title: "Example: IQ 130",
      body: "IQ 130 with mean 100 and SD 15 gives z = 2.0 → the 97.7250th percentile — roughly the top 2.3%.",
    },
    excelNote: "In Excel use =NORM.S.DIST(z, TRUE).",
  },
  "critical-z-value-calculator": {
    metaDescription:
      "Free critical z value calculator — instant critical values for any confidence level (80–99.9%) or custom α, one or two-tailed. Like NORM.S.INV in Excel.",
    formula: "z_critical = Φ⁻¹(1 − α) or Φ⁻¹(1 − α/2)",
    whenToUse: [
      "Before running a z-test: you need the cut-off beyond which you reject the null hypothesis.",
      "Building confidence intervals: the critical z times the standard error sets the interval's width.",
    ],
    howToUse: [
      "Pick a confidence level from the dropdown — or type a custom significance α (like 0.05) to override it.",
      "Choose one-tailed or two-tailed.",
      "Read the critical z values: ±1.9600 for the classic 95% two-tailed case.",
    ],
    example: {
      title: "Example: 95% two-tailed",
      body: "α = 0.05 split into two tails of 0.025 each gives critical z = ±1.9600 — the number every statistics student memorizes.",
    },
    excelNote: "In Excel use =NORM.S.INV(1 − α/2) for two-tailed critical values.",
  },
  "p-value-from-z-score-calculator": {
    metaDescription:
      "Free p-value from z-score calculator — get the exact one or two-tailed p-value for any z statistic, with a significance verdict at α = 0.05.",
    formula: "P = 2 × (1 − Φ(|z|)) for two-tailed · P = 1 − Φ(z) for one-tailed",
    whenToUse: [
      "After computing a z-statistic — a z-test, a large-sample proportion or mean test — and you need the p-value to make the call.",
      "Whenever a paper reports “z = 2.5” and you want to know how strong the evidence really is.",
    ],
    howToUse: [
      "Enter your z statistic (the sign only affects direction, not strength).",
      "Pick one-tailed or two-tailed to match your hypothesis.",
      "Read the p-value and the verdict against the conventional α = 0.05 threshold.",
    ],
    example: {
      title: "Example: z = 1.96",
      body: "Two-tailed p = 0.0500 — exactly on the boundary of significance at the 5% level. z = 2.576 gives p = 0.0100.",
    },
    excelNote: "In Excel use =2 × (1 − NORM.S.DIST(ABS(z), TRUE)) for the two-tailed p-value.",
  },
  "weighted-average-overtime-calculator": {
    metaDescription:
      "Free weighted average overtime calculator — the FLSA blended-rate method for employees working two jobs at different pay rates. Full pay breakdown.",
    formula: "Blended rate = Σ(hoursᵢ × rateᵢ) ÷ Σ(hoursᵢ) · OT rate = blended × multiplier",
    whenToUse: [
      "When an employee works two different jobs at different rates in the same week and goes over 40 hours — US FLSA rules require the weighted-average method.",
      "To check payroll correctness: overtime is owed on the blended rate, not the higher single-job rate.",
    ],
    howToUse: [
      "Enter both jobs' hours and hourly rates.",
      "Set the overtime multiplier (1.5 for time-and-a-half) and the threshold (usually 40 hours).",
      "Read the blended regular rate, the overtime rate, the premium owed and total weekly pay.",
    ],
    example: {
      title: "Example: 30h at $20 + 20h at $30",
      body: "Straight-time pay $1,200 over 50 hours gives a blended rate of $24.00 → OT rate $36.00 for the 10 hours beyond 40, a premium of $120, and total pay of $1,320. Press “Reset to example” to reproduce every figure.",
    },
  },
  "vwap-calculator": {
    metaDescription:
      "Free VWAP calculator — volume weighted average price for any set of trades, with total volume, notional traded and comparison to the simple mean price.",
    formula: "VWAP = Σ(priceᵢ × volumeᵢ) ÷ Σ(volumeᵢ)",
    whenToUse: [
      "As a trading benchmark: buying below the day's VWAP means better-than-average execution.",
      "To see the true average price of a position built through several fills of different sizes.",
    ],
    howToUse: [
      "Enter each fill's price and share volume.",
      "The calculator weights every price by its size and divides by total volume.",
      "Compare with the simple mean price to see how much volume weighting matters.",
    ],
    example: {
      title: "Example: three fills",
      body: "(100×200) + (102×300) + (98×500) = $99,600 over 1,000 shares → VWAP $99.60, while the simple mean price is $100.00. Press “Reset to example” to verify.",
    },
  },
}
