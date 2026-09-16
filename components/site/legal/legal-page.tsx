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
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:py-14">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: breadcrumbLabel }]} />

      <div className="mt-6">
        <PageHeader
          bordered
          title={title}
          description={description}
          meta={updatedAt ? `Last updated ${updatedAt}` : undefined}
        />
      </div>

      <div className="mt-10 grid gap-12 lg:grid-cols-[230px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pb-8">
            <Toc entries={toc} />
          </div>
        </aside>

        <div className="legal-prose min-w-0 space-y-12">
          <div className="lg:hidden">
            <MobileToc entries={toc} />
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
