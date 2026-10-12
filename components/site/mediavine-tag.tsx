interface MediavineTagProps {
  tagId?: string
}

export function MediavineTag({ tagId }: MediavineTagProps) {
  if (!tagId) return null

  return (
    <>
      <link rel="dns-prefetch" href="https://scripts.mediavine.com" />
      <link rel="preconnect" href="https://scripts.mediavine.com" crossOrigin="" />
      <link rel="preconnect" href="https://securepubads.g.doubleclick.net" crossOrigin="" />
      <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="" />
      <script
        async
        data-noptimize="1"
        data-cfasync="false"
        src={`https://scripts.mediavine.com/tags/${tagId}.js`}
      />
    </>
  )
}
