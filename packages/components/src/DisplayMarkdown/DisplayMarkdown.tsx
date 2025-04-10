import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

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
      }}
    >
      <Markdown remarkPlugins={[remarkGfm]} skipHtml={true}>
        {body}
      </Markdown>
    </DisplayMarkdownStylingWrapper>
  )
}
