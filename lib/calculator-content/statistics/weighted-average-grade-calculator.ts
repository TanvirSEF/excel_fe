import type { CalculatorDetail } from "../types"

export const weightedAverageGradeCalculator: CalculatorDetail = {
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
}
