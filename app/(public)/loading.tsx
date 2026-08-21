import { Skeleton } from "@/components/ui/skeleton"

export default function PublicLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4">
      <div className="flex flex-col items-center gap-5 py-16 text-center sm:py-24">
        <Skeleton className="h-6 w-40 rounded-full" />
        <Skeleton className="h-12 w-full max-w-2xl" />
        <Skeleton className="h-11 w-full max-w-md rounded-lg" />
      </div>
      <div className="grid grid-cols-1 gap-5 pb-10 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="space-y-3 rounded-xl border p-3">
            <Skeleton className="aspect-video w-full rounded-lg" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    </div>
  )
}
