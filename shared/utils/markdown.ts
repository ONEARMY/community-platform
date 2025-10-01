export const extractYouTubeId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) {
      return match[1]
    }
  }

  return null
}

export const processYouTubeLinks = (
  html: string,
  width = 760,
  height = 420,
): string => {
  // Match YouTube URLs in links
  const youtubePattern =
    /<a[^>]*href=["']([^"']*(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)[^"']*)["'][^>]*>([^<]*)<\/a>/g

  return html.replace(youtubePattern, (match, url, _linkText) => {
    const videoId = extractYouTubeId(url)

    if (videoId) {
      return `
        <div style="position: relative; padding-bottom: ${
          (height / width) * 100
        }%; height: 0; overflow: hidden; max-width: 100%; margin: 16px 0;">
          <iframe 
            src="https://www.youtube.com/embed/${videoId}" 
            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
            frameborder="0" 
            allowfullscreen
            title="YouTube video player">
          </iframe>
        </div>
      `
    }

    return match // Return original if no video ID found
  })
}

export const processStandaloneYouTubeUrls = (
  html: string,
  width = 760,
  height = 420,
): string => {
  // Match YouTube URLs - Safari 15 compatible (no negative lookbehind)
  const youtubePattern =
    /https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/g

  // Find all potential YouTube URLs
  const matches = Array.from(html.matchAll(youtubePattern))

  // Process matches in reverse order to avoid index shifting
  for (let i = matches.length - 1; i >= 0; i--) {
    const match = matches[i]
    const fullMatch = match[0]
    const videoId = match[1]
    const startIndex = match.index!

    // Check if URL is already inside a link or iframe by examining context
    const beforeMatch = html.substring(
      Math.max(0, startIndex - 100),
      startIndex,
    )
    const afterMatch = html.substring(
      startIndex + fullMatch.length,
      Math.min(html.length, startIndex + fullMatch.length + 100),
    )

    // Skip if already in a link or iframe
    const isInLink = /<a[^>]*$/.test(beforeMatch) && /<\/a>/.test(afterMatch)
    const isInIframe =
      /<iframe[^>]*src=["'][^"']*$/.test(beforeMatch) &&
      /["'][^>]*>/.test(afterMatch)

    if (!isInLink && !isInIframe) {
      const replacement = `
        <div style="position: relative; padding-bottom: ${
          (height / width) * 100
        }%; height: 0; overflow: hidden; max-width: 100%; margin: 16px 0;">
          <iframe 
            src="https://www.youtube.com/embed/${videoId}" 
            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
            frameborder="0" 
            allowfullscreen
            title="YouTube video player">
          </iframe>
        </div>
      `

      html =
        html.substring(0, startIndex) +
        replacement +
        html.substring(startIndex + fullMatch.length)
    }
  }

  return html
}
