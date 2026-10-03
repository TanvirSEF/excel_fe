import { permanentRedirect } from "next/navigation"

interface ServiceRequestHelpProps {
  searchParams: Promise<{ service?: string }>
}

export default async function ServicesRequestHelpPage({
  searchParams,
}: ServiceRequestHelpProps) {
  const { service } = await searchParams
  const target = service
    ? `/spreadsheet-solutions/request-help/?service=${encodeURIComponent(service)}`
    : "/spreadsheet-solutions/request-help/"
  permanentRedirect(target)
}
