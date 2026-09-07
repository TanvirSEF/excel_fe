import type { TablerIcon } from "@tabler/icons-react"
import {
  IconBriefcase,
  IconChartDots,
  IconChartHistogram,
  IconMathFunction,
} from "@tabler/icons-react"

export interface CalculatorEntry {
  slug: string
  name: string
  whatItIs: string
  whatToExpect: string
}

export interface CalculatorGroup {
  title: string
  tagline: string
  icon: TablerIcon
  accent: string
  calculators: CalculatorEntry[]
}

export interface CalculatorFaq {
  question: string
  answer: string
  bullets?: string[]
}

export interface CalculatorHub {
  slug: string
  badge: string
  title: string
  titleAccent: string
  intro: string[]
  hubNote: string
  groups: CalculatorGroup[]
  faqs: CalculatorFaq[]
}

export const STATS_HUB: CalculatorHub = {
  slug: "statistics",
  badge: "Free Online Tools",
  title: "Statistics Calculators for",
  titleAccent: "Students & Professionals",
  intro: [
    "Statistical calculators are most commonly used by students and researchers — and our online statistics calculators are built to do exactly that job, for people around the world. These tools solve complex statistical formulas instantly: enter your data and get accurate, step-by-step results that help you understand the numbers behind the data. Every dedicated calculator page also explains the formula and the logic behind it.",
  ],
  hubNote:
    "This is the hub of all our statistical calculators, organized by category. Click any calculator below to open its dedicated page — enter your data and see the expected output within a second.",
  groups: [
    {
      title: "Averages & Mean Calculators",
      tagline: "Find the central tendency of your data in smarter ways than just adding everything up.",
      icon: IconMathFunction,
      accent: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
      calculators: [
        {
          slug: "weighted-average-grade-calculator",
          name: "Weighted Average Grade Calculator",
          whatItIs:
            "A tool for students to calculate their final class grade when assignments carry different weights — like a Final Exam worth 50% and Homework worth 10%.",
          whatToExpect:
            "Enter your grades and their percentage weights to see exactly where you stand in class.",
        },
        {
          slug: "geometric-mean-calculator",
          name: "Geometric Mean Calculator",
          whatItIs:
            "A specialized way to average numbers that are multiplied together — often used for growth rates or investment returns.",
          whatToExpect:
            "The correct average rate that prevents skewing by extreme high or low numbers.",
        },
        {
          slug: "harmonic-mean-calculator",
          name: "Harmonic Mean Calculator",
          whatItIs:
            "The perfect tool for averaging rates or ratios — like speed (km/h) or price-earnings ratios in finance.",
          whatToExpect:
            "A precise average for fractions and rates that a normal average would get wrong.",
        },
        {
          slug: "time-weighted-average-calculator",
          name: "Time Weighted Average Calculator",
          whatItIs:
            "Calculates the average value of something over a specific period, removing the distorting effects of external cash flows or varying time intervals.",
          whatToExpect: "A clear view of performance or exposure levels over a set timeline.",
        },
      ],
    },
    {
      title: "Variance & Analysis Tools",
      tagline: "Understand how spread out — or consistent — your data really is.",
      icon: IconChartHistogram,
      accent: "text-blue-600 dark:text-blue-400 bg-blue-500/10",
      calculators: [
        {
          slug: "coefficient-of-variance-calculator",
          name: "Coefficient of Variance Calculator",
          whatItIs:
            "Tells you how risky or volatile a dataset is compared to its own average.",
          whatToExpect:
            "A percentage that lets you compare the risk of two different things — like two stocks — even if their prices are totally different.",
        },
        {
          slug: "pooled-variance-calculator",
          name: "Pooled Variance Calculator",
          whatItIs:
            "Combines the variance (spread) of two different groups into a better estimate of overall consistency.",
          whatToExpect:
            "A crucial number often used in T-Tests to see if two groups are statistically different.",
        },
        {
          slug: "one-way-anova-calculator",
          name: "One Way Analysis of Variance (ANOVA) Calculator",
          whatItIs:
            "A statistical test that compares the means of three or more independent groups to see if they are significantly different.",
          whatToExpect:
            "A clear F-Statistic and P-Value that tell you whether your groups actually differ — or the results just happened by chance.",
        },
        {
          slug: "two-way-anova-calculator",
          name: "Two Way Analysis of Variance (ANOVA) Calculator",
          whatItIs:
            "A more advanced ANOVA that looks at how two different factors affect a result — for example how Diet AND Exercise affect weight loss.",
          whatToExpect: "It reveals whether there is an interaction between your two variables.",
        },
      ],
    },
    {
      title: "Probability & Z-Scores",
      tagline: "Determine the likelihood of events and where your data sits on the curve.",
      icon: IconChartDots,
      accent: "text-purple-600 dark:text-purple-400 bg-purple-500/10",
      calculators: [
        {
          slug: "z-score-to-percentile-calculator",
          name: "Z Score to Percentile Calculator",
          whatItIs:
            "Converts a Z-Score (standard deviations) into a simple percentile ranking — like Top 10%.",
          whatToExpect:
            "A percentage that tells you exactly what portion of the population is below or above a specific score.",
        },
        {
          slug: "critical-z-value-calculator",
          name: "Critical Z Value Calculator",
          whatItIs:
            "Finds the boundary mark (cut-off point) on a bell curve needed to reject a hypothesis at a certain confidence level.",
          whatToExpect:
            "The precise Z-value needed for hypothesis testing — like 1.96 for a 95% confidence level.",
        },
        {
          slug: "p-value-from-z-score-calculator",
          name: "P Value from Z Score Calculator",
          whatItIs:
            "The ultimate evidence calculator: the probability of finding a result as extreme as the one you observed.",
          whatToExpect:
            "A small decimal (the P-Value) — if it is low, usually under 0.05, your result is statistically significant.",
        },
      ],
    },
    {
      title: "Business & Applied Statistics",
      tagline: "Specialized statistics tools for payroll, trading, and operations.",
      icon: IconBriefcase,
      accent: "text-amber-600 dark:text-amber-400 bg-amber-500/10",
      calculators: [
        {
          slug: "weighted-average-overtime-calculator",
          name: "Weighted Average Overtime Calculator",
          whatItIs:
            "A payroll tool for when an employee works two different jobs at different pay rates in the same week.",
          whatToExpect:
            "The correct blended overtime rate, so the employee is paid fairly and legally.",
        },
        {
          slug: "vwap-calculator",
          name: "Volume Weighted Average Price (VWAP) Calculator",
          whatItIs:
            "A trading benchmark that shows the average price a stock traded at throughout the day, based on both price and volume.",
          whatToExpect:
            "A trend line that helps traders decide whether they are buying a stock at a good price or an expensive one.",
        },
      ],
    },
  ],
  faqs: [
    {
      question: "Are these calculators accurate enough for professional research?",
      answer:
        "Yes. While we designed these tools to be simple enough for students, they use rigorous, industry-standard statistical algorithms. Whether you are working on a university thesis, a business market analysis, or professional data modeling, you can trust the accuracy of the results.",
    },
    {
      question: "Do they just show the answer, or do they explain the math?",
      answer:
        "We explain the math. We believe in helping you understand the why behind the numbers. Along with your final result, most of our tools provide:",
      bullets: [
        "The Formula — the actual equation used to solve the problem",
        "Real-Life Examples — practical scenarios showing how the statistic is used in the real world",
        "Step-by-Step Logic — a breakdown that helps you learn the process",
      ],
    },
    {
      question: "How do I enter my data?",
      answer:
        "It is designed to be flexible. For most calculators you can type your data points manually — and to save time with larger datasets, several tools also let you paste data directly from spreadsheets or text documents.",
    },
    {
      question: "Can I download my results as a PDF or image?",
      answer:
        "Not at this time. Results are displayed instantly on your screen for immediate use. We are working on PDF and image downloads for the future — stay tuned for updates!",
    },
    {
      question: "Is my data saved or stored?",
      answer:
        "No, never. Just like our financial tools, your privacy is guaranteed. The data you enter is processed in your browser and is never stored on our servers. Once you close the tab or refresh the page, your data is completely wiped.",
    },
  ],
}
