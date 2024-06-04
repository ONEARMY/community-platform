import { Heading } from 'theme-ui'

export const NO_COMMENTS = 'Start the discussion'
export const ONE_COMMENT = '1 Comment'
export const COMMENTS = 'Comments'

export interface IProps {
  length: number
}

export const DiscussionTitle = ({ length }: IProps) => {
  const setTitle = () => {
    if (length === 0) {
      return NO_COMMENTS
    }
    if (length === 1) {
      return ONE_COMMENT
    }

    return `${length} ${COMMENTS}`
  }

  const title = setTitle()

  return <Heading as="h3">{title}</Heading>
}
