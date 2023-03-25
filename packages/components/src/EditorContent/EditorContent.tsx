import {
  Callout,
  CodeBlock,
  createIFrameHandler,
  createLinkHandler,
  Doc,
  Heading,
  RemirrorRenderer,
  TextHandler,
} from '@remirror/react'
import type { MarkMap } from '@remirror/react'
import { Username } from '../Username/Username'

const typeMap: MarkMap = {
  blockquote: 'blockquote',
  bulletList: 'ul',
  callout: Callout,
  codeBlock: CodeBlock,
  doc: Doc,
  hardBreak: 'br',
  heading: Heading,
  horizontalRule: 'hr',
  iframe: createIFrameHandler(),
  image: 'img',
  listItem: 'li',
  paragraph: 'p',
  orderedList: 'ol',
  taskList: 'ul',
  taskListItem: (props: any) => (
    <li style={{ display: 'flex' }}>
      <input
        type={'checkbox'}
        checked={!!props.node.attrs.checked}
        readOnly={true}
        style={{
          pointerEvents: 'none',
          display: 'inline-block',
          marginRight: '5px',
        }}
      />
      {props.children}
    </li>
  ),
  text: TextHandler,
}

const markMap: MarkMap = {
  italic: 'em',
  bold: 'strong',
  code: 'code',
  link: createLinkHandler({ target: '_blank' }),
  underline: 'u',
  mention: (mention: { id: string }) => {
    return (
      <Username
        user={{
          userName: mention.id,
          countryCode: 'nl',
        }}
        isVerified={false}
      />
    )
  },
}

export interface Props {
  json: any
}

export const EditorContent = (props: Props) => {
  return (
    <>
      <RemirrorRenderer
        json={props.json}
        markMap={markMap}
        typeMap={typeMap}
        skipUnknownMarks={true}
        skipUnknownTypes={true}
      />
    </>
  )
}
