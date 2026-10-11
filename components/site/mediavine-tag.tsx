import Script from "next/script"

interface MediavineTagProps {
  tagId?: string
}

export function MediavineTag({ tagId }: MediavineTagProps) {
  if (!tagId) return null

  return (
    <Script
      id="mediavine-tag"
      src={`https://scripts.mediavine.com/tags/${tagId}.js`}
      strategy="afterInteractive"
      data-noptimize="1"
      data-cfasync="false"
    />
  )
}
