"use client"

import { useState } from "react"
import Link from "next/link"
import {
  IconCheck,
  IconCircleCheck,
  IconFileSpreadsheet,
  IconLink,
  IconLoader2,
  IconLock,
  IconX,
} from "@tabler/icons-react"
import { toast } from "sonner"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export interface ServiceRequestWizardProps {
  preselectedService?: string | null
  preselectedPlan?: string | null
  className?: string
}

const SERVICE_MAP: Record<string, string> = {
  consulting: "Spreadsheet Troubleshooting & Bug Fixing",
  troubleshooting: "Spreadsheet Troubleshooting & Bug Fixing",
  templates: "Custom Templates & Dashboards",
  "custom-template": "Custom Templates & Dashboards",
  automation: "VBA Macros & Custom Tools",
  tools: "VBA Macros & Custom Tools",
  "custom-tools": "VBA Macros & Custom Tools",
  basic: "Spreadsheet Troubleshooting & Bug Fixing",
  premium: "Spreadsheet Troubleshooting & Bug Fixing",
  advanced: "Spreadsheet Troubleshooting & Bug Fixing",
  "template-basic": "Custom Templates & Dashboards",
  "template-premium": "Custom Templates & Dashboards",
  "template-advanced": "Custom Templates & Dashboards",
  "tool-professional": "VBA Macros & Custom Tools",
  "tool-advanced": "VBA Macros & Custom Tools",
}

const PLAN_BUDGET_MAP: Record<string, string> = {
  basic: "Less Than $20",
  premium: "$20 - $50",
  advanced: "$50 - $100",
  "template-basic": "$20 - $50",
  "template-premium": "$50 - $100",
  "template-advanced": "$100 - $250",
  "tool-professional": "$500+ (Complex Automation / Enterprise Tool)",
  "tool-advanced": "$500+ (Complex Automation / Enterprise Tool)",
}

const SPREADSHEET_TYPES = [
  "Ms Excel 2013 for Windows",
  "Ms Excel 2016 for Windows",
  "Ms Excel 2019 for Windows",
  "Ms Excel 2021 for Windows",
  "Ms Excel 365 / Online",
  "Ms Excel for Mac",
  "Google Sheets",
  "Both Excel & Google Sheets",
  "Other / Not Sure",
]

const URGENCY_LEVELS = [
  "Normal",
  "Urgent (Within 24–48 Hours)",
  "Emergency (Immediate / Same Day)",
]

const CONTACT_METHODS = [
  "Email",
  "WhatsApp",
  "Discord",
  "Telegram",
  "Skype or Phone Call",
]

const BUDGET_RANGES = [
  "Less Than $20",
  "$20 - $50",
  "$50 - $100",
  "$100 - $250",
  "$250 - $500",
  "$500+ (Complex Automation / Enterprise Tool)",
  "Custom / Let's Discuss",
]

const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "India",
  "Bangladesh",
  "Singapore",
  "United Arab Emirates",
  "Netherlands",
  "Switzerland",
  "Spain",
  "Italy",
  "Brazil",
  "Mexico",
  "South Africa",
  "New Zealand",
  "Philippines",
  "Pakistan",
  "Afghanistan",
  "Other",
]

