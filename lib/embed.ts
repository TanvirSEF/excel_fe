export interface VideoInfo {
  provider: "youtube" | "vimeo"
  id: string
  embedUrl: string
  thumbnailUrl?: string
  start?: number
}

const YOUTUBE_PATTERNS = [
  /youtu\.be\/([\w-]{6,})/,
  /youtube\.com\/watch\?v=([\w-]{6,})/,
  /youtube\.com\/shorts\/([\w-]{6,})/,
  /youtube\.com\/embed\/([\w-]{6,})/,
]

function parseStartTime(raw: string | null): number | undefined {
  if (!raw) return undefined
  const trimmed = raw.trim().toLowerCase()
  if (!trimmed) return undefined

  if (/^\d+$/.test(trimmed)) {
    return parseInt(trimmed, 10)
  }

  const match = trimmed.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?$/)
  if (!match) return undefined

  const hours = match[1] ? parseInt(match[1], 10) : 0
  const minutes = match[2] ? parseInt(match[2], 10) : 0
  const seconds = match[3] ? parseInt(match[3], 10) : 0
  const total = hours * 3600 + minutes * 60 + seconds
  return total > 0 ? total : undefined
}

export function parseVideoInfo(rawUrl: string): VideoInfo | null {
  try {
    const url = rawUrl.trim()
    const parsed = new URL(url)
    const hostname = parsed.hostname.toLowerCase()

    if (hostname.includes("youtube.com") || hostname === "youtu.be") {
      let videoId: string | null = null
      for (const pattern of YOUTUBE_PATTERNS) {
        const match = url.match(pattern)
        if (match?.[1]) {
          videoId = match[1]
          break
        }
      }

      if (!videoId) return null

      const start = parseStartTime(parsed.searchParams.get("t") ?? parsed.searchParams.get("start"))
      const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}${
        start !== undefined ? `?start=${start}` : ""
      }`

      return {
        provider: "youtube",
        id: videoId,
        embedUrl,
        thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
        start,
      }
    }

    if (hostname === "vimeo.com" || hostname === "player.vimeo.com") {
      const id = parsed.pathname.split("/").filter(Boolean).pop()
      if (id && /^\d+$/.test(id)) {
        return {
          provider: "vimeo",
          id,
          embedUrl: `https://player.vimeo.com/video/${id}`,
        }
      }
    }

    return null
  } catch {
    return null
  }
}

export function toEmbedUrl(url: string): string | null {
  const info = parseVideoInfo(url)
  return info ? info.embedUrl : null
}
