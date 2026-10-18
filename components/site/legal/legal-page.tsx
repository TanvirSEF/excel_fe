import type { ReactNode } from "react"

import { MobileToc } from "@/components/blocks/mobile-toc"
import { Toc } from "@/components/blocks/toc"
import { Breadcrumb } from "@/components/site/breadcrumb"
import { PageHeader } from "@/components/site/page-header"
import type { TocEntry } from "@/lib/blocks"

interface LegalPageProps {
  title: string
  description: string
  breadcrumbLabel: string
  updatedAt?: string
  toc: TocEntry[]
  children: ReactNode
}

export function LegalPage({
  title,
  description,
  breadcrumbLabel,
  updatedAt,
  toc,
  children,
}: LegalPageProps) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:py-14">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: breadcrumbLabel }]} />

      <div className="mt-6">
        <PageHeader
          bordered
          title={title}
          description={description}
          meta={updatedAt ? `Last updated ${updatedAt}` : undefined}
        />
      </div>

      <div className="mt-8 sm:mt-10 grid gap-8 lg:gap-10 xl:gap-12 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-7.5rem)] overflow-y-auto overscroll-contain pb-8 pr-1.5 [scrollbar-width:thin] [scrollbar-color:var(--color-primary-30)_transparent] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border hover:[&::-webkit-scrollbar-thumb]:bg-primary/40">
            <Toc entries={toc} />
          </div>
        </aside>

        <div className="legal-prose min-w-0 max-w-none space-y-10 sm:space-y-12">
          <div className="lg:hidden">
            <MobileToc entries={toc} />
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