export function ServiceRequestWizard({
  preselectedService,
  preselectedPlan,
  className,
}: ServiceRequestWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [ticketId, setTicketId] = useState<string | null>(null)

  const [serviceCategory, setServiceCategory] = useState<string>(
    preselectedService && SERVICE_MAP[preselectedService]
      ? SERVICE_MAP[preselectedService]
      : preselectedPlan && SERVICE_MAP[preselectedPlan]
        ? SERVICE_MAP[preselectedPlan]
        : "Spreadsheet Troubleshooting & Bug Fixing"
  )
  const [subject, setSubject] = useState("")
  const [requirements, setRequirements] = useState("")
  const [spreadsheetType, setSpreadsheetType] = useState(SPREADSHEET_TYPES[0])
  const [urgencyLevel, setUrgencyLevel] = useState(URGENCY_LEVELS[0])
  const [file, setFile] = useState<File | null>(null)
  const [cloudLink, setCloudLink] = useState("")

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [country, setCountry] = useState("United States")
  const [preferredContact, setPreferredContact] = useState("Email")
  const [contactHandle, setContactHandle] = useState("")

  const [budgetRange, setBudgetRange] = useState<string>(
    preselectedPlan && PLAN_BUDGET_MAP[preselectedPlan]
      ? PLAN_BUDGET_MAP[preselectedPlan]
      : BUDGET_RANGES[0]
  )
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateStep1 = () => {
    const errs: Record<string, string> = {}
    if (!subject.trim() || subject.trim().length < 3) {
      errs.subject = "Subject is required (at least 3 characters)."
    }
    if (!requirements.trim() || requirements.trim().length < 10) {
      errs.requirements = "Please describe your task with all detail information."
    }
    if (!spreadsheetType) {
      errs.spreadsheetType = "Please select spreadsheet type & version."
    }
    if (!urgencyLevel) {
      errs.urgencyLevel = "Please select urgency level."
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const validateStep2 = () => {
    const errs: Record<string, string> = {}
    if (!name.trim() || name.trim().length < 2) {
      errs.name = "Name is required."
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim() || !emailRegex.test(email.trim())) {
      errs.email = "Please enter a valid email address."
    }
    if (preferredContact !== "Email" && !contactHandle.trim()) {
      errs.contactHandle = `Please provide your ${preferredContact} handle or number.`
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const validateStep3 = () => {
    const errs: Record<string, string> = {}
    if (!agreedToTerms) {
      errs.terms = "You must agree to the Terms & Conditions of Service for ExcelInsider.com."
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2)
      window.scrollTo({ top: 120, behavior: "smooth" })
    } else if (step === 2 && validateStep2()) {
      setStep(3)
      window.scrollTo({ top: 120, behavior: "smooth" })
    }
  }

  const handleBack = () => {
    if (step === 3) setStep(2)
    else if (step === 2) setStep(1)
    window.scrollTo({ top: 120, behavior: "smooth" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep3()) return

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("subject", subject.trim())
      formData.append("requirements", requirements.trim())
      formData.append("spreadsheetType", spreadsheetType)
      formData.append("urgencyLevel", urgencyLevel)
      formData.append("serviceCategory", serviceCategory)
      formData.append("name", name.trim())
      formData.append("email", email.trim().toLowerCase())
      formData.append("country", country)
      formData.append("preferredContact", preferredContact)
      formData.append("contactHandle", contactHandle.trim())
      formData.append("budgetRange", budgetRange)
      if (cloudLink.trim()) formData.append("cloudLink", cloudLink.trim())
      if (file) formData.append("file", file)

      const res = await fetch("/api/service-request/", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()
      if (!res.ok || !data.ok) {
        throw new Error(data.message || "Failed to submit request.")
      }

      setTicketId(data.ticketId)
      toast.success("Request received! Our team has been notified.")
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again."
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (ticketId) {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-emerald-500/30 bg-card p-8 text-center shadow-xl sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
          <IconCircleCheck className="h-10 w-10 stroke-[2.5]" />
        </div>
        <span className="mt-4 inline-block rounded-full bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
          Order Request Submitted
        </span>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Thank you, {name}!
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
          Your spreadsheet specifications have been sent to our engineering queue. We will review your workbook and reach out via your preferred contact method ({preferredContact}).
        </p>

        <div className="mx-auto mt-6 max-w-sm rounded-2xl border border-border/80 bg-muted/40 p-4">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            Tracking Reference
          </p>
          <p className="mt-1 font-mono text-xl font-bold text-emerald-600 dark:text-emerald-400 tracking-wide">
            {ticketId}
          </p>
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-emerald-700"
          >
            Back to Home
          </Link>
          <button
            type="button"
            onClick={() => {
              setTicketId(null)
              setStep(1)
              setSubject("")
              setRequirements("")
              setFile(null)
              setCloudLink("")
            }}
            className="inline-flex items-center justify-center rounded-xl border border-border px-6 py-2.5 text-sm font-semibold text-foreground transition-all hover:bg-muted"
          >
            New Request
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("w-full max-w-4xl mx-auto space-y-10", className)}>
      {/* Page Title Matching Screenshot */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#064e3b] dark:text-emerald-100 sm:text-4xl lg:text-[40px]">
          Get Started with 3 Easy Steps
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto">
          Choose your service tier, explain what you need, and let our spreadsheet engineers handle the rest.
        </p>
      </div>

      {/* 3 Step Top Cards (Matching Legacy Elementor Design) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Card 01 */}
        <button
          type="button"
          onClick={() => setStep(1)}
          className={cn(
            "relative flex flex-col items-center justify-center rounded-2xl py-6 px-4 text-center transition-all duration-300 cursor-pointer shadow-xs",
            step === 1
              ? "bg-[#059669] text-white shadow-lg shadow-emerald-700/20 scale-[1.02]"
              : step > 1
                ? "bg-[#eaf8f1] dark:bg-emerald-950/30 text-[#065f46] dark:text-emerald-300 hover:bg-[#dcf4e7]"
                : "bg-[#eaf8f1] dark:bg-emerald-950/20 text-[#065f46] dark:text-emerald-300 hover:bg-[#dcf4e7]"
          )}
        >
          <div className="flex items-center gap-1.5">
            <span className={cn("text-3xl sm:text-4xl font-extrabold tracking-tight", step === 1 ? "text-white" : "text-[#059669] dark:text-emerald-300")}>
              01
            </span>
            {step > 1 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white">
                <IconCheck className="h-3.5 w-3.5 stroke-[3]" />
              </span>
            )}
          </div>
          <span className={cn("mt-1.5 text-sm sm:text-base font-bold tracking-tight", step === 1 ? "text-white" : "text-[#065f46] dark:text-emerald-200")}>
            Product Details
          </span>
        </button>

        {/* Card 02 */}
        <button
          type="button"
          onClick={() => {
            if (validateStep1()) setStep(2)
          }}
          className={cn(
            "relative flex flex-col items-center justify-center rounded-2xl py-6 px-4 text-center transition-all duration-300 cursor-pointer shadow-xs",
            step === 2
              ? "bg-[#059669] text-white shadow-lg shadow-emerald-700/20 scale-[1.02]"
              : step > 2
                ? "bg-[#eaf8f1] dark:bg-emerald-950/30 text-[#065f46] dark:text-emerald-300 hover:bg-[#dcf4e7]"
                : "bg-[#eaf8f1] dark:bg-emerald-950/20 text-[#065f46] dark:text-emerald-300 hover:bg-[#dcf4e7]"
          )}
        >
          <div className="flex items-center gap-1.5">
            <span className={cn("text-3xl sm:text-4xl font-extrabold tracking-tight", step === 2 ? "text-white" : "text-[#059669] dark:text-emerald-300")}>
              02
            </span>
            {step > 2 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white">
                <IconCheck className="h-3.5 w-3.5 stroke-[3]" />
              </span>
            )}
          </div>
          <span className={cn("mt-1.5 text-sm sm:text-base font-bold tracking-tight", step === 2 ? "text-white" : "text-[#065f46] dark:text-emerald-200")}>
            Contact Information
          </span>
        </button>

        {/* Card 03 */}
        <button
          type="button"
          onClick={() => {
            if (validateStep1() && validateStep2()) setStep(3)
          }}
          className={cn(
            "relative flex flex-col items-center justify-center rounded-2xl py-6 px-4 text-center transition-all duration-300 cursor-pointer shadow-xs",
            step === 3
              ? "bg-[#059669] text-white shadow-lg shadow-emerald-700/20 scale-[1.02]"
              : "bg-[#eaf8f1] dark:bg-emerald-950/20 text-[#065f46] dark:text-emerald-300 hover:bg-[#dcf4e7]"
          )}
        >
          <span className={cn("text-3xl sm:text-4xl font-extrabold tracking-tight", step === 3 ? "text-white" : "text-[#059669] dark:text-emerald-300")}>
            03
          </span>
          <span className={cn("mt-1.5 text-sm sm:text-base font-bold tracking-tight", step === 3 ? "text-white" : "text-[#065f46] dark:text-emerald-200")}>
            Pricing & Confirmation
          </span>
        </button>
      </div>

      {/* Main White Card Container (Matching Legacy Form Section) */}
      <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-md sm:p-12">
        {/* Stepper Progress Sub-Bar (1) TASK ------ (2) CONTACT ------ (3) CONFIRM */}
        <div className="relative mb-10 flex items-center justify-between px-6 sm:px-16">
          <div className="absolute left-10 right-10 top-4 h-0.5 bg-border/80 -z-1" />
          <div
            className="absolute left-10 top-4 h-0.5 bg-[#059669] transition-all duration-300 -z-1"
            style={{ width: step === 1 ? "0%" : step === 2 ? "50%" : "calc(100% - 5rem)" }}
          />

          {/* Stepper Node 1 */}
          <div className="flex flex-col items-center gap-1.5 bg-card px-2">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold border-2 transition-colors",
                step >= 1
                  ? "border-[#059669] text-[#059669] bg-card"
                  : "border-muted-foreground/30 text-muted-foreground bg-card"
              )}
            >
              1
            </div>
            <span className={cn("text-xs font-bold tracking-wider uppercase", step >= 1 ? "text-[#059669]" : "text-muted-foreground")}>
              TASK
            </span>
          </div>

          {/* Stepper Node 2 */}
          <div className="flex flex-col items-center gap-1.5 bg-card px-2">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold border-2 transition-colors",
                step >= 2
                  ? "border-[#059669] text-[#059669] bg-card"
                  : "border-muted-foreground/30 text-muted-foreground bg-card"
              )}
            >
              2
            </div>
            <span className={cn("text-xs font-bold tracking-wider uppercase", step >= 2 ? "text-[#059669]" : "text-muted-foreground")}>
              CONTACT
            </span>
          </div>

          {/* Stepper Node 3 */}
          <div className="flex flex-col items-center gap-1.5 bg-card px-2">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold border-2 transition-colors",
                step === 3
                  ? "border-[#059669] text-[#059669] bg-card"
                  : "border-muted-foreground/30 text-muted-foreground bg-card"
              )}
            >
              3
            </div>
            <span className={cn("text-xs font-bold tracking-wider uppercase", step === 3 ? "text-[#059669]" : "text-muted-foreground")}>
              CONFIRM
            </span>
          </div>
        </div>

        {/* STEP 1: TASK */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  Task Specifications
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Provide your workbook background and desired results.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">Service:</span>
                <select
                  value={serviceCategory}
                  onChange={(e) => setServiceCategory(e.target.value)}
                  className="rounded-lg border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/30 px-3 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300 focus-visible:outline-none cursor-pointer"
                >
                  <option value="Spreadsheet Troubleshooting & Bug Fixing" className="bg-card text-foreground">
                    Troubleshooting & Bug Fixing
                  </option>
                  <option value="Custom Templates & Dashboards" className="bg-card text-foreground">
                    Custom Templates & Dashboards
                  </option>
                  <option value="VBA Macros & Custom Tools" className="bg-card text-foreground">
                    VBA Macros & Custom Tools
                  </option>
                </select>
              </div>
            </div>

            <div className="space-y-5">
              {/* Subject */}
              <div className="space-y-2">
                <Label htmlFor="req-subject" className="text-sm font-bold text-foreground/90">
                  Subject <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="req-subject"
                  value={subject}
                  onChange={(e) => {
                    setSubject(e.target.value)
                    if (errors.subject) setErrors((prev) => ({ ...prev, subject: "" }))
                  }}
                  placeholder="e.g. Need help fixing circular reference error in monthly budget model"
                  className={cn(
                    "h-11 rounded-lg border border-border/80 bg-background text-sm transition-all focus-visible:border-emerald-600 focus-visible:ring-emerald-600/20",
                    errors.subject && "border-red-500 focus-visible:ring-red-500"
                  )}
                />
                {errors.subject && <p className="text-xs text-red-500">{errors.subject}</p>}
              </div>

              {/* Explain Your Task with Requirements */}
              <div className="space-y-2">
                <Label htmlFor="req-desc" className="text-sm font-bold text-foreground/90">
                  Explain Your Task with Requirements <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="req-desc"
                  rows={6}
                  value={requirements}
                  onChange={(e) => {
                    setRequirements(e.target.value)
                    if (errors.requirements) setErrors((prev) => ({ ...prev, requirements: "" }))
                  }}
                  placeholder="Describe Your Task with All Detail Information"
                  className={cn(
                    "rounded-lg border border-border/80 bg-background text-sm transition-all focus-visible:border-emerald-600 focus-visible:ring-emerald-600/20",
                    errors.requirements && "border-red-500 focus-visible:ring-red-500"
                  )}
                />
                {errors.requirements && <p className="text-xs text-red-500">{errors.requirements}</p>}
              </div>

              {/* Upload Spreadsheet (Optional) */}
              <div className="space-y-2">
                <Label className="text-sm font-bold text-foreground/90">
                  Upload Your Spreadsheet (Optional) <span className="text-xs font-normal text-muted-foreground">25MB Max</span>
                </Label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="relative flex items-center justify-between rounded-lg border border-border/80 bg-muted/20 px-4 py-3 text-sm">
                    <input
                      type="file"
                      id="spreadsheet-file"
                      accept=".xlsx,.xlsm,.xlsb,.xls,.csv,.zip"
                      onChange={(e) => {
                        const selected = e.target.files?.[0]
                        if (selected) {
                          if (selected.size > 25 * 1024 * 1024) {
                            toast.error("File is too large (maximum 25MB).")
                            return
                          }
                          setFile(selected)
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    {file ? (
                      <div className="flex items-center gap-2 truncate text-emerald-700 dark:text-emerald-300 font-medium">
                        <IconFileSpreadsheet className="h-5 w-5 shrink-0" />
                        <span className="truncate">{file.name}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="rounded bg-muted px-2.5 py-1 text-xs font-semibold text-foreground border">Choose Files</span>
                        <span className="text-xs">No file chosen</span>
                      </div>
                    )}
                    {file && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setFile(null)
                        }}
                        className="ml-2 text-muted-foreground hover:text-red-500"
                      >
                        <IconX className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="relative">
                    <IconLink className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="cloud-link"
                      value={cloudLink}
                      onChange={(e) => setCloudLink(e.target.value)}
                      placeholder="Or paste Google Drive / OneDrive link"
                      className="h-full pl-9 rounded-lg border-border/80 text-xs sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Two Column Row: Spreadsheet Type & Urgency */}
              <div className="grid grid-cols-1 gap-5 pt-2 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="spreadsheet-type" className="text-sm font-bold text-foreground/90">
                    Select Your Spreadsheet Type & Version <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="spreadsheet-type"
                    value={spreadsheetType}
                    onChange={(e) => setSpreadsheetType(e.target.value)}
                    className="flex h-11 w-full rounded-lg border border-border/80 bg-background px-3 py-2 text-sm shadow-xs transition-colors focus-visible:border-emerald-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-600"
                  >
                    {SPREADSHEET_TYPES.map((t) => (
                      <option key={t} value={t} className="bg-card text-foreground">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="urgency-level" className="text-sm font-bold text-foreground/90">
                    Urgency Level <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="urgency-level"
                    value={urgencyLevel}
                    onChange={(e) => setUrgencyLevel(e.target.value)}
                    className="flex h-11 w-full rounded-lg border border-border/80 bg-background px-3 py-2 text-sm shadow-xs transition-colors focus-visible:border-emerald-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-600"
                  >
                    {URGENCY_LEVELS.map((u) => (
                      <option key={u} value={u} className="bg-card text-foreground">
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Action Buttons & Security Guarantee */}
            <div className="pt-6 space-y-4">
              <div>
                <button
                  type="button"
                  onClick={handleNext}
                  className="rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold tracking-wider uppercase px-12 py-3.5 text-sm shadow-md transition-all active:scale-[0.98]"
                >
                  NEXT
                </button>
              </div>

              <div className="flex items-center gap-2 pt-2 text-xs text-muted-foreground">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  <IconLock className="h-3 w-3 stroke-[2.5]" />
                </span>
                <span>256-bit SSL Encrypted • All workbooks handled under strict confidentiality.</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: CONTACT */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="border-b border-border/60 pb-4">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Contact Information
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Enter your details so our team can follow up with estimates and delivery.
              </p>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="client-name" className="text-sm font-bold text-foreground/90">
                    Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="client-name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                      if (errors.name) setErrors((prev) => ({ ...prev, name: "" }))
                    }}
                    placeholder="Enter your name"
                    className={cn(
                      "h-11 rounded-lg border border-border/80 bg-background text-sm transition-all focus-visible:border-emerald-600 focus-visible:ring-emerald-600/20",
                      errors.name && "border-red-500 focus-visible:ring-red-500"
                    )}
                  />
                  {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="client-email" className="text-sm font-bold text-foreground/90">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="client-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (errors.email) setErrors((prev) => ({ ...prev, email: "" }))
                    }}
                    placeholder="you@example.com"
                    className={cn(
                      "h-11 rounded-lg border border-border/80 bg-background text-sm transition-all focus-visible:border-emerald-600 focus-visible:ring-emerald-600/20",
                      errors.email && "border-red-500 focus-visible:ring-red-500"
                    )}
                  />
                  {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* Select Your Country */}
                <div className="space-y-2">
                  <Label htmlFor="client-country" className="text-sm font-bold text-foreground/90">
                    Select Your Country
                  </Label>
                  <select
                    id="client-country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="flex h-11 w-full rounded-lg border border-border/80 bg-background px-3 py-2 text-sm shadow-xs transition-colors focus-visible:border-emerald-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-600"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c} className="bg-card text-foreground">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Preferred Contact Method */}
                <div className="space-y-2">
                  <Label htmlFor="contact-method" className="text-sm font-bold text-foreground/90">
                    Preferred Contact Method <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="contact-method"
                    value={preferredContact}
                    onChange={(e) => setPreferredContact(e.target.value)}
                    className="flex h-11 w-full rounded-lg border border-border/80 bg-background px-3 py-2 text-sm shadow-xs transition-colors focus-visible:border-emerald-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-600"
                  >
                    {CONTACT_METHODS.map((m) => (
                      <option key={m} value={m} className="bg-card text-foreground">
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dynamic Handle/Username if not Email */}
              {preferredContact !== "Email" && (
                <div className="space-y-2 animate-fadeIn">
                  <Label htmlFor="contact-handle" className="text-sm font-bold text-foreground/90">
                    {preferredContact} Username or Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="contact-handle"
                    value={contactHandle}
                    onChange={(e) => {
                      setContactHandle(e.target.value)
                      if (errors.contactHandle) setErrors((prev) => ({ ...prev, contactHandle: "" }))
                    }}
                    placeholder={
                      preferredContact === "Discord"
                        ? "e.g., username or username#1234"
                        : preferredContact === "WhatsApp"
                          ? "e.g., +1 234 567 8900"
                          : preferredContact === "Telegram"
                            ? "@yourusername"
                            : "Your phone number or Skype ID"
                    }
                    className={cn(
                      "h-11 rounded-lg border border-border/80 bg-background text-sm transition-all focus-visible:border-emerald-600 focus-visible:ring-emerald-600/20",
                      errors.contactHandle && "border-red-500 focus-visible:ring-red-500"
                    )}
                  />
                  {errors.contactHandle && <p className="text-xs text-red-500">{errors.contactHandle}</p>}
                </div>
              )}
            </div>

            {/* Action Buttons & Security Guarantee */}
            <div className="pt-6 space-y-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleBack}
                  className="rounded-xl bg-[#183329] hover:bg-[#204437] text-white font-bold tracking-wider uppercase px-8 py-3.5 text-sm transition-all active:scale-[0.98]"
                >
                  BACK
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold tracking-wider uppercase px-10 py-3.5 text-sm shadow-md transition-all active:scale-[0.98]"
                >
                  NEXT
                </button>
              </div>

              <div className="flex items-center gap-2 pt-2 text-xs text-muted-foreground">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  <IconLock className="h-3 w-3 stroke-[2.5]" />
                </span>
                <span>Your contact details are kept strictly private and never shared.</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: CONFIRM */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-b border-border/60 pb-4">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Pricing & Confirmation
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Select your expected budget range and confirm your service request.
              </p>
            </div>

            <div className="space-y-5">
              {/* Budget Range */}
              <div className="space-y-2">
                <Label htmlFor="budget-range" className="text-sm font-bold text-foreground/90">
                  Budget Range
                </Label>
                <select
                  id="budget-range"
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                  className="flex h-11 w-full rounded-lg border border-border/80 bg-background px-3 py-2 text-sm shadow-xs transition-colors focus-visible:border-emerald-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-600"
                >
                  {BUDGET_RANGES.map((b) => (
                    <option key={b} value={b} className="bg-card text-foreground">
                      {b}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground">
                  Our quotes are fixed-price per deliverable. No surprise fees.
                </p>
              </div>

              {/* Summary Card Before Submission */}
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-50/40 dark:bg-emerald-950/20 p-5 space-y-2.5 text-xs sm:text-sm">
                <div className="flex justify-between border-b border-emerald-500/15 pb-2">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="font-semibold text-foreground">{serviceCategory}</span>
                </div>
                <div className="flex justify-between border-b border-emerald-500/15 pb-2">
                  <span className="text-muted-foreground">Task Subject:</span>
                  <span className="font-semibold text-foreground truncate max-w-[240px] sm:max-w-md">{subject}</span>
                </div>
                <div className="flex justify-between border-b border-emerald-500/15 pb-2">
                  <span className="text-muted-foreground">Platform:</span>
                  <span className="font-semibold text-foreground">{spreadsheetType} ({urgencyLevel})</span>
                </div>
                <div className="flex justify-between border-b border-emerald-500/15 pb-2">
                  <span className="text-muted-foreground">Contact:</span>
                  <span className="font-semibold text-foreground">{name} &lt;{email}&gt; via {preferredContact}</span>
                </div>
                {file && (
                  <div className="flex justify-between border-b border-emerald-500/15 pb-2">
                    <span className="text-muted-foreground">Attachment:</span>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-300 truncate max-w-[200px]">{file.name}</span>
                  </div>
                )}
                {cloudLink && (
                  <div className="flex justify-between border-b border-emerald-500/15 pb-2">
                    <span className="text-muted-foreground">Cloud Link:</span>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-300 truncate max-w-[200px]">{cloudLink}</span>
                  </div>
                )}
              </div>

              {/* Terms Checkbox Matching Screenshot */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs sm:text-sm text-foreground/90">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => {
                      setAgreedToTerms(e.target.checked)
                      if (errors.terms) setErrors((prev) => ({ ...prev, terms: "" }))
                    }}
                    className="mt-0.5 h-4 w-4 rounded border-border text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>
                    I agree to the{" "}
                    <Link href="/terms" target="_blank" className="font-semibold text-emerald-700 dark:text-emerald-400 hover:underline">
                      Terms & Conditions
                    </Link>{" "}
                    of Service for ExcelInsider.com <span className="text-red-500">*</span>
                  </span>
                </label>
                {errors.terms && <p className="mt-1 text-xs text-red-500">{errors.terms}</p>}
              </div>
            </div>

            {/* Action Buttons & Security Guarantee */}
            <div className="pt-6 space-y-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className="rounded-xl bg-[#183329] hover:bg-[#204437] text-white font-bold tracking-wider uppercase px-8 py-3.5 text-sm transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  BACK
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold tracking-wider uppercase px-12 py-3.5 text-sm shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <IconLoader2 className="h-4 w-4 animate-spin" />
                      <span>SUBMITTING…</span>
                    </>
                  ) : (
                    <span>SUBMIT</span>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2 pt-2 text-xs text-muted-foreground">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  <IconLock className="h-3 w-3 stroke-[2.5]" />
                </span>
                <span>Immediate Discord alert triggered for our engineering team upon submission.</span>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
