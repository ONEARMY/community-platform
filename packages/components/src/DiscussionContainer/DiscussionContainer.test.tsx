import '@testing-library/jest-dom'

import { act } from 'react-dom/test-utils'
import { fireEvent } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { render } from '../tests/utils'
import { Default, WithReplies } from './DiscussionContainer.stories'

describe('DiscussionContainer', () => {
  it('validates the component behaviour', () => {
    const { getByText } = render(<Default.render />)

    expect(getByText('3 Comments')).toBeInTheDocument()
    expect(getByText('Leave a comment')).toBeInTheDocument()

    expect(() => getByText('reply')).toThrow()
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
  })
})
