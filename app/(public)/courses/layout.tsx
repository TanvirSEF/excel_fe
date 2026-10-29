import { QueryProvider } from "@/components/query-provider"

export default function CoursesLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <QueryProvider>{children}</QueryProvider>
}
