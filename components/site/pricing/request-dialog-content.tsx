"use client"

import { ContactForm } from "@/components/site/contact-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface RequestDialogContentProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  service?: string | null
}

export function RequestDialogContent({
  open,
  onOpenChange,
  service = null,
}: RequestDialogContentProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden rounded-2xl border-border/70 bg-background/95 p-0 shadow-2xl backdrop-blur-xl sm:max-w-xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Request spreadsheet help</DialogTitle>
          <DialogDescription>
            Send us your spreadsheet problem and we will get back to you by
            email.
          </DialogDescription>
        </DialogHeader>
        <ContactForm
          service={service}
          onSuccess={() => onOpenChange(false)}
          className="rounded-none border-0 bg-transparent shadow-none"
        />
      </DialogContent>
    </Dialog>
  )
}
