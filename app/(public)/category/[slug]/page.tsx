import { permanentRedirect } from "next/navigation"

interface CategoryLegacyPageProps {
  params: Promise<{ slug: string }>
}

export default async function LegacyCategoryPage({
  params,
}: CategoryLegacyPageProps) {
  const { slug } = await params
  permanentRedirect(`/${slug}/`)
}
