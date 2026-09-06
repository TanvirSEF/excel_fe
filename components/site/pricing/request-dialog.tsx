"use client"

import { IconArrowRight } from "@tabler/icons-react"
import dynamic from "next/dynamic"
import { useState } from "react"

import { Button } from "@/components/ui/button"

const RequestDialogContent = dynamic(
  () =>
    import("./request-dialog-content").then((m) => m.RequestDialogContent),
  { ssr: false }
)

interface RequestDialogProps {
  label: string
  service?: string | null
  className?: string
}

export function RequestDialog({ label, service = null, className }: RequestDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button className={className} onClick={() => setOpen(true)}>
        {label}
        <IconArrowRight className="h-4 w-4" />
      </Button>
      {open && (
        <RequestDialogContent open={open} onOpenChange={setOpen} service={service} />
      )}
    </>
  )
}
