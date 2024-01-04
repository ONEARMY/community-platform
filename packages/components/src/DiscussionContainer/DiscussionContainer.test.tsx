import { render } from '../tests/utils'
import { Default } from './DiscussionContainer.stories'

import type { IProps } from './DiscussionContainer'

describe('DiscussionContainer', () => {
  it('validates the component behaviour', () => {
    const { getByText } = render(<Default {...(Default.args as IProps)} />)

    expect(getByText('3 Comments')).toBeInTheDocument()
    expect(getByText('Leave a comment')).toBeInTheDocument()
  })
})
