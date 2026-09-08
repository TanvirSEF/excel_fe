import type { Metadata } from "next"

export function calculatorMetadata(
  name: string,
  description: string,
  path: string
): Metadata {
  return {
    title: `${name} | Excel Insider`,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${name} | Excel Insider`,
      description,
      url: path,
      images: ["/og-default.png"],
    },
  }
}
