export const extractYouTubeId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
};

export const processYouTubeLinks = (html: string): string => {
  // Match YouTube URLs in links (including links with nested HTML elements)
  const youtubePattern =
    /<a[^>]*href=["']([^"']*(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)[^"']*)["'][^>]*>([\s\S]*?)<\/a>/g;

  return html.replace(youtubePattern, (match, url, _linkText) => {
    const videoId = extractYouTubeId(url);

    if (videoId) {
      return `
        <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; margin: 16px 0;">
          <iframe 
            src="https://www.youtube.com/embed/${videoId}" 
            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; margin: 0 auto;"
            frameborder="0" 
            allowfullscreen
            title="YouTube video player">
          </iframe>
        </div>
      `;
    }

    return match; // Return original if no video ID found
  });
};

export const processStandaloneYouTubeUrls = (html: string): string => {
  // Match YouTube URLs - Safari 15 compatible (no negative lookbehind)
  const youtubePattern = /https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/g;

  // Find all potential YouTube URLs
  const matches = Array.from(html.matchAll(youtubePattern));

  // Process matches in reverse order to avoid index shifting
  for (let i = matches.length - 1; i >= 0; i--) {
    const match = matches[i];
    const fullMatch = match[0];
    const videoId = match[1];
    const startIndex = match.index!;

    // Check if URL is already inside a link or iframe by examining context
    const beforeMatch = html.substring(Math.max(0, startIndex - 200), startIndex);
    const afterMatch = html.substring(startIndex + fullMatch.length, Math.min(html.length, startIndex + fullMatch.length + 200));

    // Skip if already in a link
    const isInLink = /<a[^>]*href=["'][^"']*$/.test(beforeMatch) && /["'][^>]*>[\s\S]*?<\/a>/.test(afterMatch);

    // Skip if already in an iframe src attribute
    const isInIframe = /<iframe[^>]*src=["'][^"']*$/.test(beforeMatch) && /["'][^>]*>/.test(afterMatch);

    // Skip if this is an embed URL that's already properly formatted
    const isEmbedUrl = fullMatch.includes('/embed/');

    // Skip if we're inside an existing YouTube embed div structure
    const isInYouTubeEmbed =
      beforeMatch.includes('<div style="position: relative; padding-bottom:') &&
      afterMatch.includes('</iframe>') &&
      afterMatch.includes('</div>');

    if (!isInLink && !isInIframe && !isEmbedUrl && !isInYouTubeEmbed) {
      const replacement = `
        <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; margin: 16px 0;">
          <iframe 
            src="https://www.youtube.com/embed/${videoId}" 
            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; margin: 0 auto;"
            frameborder="0" 
            allowfullscreen
            title="YouTube video player">
          </iframe>
        </div>
      `;

      html = html.substring(0, startIndex) + replacement + html.substring(startIndex + fullMatch.length);
    }
  }

  return html;
};
