import { act } from 'react-dom/test-utils'
import { fireEvent } from '@testing-library/react'

import { render } from '../tests/utils'
import { Default, WithReplies } from './DiscussionContainer.stories'

describe('DiscussionContainer', () => {
  it('validates the component behaviour', () => {
    const { getByText } = render(<Default.render />)

    expect(getByText('3 Comments')).toBeInTheDocument()
    expect(getByText('Leave a comment')).toBeInTheDocument()

    expect(() => getByText('reply')).toThrow()
<<<<<<< HEAD
  })

  it('allows replying to a comment', async () => {
    const screen = render(<WithReplies.render />)

    // Show reply form
    await act(async () => {
      const replyButton = screen.getAllByText('2 replies to', {
        exact: false,
      })[0]
      expect(replyButton).toBeInTheDocument()

      await fireEvent.click(replyButton)

      expect(screen.getAllByText('Leave a reply')).toHaveLength(1)
    })

    // Hide reply form
    await act(async () => {
      const replyButton = screen.getAllByText('2 replies to', {
        exact: false,
      })[0]
      await fireEvent.click(replyButton)
      expect(() => {
        screen.getAllByText('Leave a reply')
      }).toThrow()
    })

    const SecondReplyButton = screen.getAllByText('Reply to', {
      exact: false,
    })[0]
    expect(SecondReplyButton).toBeInTheDocument()

    // Show reply form
    await act(async () => {
      await fireEvent.click(SecondReplyButton)
      expect(screen.getAllByText('Leave a reply')).toHaveLength(1)
    })

    // Hide reply form
    await act(async () => {
      await fireEvent.click(SecondReplyButton)
      expect(() => {
        screen.getAllByText('Send your reply')
      }).toThrow()
    })
=======
>>>>>>> production
  })

  it('allows replying to a comment', async () => {
    const screen = render(<WithReplies.render />)

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
    const screen = render(<WithReplies.render />)

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

  it.todo('allows replying to a comment', async () => {
    // const handleSubmitReply: any = vi.fn()
    // const screen = render(
    //   <WithReplies.render
    //     {...WithReplies.args}
    //     onSubmitReply={handleSubmitReply}
    //   />,
    // )
    // const replyButton = screen.getAllByText('reply')[0]
    // expect(replyButton).toBeInTheDocument()
    // // Show reply form
    // await act(async () => {
    //   await fireEvent.click(replyButton)
    //   expect(screen.getAllByText('Send your reply')).toHaveLength(1)
    //   const textarea = screen.getAllByPlaceholderText(
    //     'Leave your questions or feedback...',
    //   )[0]
    //   await fireEvent.change(textarea, { target: { value: 'New comment' } })
    //   await fireEvent.click(screen.getByText('Send your reply'))
    //   expect(handleSubmitReply).toHaveBeenCalled()
    // })
  })

  it.todo(
    'adding a reply to a comment does not affect the primary create comment form',
    async () => {},
  )
})
