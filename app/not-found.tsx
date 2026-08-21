import { NotFoundContent } from "@/components/shared/not-found-content"

export default function RootNotFound() {
  return (
    <div className="flex min-h-svh items-center justify-center px-4">
      <NotFoundContent title="Page not found" />
    </div>
  )
}
