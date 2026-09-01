"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { IconSend } from "@tabler/icons-react"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ApiClientError } from "@/lib/api/error"
import { submitContactMessage } from "@/lib/api/contact"

const SERVICE_LABELS: Record<string, string> = {
  troubleshooting: "Spreadsheet Troubleshooting",
  "custom-template": "Custom Executive Dashboards",
  automation: "VBA & Macro Automations",
  modeling: "Financial Modeling Services",
}

const contactSchema = z.object({
  email: z.email("Enter a valid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters").max(255),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message must be under 5000 characters"),
})

type ContactForm = z.infer<typeof contactSchema>

interface ContactFormProps {
  service?: string | null
}

export function ContactForm({ service = null }: ContactFormProps) {
  const serviceLabel = service ? SERVICE_LABELS[service] : undefined

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: { email: "", subject: "", message: "" },
  })

  async function onSubmit(values: ContactForm) {
    try {
      await submitContactMessage({
        ...values,
        service: service ?? undefined,
      })
      toast.success("Message sent! We usually respond within 24–48 hours.")
      reset()
    } catch (error) {
      if (error instanceof ApiClientError) {
        toast.error(error.message)
      } else {
        toast.error("Could not send your message. Please try again.")
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-2xl border border-border/80 bg-card p-6 shadow-2xs sm:p-8"
      noValidate
    >
      <div className="space-y-1">
        <h2 className="text-xl font-bold tracking-tight">Send Message</h2>
        <p className="text-sm text-muted-foreground">
          Fill out the form and our spreadsheet experts will get back to you by
          email.
        </p>
      </div>

      {serviceLabel ? (
        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3.5 py-1.5 text-xs font-semibold text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Asking about: {serviceLabel}
        </div>
      ) : null}

      <div className="mt-6 grid gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="contact-email">Email</Label>
          <Input
            id="contact-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={errors.email ? true : undefined}
            {...register("email")}
          />
          {errors.email ? (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="contact-subject">Subject</Label>
          <Input
            id="contact-subject"
            placeholder="How can we help?"
            aria-invalid={errors.subject ? true : undefined}
            {...register("subject")}
          />
          {errors.subject ? (
            <p className="text-xs text-destructive">
              {errors.subject.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="contact-message">Message</Label>
          <Textarea
            id="contact-message"
            rows={6}
            placeholder="Tell us about your workbook, formula bug, or the custom template you need…"
            aria-invalid={errors.message ? true : undefined}
            {...register("message")}
          />
          {errors.message ? (
            <p className="text-xs text-destructive">
              {errors.message.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-6 flex flex-col-reverse items-start justify-between gap-4 sm:flex-row sm:items-center">
        <p className="text-xs leading-relaxed text-muted-foreground">
          We usually respond within 24–48 hours on business days.
        </p>
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2"
        >
          {isSubmitting ? "Sending…" : "Send"}
          {!isSubmitting ? <IconSend className="h-4 w-4" /> : null}
        </Button>
      </div>
    </form>
  )
}
