import { act } from 'react-dom/test-utils'
import { fireEvent } from '@testing-library/react'

import { render } from '../tests/utils'
import { Default, WithReplies } from './DiscussionContainer.stories'

import type { IProps } from './DiscussionContainer'

describe('DiscussionContainer', () => {
  it('validates the component behaviour', () => {
    const { getByText } = render(<Default {...(Default.args as IProps)} />)

    expect(getByText('3 Comments')).toBeInTheDocument()
    expect(getByText('Leave a comment')).toBeInTheDocument()

    expect(() => getByText('reply')).toThrow()
  })

  it('allows replying to a comment', async () => {
    const screen = render(<WithReplies {...(WithReplies.args as IProps)} />)

    const replyButton = screen.getAllByText('reply')[0]
    expect(replyButton).toBeInTheDocument()

    // Show reply form
    await act(async () => {
      await fireEvent.click(replyButton)
      expect(screen.getAllByText('Send your reply')).toHaveLength(1)
    })

    // Hide reply form
    await act(async () => {
      await fireEvent.click(replyButton)
      expect(() => {
        screen.getAllByText('Send your reply')
      }).toThrow()
    })

    const SecondReplyButton = screen.getAllByText('reply')[2]
    expect(SecondReplyButton).toBeInTheDocument()

    // Show reply form
    await act(async () => {
      await fireEvent.click(SecondReplyButton)
      expect(screen.getAllByText('Send your reply')).toHaveLength(1)
    })

    // Hide reply form
    await act(async () => {
      await fireEvent.click(SecondReplyButton)
      expect(() => {
        screen.getAllByText('Send your reply')
      }).toThrow()
    })
  })

  it('does not show the reply form more than once', async () => {
    const screen = render(<WithReplies {...(WithReplies.args as IProps)} />)

    const replyButton = screen.getAllByText('reply')[0]
    expect(replyButton).toBeInTheDocument()

    // Show first reply form
    await act(async () => {
      await fireEvent.click(replyButton)
      expect(screen.getAllByText('Send your reply')).toHaveLength(1)
    })

    const SecondReplyButton = screen.getAllByText('reply')[2]
    expect(SecondReplyButton).toBeInTheDocument()

    // Show second reply form
    await act(async () => {
      await fireEvent.click(SecondReplyButton)
      expect(screen.getAllByText('Send your reply')).toHaveLength(1)
    })
  })

  it.todo(
    'adding a reply to a comment does not affect the primary create comment form',
    async () => {},
  )
})
