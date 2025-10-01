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
  // Match YouTube URLs that are not already in links or iframes
  const standalonePattern =
    /(?<!<a[^>]*>)(?<!<iframe[^>]*src=["'])https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})(?![^<]*<\/a>)(?![^<]*">)/g

  return html.replace(standalonePattern, (match, videoId) => {
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
  })
}
