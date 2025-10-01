import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'
import remarkYoutube from 'remark-youtube'

export interface IProps {
  body: string
}

export const DisplayMarkdown = ({ body }: IProps) => {
  return (
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
  )
}
