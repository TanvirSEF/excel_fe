import { NotFoundContent } from "@/components/shared/not-found-content"

export default function PublicNotFound() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-24">
      <NotFoundContent
        title="#N/A — page not found"
        description="The page you're looking for doesn't exist or has moved."
      />
    </div>
  )
}
