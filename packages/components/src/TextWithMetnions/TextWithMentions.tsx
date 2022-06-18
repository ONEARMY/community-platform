import type { ReactNode } from 'react'
import * as React from 'react'
import reactStringReplace from 'react-string-replace'
import { Link } from 'react-router-dom'

interface Props {
  text: string
}

export const TextWithMentions = (props: Props) => {
  const parseMentions = (text: string): ReactNode => {
    const regexp = /@\[(\w+:.+)\]/
    const textWithMentions = reactStringReplace(text, regexp, (mention, i) => {
      const nameAndLink = mention.split(':')
      const name = nameAndLink[0]
      const link = nameAndLink[1]
      return (
        <Link to={link} key={mention + i}>
          {'@' + name}
        </Link>
      )
    })
    return textWithMentions
  }

  return <React.Fragment>{parseMentions(props.text)}</React.Fragment>
}
