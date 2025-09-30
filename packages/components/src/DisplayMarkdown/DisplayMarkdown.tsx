import DOMPurify from 'dompurify'
import { marked } from 'marked'

import { DisplayMarkdownStylingWrapper } from './DisplayMarkdownStylingWrapper'
import { processStandaloneYouTubeUrls, processYouTubeLinks } from './utils'

export interface IProps {
  body: string
}

// Configure marked with GFM support and line breaks
marked.setOptions({
  breaks: true,
  gfm: true,
})

export const DisplayMarkdown = ({ body }: IProps) => {
  let html = marked(body) as string

  html = processYouTubeLinks(html, 760, 420)
  html = processStandaloneYouTubeUrls(html, 760, 420)

  const cleanHtml = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p',
      'br',
      'strong',
      'em',
      'u',
      's',
      'code',
      'pre',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'ul',
      'ol',
      'li',
      'blockquote',
      'a',
      'img',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
      'div',
      'iframe',
    ],
    ALLOWED_ATTR: [
      'href',
      'title',
      'alt',
      'src',
      'width',
      'height',
      'style',
      'class',
      'id',
      'frameborder',
      'allowfullscreen',
    ],
    ALLOWED_URI_REGEXP:
      /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|blob):|[^a-z]|[a-z+.+-]+(?:[^a-z+.+-:]|$))/i,
  })

  return (
    <DisplayMarkdownStylingWrapper
      sx={{
        img: {
          borderRadius: 2,
          maxWidth: ['105%', '105%', '120%'],
          marginLeft: ['-2.5%', '-2.5%', '-10%'],
        },
        iframe: {
          maxWidth: ['105%', '105%', '120%'],
          maxHeight: ['300px', '370px', '420px'],
          marginLeft: ['-2.5%', '-2.5%', '-10%'],
        },
      }}
    >
      <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
    </DisplayMarkdownStylingWrapper>
  )
}
