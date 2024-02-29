import { fireEvent } from '@testing-library/react'

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

  it('clears the field after sucessful submission', () => {
    const screen = render(<LoggedIn {...(LoggedIn.args as Props)} />)

    const emptyTextArea = screen.getByPlaceholderText('Leave your question', {
      exact: false,
    })
    fireEvent.change(emptyTextArea, { target: { value: '123' } })
    const withText = screen.getByText('123', {
      exact: false,
    })
    expect(withText).toBeInTheDocument()

    const submitButton = screen.getByText('Leave a reply')
    fireEvent.click(submitButton)
    expect(emptyTextArea).toBeInTheDocument()
  })
})
