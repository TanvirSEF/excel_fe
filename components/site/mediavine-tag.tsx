import Script from "next/script"

interface MediavineTagProps {
  tagId?: string
}

export function MediavineTag({ tagId }: MediavineTagProps) {
  if (!tagId) return null

  return (
    <>
      <link rel="dns-prefetch" href="https://scripts.mediavine.com" />
      <Script
        id="mediavine-tag"
        src={`https://scripts.mediavine.com/tags/${tagId}.js`}
        strategy="lazyOnload"
        data-noptimize="1"
        data-cfasync="false"
      />
    </>
  )
}
