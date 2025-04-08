import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Box } from 'theme-ui'

export interface IProps {
  body: string
}

export const DisplayMarkdown = ({ body }: IProps) => {
  return (
    <Box
      sx={{
        alignSelf: 'flex-start',
        img: {
          borderRadius: 2,
          maxWidth: ['105%', '105%', '120%'],
          marginLeft: ['-2.5%', '-2.5%', '-10%'],
        },
        blockquote: {
          borderLeft: '3px solid',
          paddingY: '1px',
          paddingLeft: 2,
          margin: 0,
        },
        a: {
          color: 'primary',
          textDecoration: 'underline',
          '&:hover': { textDecoration: 'none' },
        },
      }}
    >
      <Markdown remarkPlugins={[remarkGfm]} skipHtml={true}>
        {body}
      </Markdown>
    </Box>
  )
}
