import { fireEvent } from '@testing-library/react'
import { vi } from 'vitest'

import { render } from '../tests/utils'
import { createFakeComments, fakeComment } from '../utils'
import { CommentList } from './CommentList'

import type { IComment } from '..'

const mockHandleEdit = vi.fn()
const mockHandleEditRequest = vi.fn()
const mockHandleDelete = vi.fn()
const mockOnMoreComments = vi.fn()

describe('CommentList', () => {
  it('renders the correct number of comments initially', () => {
    const mockComments: IComment[] = createFakeComments(2)
    const screen = render(
      <CommentList
        comments={mockComments}
        handleEdit={mockHandleEdit}
        handleEditRequest={mockHandleEditRequest}
        handleDelete={mockHandleDelete}
        onMoreComments={mockOnMoreComments}
      />,
    )
    expect(screen.getAllByTestId('CommentList: item')).toHaveLength(
      mockComments.length,
    )
  })

  it('loads more comments when show more button is clicked', () => {
    const mockComments: IComment[] = createFakeComments(20)
    const screen = render(
      <CommentList
        comments={mockComments}
        handleEdit={mockHandleEdit}
        handleEditRequest={mockHandleEditRequest}
        handleDelete={mockHandleDelete}
        onMoreComments={mockOnMoreComments}
      />,
    )
    fireEvent.click(screen.getByText('show more comments'))
    expect(screen.getAllByTestId('CommentList: item').length).toBeGreaterThan(5)
    expect(mockOnMoreComments).toHaveBeenCalled()
  })

  it('highlights the correct comment when highlightedCommentId is provided', () => {
    const mockComments: IComment[] = createFakeComments(10)
    const highComm = mockComments[1]
    const highlightedCommentId = highComm._id // Replace with an actual ID from mockComments
    highComm.text = 'Highlighted comment text'
    const screen = render(
      <CommentList
        comments={mockComments}
        highlightedCommentId={highlightedCommentId}
        handleEdit={mockHandleEdit}
        handleEditRequest={mockHandleEditRequest}
        handleDelete={mockHandleDelete}
        onMoreComments={mockOnMoreComments}
      />,
    )
    expect(screen.getAllByTestId('CommentList: item')[1]).toHaveStyle(
      'border: 2px dashed black',
    )
  })

  it('renders nested comments correctly', () => {
    const mockComments = [
      fakeComment({
        replies: [fakeComment(), fakeComment()],
      }),
      fakeComment(),
      fakeComment(),
    ]

    const screen = render(
      <CommentList
        comments={mockComments}
        handleEdit={mockHandleEdit}
        handleEditRequest={mockHandleEditRequest}
        handleDelete={mockHandleDelete}
        onMoreComments={mockOnMoreComments}
      />,
    )

    expect(screen.getAllByTestId('CommentList: item')).toHaveLength(5)
  })

  it('does not show reply once max depth is reached', () => {
    const mockComments = [
      fakeComment({
        replies: [
          fakeComment({
            replies: [fakeComment()],
          }),
        ],
      }),
    ]

    const screen = render(
      <CommentList
        currentDepth={0}
        maxDepth={2}
        supportReplies={true}
        comments={mockComments}
        replyForm={() => <></>}
        setCommentBeingRepliedTo={() => {}}
        handleEdit={mockHandleEdit}
        handleEditRequest={mockHandleEditRequest}
        handleDelete={mockHandleDelete}
        onMoreComments={mockOnMoreComments}
      />,
    )

    expect(screen.getAllByText('reply')).toHaveLength(2)
  })
})
