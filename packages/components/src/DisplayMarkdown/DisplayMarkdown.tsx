import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'
import remarkYoutube from 'remark-youtube'

import { DisplayMarkdownStylingWrapper } from './DisplayMarkdownStylingWrapper'

export interface IProps {
  body: string
}

export const DisplayMarkdown = ({ body }: IProps) => {
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
      <Markdown
        remarkPlugins={[
          remarkBreaks,
          remarkGfm,
          [remarkYoutube, { width: 760, height: 420 }],
        ]}
        rehypePlugins={[rehypeRaw]}
        skipHtml={true}
      >
        {body}
      </Markdown>
    </DisplayMarkdownStylingWrapper>
  )
}
