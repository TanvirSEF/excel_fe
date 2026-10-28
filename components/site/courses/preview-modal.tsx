"use client"

import * as React from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface PreviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  videoUrl: string | null
  title: string
}

export function PreviewModal({
  open,
  onOpenChange,
  videoUrl,
  title,
}: PreviewModalProps) {
  if (!videoUrl) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 sm:max-w-3xl">
        <DialogHeader className="p-4 pb-2">
          <DialogTitle className="text-base font-semibold">{title}</DialogTitle>
        </DialogHeader>
        <div className="relative aspect-video w-full bg-black">
          <video
            src={videoUrl}
            controls
            autoPlay
            className="h-full w-full object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
