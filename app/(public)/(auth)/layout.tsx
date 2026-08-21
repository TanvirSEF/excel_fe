export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-[70svh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  )
}
