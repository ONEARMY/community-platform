import { act, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'

import { render } from '../tests/utils'
import { fakeComment } from '../utils'
import { CommentContainer } from './CommentContainer'

const mockHandleEdit = vi.fn()
const mockHandleEditRequest = vi.fn()
const mockHandleDelete = vi.fn()

describe('CommentContainer', () => {
  it('renders the correct number of comments initially', async () => {
    const mockReply = fakeComment()
    const mockComment = fakeComment({ replies: [mockReply] })
    const screen = render(
      <CommentContainer
        supportReplies={true}
        maxLength={100}
        isLoggedIn={true}
        comment={mockComment}
        handleEdit={mockHandleEdit}
        handleEditRequest={mockHandleEditRequest}
        handleDelete={mockHandleDelete}
      />,
    )

    await act(async () => {
      fireEvent.click(screen.getByText('reply', { exact: false }))
    })

    expect(screen.getByText(mockReply.text)).toBeVisible()
  })
})
