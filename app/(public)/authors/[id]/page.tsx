import { notFound, permanentRedirect } from "next/navigation"
import { getAuthor } from "@/lib/api/authors"
import { ApiClientError } from "@/lib/api/error"

interface AuthorRedirectProps {
  params: Promise<{ id: string }>
}

export default async function AuthorsRedirectPage({ params }: AuthorRedirectProps) {
  const { id } = await params
  try {
    const author = await getAuthor(id)
    permanentRedirect(`/author/${author.slug || author.id}/`)
  } catch (error) {
    if (error instanceof ApiClientError && error.status === 404) {
      notFound()
    }
    throw error
  }
}
