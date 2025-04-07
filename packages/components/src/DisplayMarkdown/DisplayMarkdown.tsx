import Markdown from 'react-markdown'

export interface IProps {
  body: string
}

export const DisplayMarkdown = ({ body }: IProps) => {
  return <Markdown skipHtml={true}>{body}</Markdown>
}
