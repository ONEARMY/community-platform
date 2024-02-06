import { render } from '../tests/utils'
import { Default, LoggedIn } from './CreateReply.stories'

import type { Props } from './CreateReply'

describe('CreateReply', () => {
  it('when logged out shows the login message', () => {
    const { getByText } = render(<Default {...(Default.args as Props)} />)

    expect(
      getByText('to leave a comment', { exact: false }),
    ).toBeInTheDocument()
  })

  it('when logged in shows the login message', () => {
    const screen = render(<LoggedIn {...(LoggedIn.args as Props)} />)

    const textarea = screen.getByPlaceholderText('Leave your question', {
      exact: false,
    })

    expect(textarea).toBeInTheDocument()
  })
})
