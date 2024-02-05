import { render } from '../tests/utils'
import { Default } from './CreateReply.stories'
import type { CreateReplyProps } from './CreateReply'

describe('CreateReply', () => {
  it('validates the component behaviour', () => {
    const { getByText } = render(
      <Default {...(Default.args as CreateReplyProps)} />,
    )

    expect(getByText('CreateReply')).toBeInTheDocument()
  })
})
