import { render } from '../tests/utils'
import { Default, EditReply } from './EditComment.stories'

import type { IProps } from './EditComment'

describe('EditComment', () => {
  it('showed correct title when a comment', () => {
    const { getByText } = render(<Default {...(Default.args as IProps)} />)

    expect(getByText('Edit Comment')).toBeInTheDocument()
    expect(() => getByText('Edit Reply')).toThrow()
  })
  it('showed correct title when a reply', () => {
    const { getByText } = render(<EditReply {...(EditReply.args as IProps)} />)

    expect(getByText('Edit Reply')).toBeInTheDocument()
    expect(() => getByText('Edit Comment')).toThrow()
  })
})
