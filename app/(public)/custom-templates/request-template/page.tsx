import type { Metadata } from "next"

import { Breadcrumb } from "@/components/site/breadcrumb"
import { ServiceRequestWizard } from "@/components/site/services/service-request-wizard"

export const metadata: Metadata = {
  title: "Request Custom Spreadsheet Template | Excel Insider",
  description:
    "Get started with 3 easy steps. Tell us about your workbook workflow, desired tabs, calculations and custom design, and our engineers will build your template.",
  alternates: { canonical: "/custom-templates/request-template/" },
  openGraph: {
    title: "Request Custom Spreadsheet Template | Excel Insider",
    description:
      "Get started with 3 easy steps. Tell us about your workbook workflow, desired tabs, calculations and custom design, and our engineers will build your template.",
    url: "/custom-templates/request-template/",
    images: ["/og-default.png"],
  },
}

interface RequestTemplatePageProps {
  searchParams: Promise<{ service?: string; plan?: string }>
}

export default async function RequestTemplatePage({ searchParams }: RequestTemplatePageProps) {
  const { service, plan } = await searchParams

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Custom Templates", href: "/custom-templates/" },
    { label: "Request Custom Template" },
  ]

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <ServiceRequestWizard
        preselectedService={service || "templates"}
        preselectedPlan={plan}
      />
    </div>
  )
}
