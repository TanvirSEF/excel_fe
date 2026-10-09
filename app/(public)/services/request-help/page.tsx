import { permanentRedirect } from "next/navigation"

interface ServicesRequestHelpProps {
  searchParams: Promise<{ service?: string }>
}

export default async function ServicesRequestHelpPage({
  searchParams,
}: ServicesRequestHelpProps) {
  const { service } = await searchParams
  const target = service
    ? `/spreadsheet-solutions/request-help/?service=${encodeURIComponent(service)}`
    : "/spreadsheet-solutions/request-help/"
  permanentRedirect(target)
}
