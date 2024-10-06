import '@testing-library/jest-dom/vitest'

import { act } from 'react'
import { fireEvent, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { render } from '../test/utils'
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
    act(() => {
      const replyButton = screen.getByText('Show 2 replies', { exact: false })
      expect(replyButton).toBeInTheDocument()
      fireEvent.click(replyButton)
    })
    await waitFor(() => {
      expect(screen.getAllByText('Leave a reply')).toHaveLength(1)
    })

    // Hide reply form
    act(() => {
      const replyButton = screen.getAllByText('Hide 2 replies')[0]
      fireEvent.click(replyButton)
    })
    await waitFor(() => {
      expect(() => {
        screen.getAllByText('Leave a reply')
      }).toThrow()
    })

    const SecondReplyButton = screen.getAllByText('Reply')[0]
    expect(SecondReplyButton).toBeInTheDocument()

    // Show reply form
    act(() => {
      fireEvent.click(SecondReplyButton)
    })
    await waitFor(() => {
      expect(screen.getAllByText('Leave a reply')).toHaveLength(1)
    })

    // Hide reply form
    act(() => {
      fireEvent.click(SecondReplyButton)
    })

    await waitFor(() => {
      expect(() => {
        screen.getAllByText('Send your reply')
      }).toThrow()
    })
  })
})
