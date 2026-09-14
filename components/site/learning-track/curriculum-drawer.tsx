"use client"

import { useState } from "react"
import { IconListTree } from "@tabler/icons-react"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { CurriculumSidebar } from "@/components/site/learning-track/curriculum-sidebar"
import type { CurriculumModule } from "@/types/api"

interface CurriculumDrawerProps {
  modules: CurriculumModule[]
  activeLessonSlug?: string
}

export function CurriculumDrawer({
  modules,
  activeLessonSlug,
}: CurriculumDrawerProps) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="fixed bottom-6 right-4 z-40 inline-flex h-12 items-center gap-2 rounded-full bg-teal-600 px-4 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-teal-700 xl:hidden"
        aria-label="Open curriculum"
      >
        <IconListTree className="h-4.5 w-4.5" />
        Curriculum
      </SheetTrigger>
      <SheetContent side="right" className="w-full overflow-y-auto p-0 sm:max-w-sm">
        <SheetHeader className="border-b border-border/60 px-4 py-3">
          <SheetTitle className="text-base">Learning Track</SheetTitle>
          <SheetDescription className="text-xs">
            Google Sheets course curriculum
          </SheetDescription>
        </SheetHeader>
        <div
          className="p-3"
          onClickCapture={(event) => {
            if ((event.target as HTMLElement).closest("a")) setOpen(false)
          }}
        >
          <CurriculumSidebar modules={modules} activeLessonSlug={activeLessonSlug} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
