import Highlighter from 'react-highlight-words'
import { Text } from 'theme-ui'

const HighLighted = ({ children }: { children: string }) => {
  return <Text sx={{ background: 'accent.hover' }}>{children}</Text>
}

export interface IProps {
  searchWords: (string | RegExp)[]
  textToHighlight: string
}

const HighlighterComponent = (props: IProps) => {
  return (
    <Highlighter
      highlightTag={HighLighted}
      autoEscape={true}
      {...props}
      searchWords={props.searchWords}
      textToHighlight={props.textToHighlight}
    />
  )
}

export { HighlighterComponent as Highlighter }
