import { notFound, permanentRedirect, redirect } from "next/navigation"

import { getWpRedirect, looksLikeWpPath } from "@/lib/api/redirects"

interface CatchAllPageProps {
  params: Promise<{ path: string[] }>
}

export default async function CatchAllPage({ params }: CatchAllPageProps) {
  const { path } = await params
  const pathname = `/${path.join("/")}`

  if (looksLikeWpPath(pathname)) {
    const redirectRow = await getWpRedirect(pathname)
    if (redirectRow?.new_path) {
      const target = redirectRow.new_path.startsWith("/")
        ? redirectRow.new_path
        : `/${redirectRow.new_path}`
      if (redirectRow.redirect_type === 301) {
        permanentRedirect(target)
      }
      redirect(target)
    }
  }

  notFound()
}
