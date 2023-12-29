import { render } from '../tests/utils'
import {
  NoComments,
  OneComment,
  MultipleComments,
} from './DiscussionTitle.stories'
import { NO_COMMENTS, ONE_COMMENT, COMMENTS } from './DiscussionTitle'

import type { IProps } from './DiscussionTitle'

describe('DiscussionTitle', () => {
  it('renders correctly when there are zero comments', () => {
    const { getByText } = render(
      <NoComments {...(NoComments.args as IProps)} />,
    )

    expect(getByText(NO_COMMENTS)).toBeInTheDocument()
  })

  it('renders correctly when there is one comment', () => {
    const { getByText } = render(
      <OneComment {...(OneComment.args as IProps)} />,
    )

    expect(getByText(ONE_COMMENT)).toBeInTheDocument()
  })

  it('renders correctly when there are multiple comments', () => {
    const { getByText } = render(
      <MultipleComments {...(MultipleComments.args as IProps)} />,
    )

    expect(getByText(`45 ${COMMENTS}`)).toBeInTheDocument()
  })
})
