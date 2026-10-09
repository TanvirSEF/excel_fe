import type { Metadata } from "next"

import { Breadcrumb } from "@/components/site/breadcrumb"
import { ServiceRequestWizard } from "@/components/site/services/service-request-wizard"

export const metadata: Metadata = {
  title: "Order Plan & Request Help | Excel Insider",
  description:
    "Get started with 3 easy steps. Submit your spreadsheet bug, formula needs, or workbook optimization details directly to our engineering team.",
  alternates: { canonical: "/spreadsheet-solutions/request-help/" },
  openGraph: {
    title: "Order Plan & Request Help | Excel Insider",
    description:
      "Get started with 3 easy steps. Submit your spreadsheet task details, contact information, and target budget for rapid expert turnaround.",
    url: "/spreadsheet-solutions/request-help/",
    images: ["/og-default.png"],
  },
}

interface RequestHelpPageProps {
  searchParams: Promise<{ service?: string; plan?: string }>
}

export default async function RequestHelpPage({ searchParams }: RequestHelpPageProps) {
  const { service, plan } = await searchParams

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Spreadsheet Solutions", href: "/spreadsheet-solutions/" },
    { label: "Request Help" },
  ]

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <ServiceRequestWizard
        preselectedService={service || "consulting"}
        preselectedPlan={plan}
      />
    </div>
  )
}
