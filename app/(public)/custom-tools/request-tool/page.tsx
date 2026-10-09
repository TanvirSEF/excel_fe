import type { Metadata } from "next"

import { Breadcrumb } from "@/components/site/breadcrumb"
import { ServiceRequestWizard } from "@/components/site/services/service-request-wizard"

export const metadata: Metadata = {
  title: "Request Custom Spreadsheet Tool | Excel Insider",
  description:
    "Get started with 3 easy steps. Tell us about your automation, VBA macro, Power Query or Google Workspace add-on requirements, and our engineers will build your custom tool.",
  alternates: { canonical: "/custom-tools/request-tool/" },
  openGraph: {
    title: "Request Custom Spreadsheet Tool | Excel Insider",
    description:
      "Get started with 3 easy steps. Tell us about your automation, VBA macro, Power Query or Google Workspace add-on requirements, and our engineers will build your custom tool.",
    url: "/custom-tools/request-tool/",
    images: ["/og-default.png"],
  },
}

interface RequestToolPageProps {
  searchParams: Promise<{ service?: string; plan?: string }>
}

export default async function RequestToolPage({ searchParams }: RequestToolPageProps) {
  const { service, plan } = await searchParams

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Custom Spreadsheet Tools", href: "/custom-tools/" },
    { label: "Request Custom Tool" },
  ]

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <ServiceRequestWizard
        preselectedService={service || "tools"}
        preselectedPlan={plan}
      />
    </div>
  )
}
