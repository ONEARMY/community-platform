import '@testing-library/jest-dom/vitest'

import { fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { render } from '../test/utils'
import { createFakeComments, fakeComment } from '../utils'
import { CommentList } from './CommentList'

import type { IComment } from '../CommentItem/types'

const mockHandleEdit = vi.fn()
const mockHandleEditRequest = vi.fn()
const mockHandleDelete = vi.fn()
const mockOnMoreComments = vi.fn()

describe('CommentList', () => {
  it('renders the correct number of comments initially', () => {
    const mockComments: IComment[] = createFakeComments(2)
    const screen = render(
      <CommentList
        isReplies={false}
        comments={mockComments}
        handleEdit={mockHandleEdit}
        handleEditRequest={mockHandleEditRequest}
        handleDelete={mockHandleDelete}
        isLoggedIn={false}
        maxLength={1000}
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
        isReplies={false}
        comments={mockComments}
        handleEdit={mockHandleEdit}
        handleEditRequest={mockHandleEditRequest}
        handleDelete={mockHandleDelete}
        isLoggedIn={false}
        maxLength={1000}
        onMoreComments={mockOnMoreComments}
      />,
    )
    fireEvent.click(screen.getByText('show more comments'))
    expect(screen.getAllByTestId('CommentList: item').length).toBeGreaterThan(
      10,
    )
    expect(mockOnMoreComments).toHaveBeenCalled()
  })

  it('highlights the correct comment when highlightedCommentId is provided', () => {
    const mockComments: IComment[] = createFakeComments(10)
    const highComm = mockComments[1]
    const highlightedCommentId = highComm._id // Replace with an actual ID from mockComments
    highComm.text = 'Highlighted comment text'
    const screen = render(
      <CommentList
        isReplies={false}
        comments={mockComments}
        highlightedCommentId={highlightedCommentId}
        handleEdit={mockHandleEdit}
        handleEditRequest={mockHandleEditRequest}
        handleDelete={mockHandleDelete}
        isLoggedIn={false}
        maxLength={1000}
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
        isReplies={false}
        comments={mockComments}
        handleEdit={mockHandleEdit}
        handleEditRequest={mockHandleEditRequest}
        handleDelete={mockHandleDelete}
        isLoggedIn={false}
        maxLength={720}
        onMoreComments={mockOnMoreComments}
        supportReplies={true}
      />,
    )

    expect(screen.getAllByTestId('CommentList: item')).toHaveLength(3)
  })

  it('does not show reply once max depth is reached', () => {
    const inVisibleReply = fakeComment()
    const visibleReply = fakeComment({ replies: [inVisibleReply] })
    const comment = fakeComment({ replies: [visibleReply] })

    const { getAllByText, getByText } = render(
      <CommentList
        isReplies={false}
        comments={[comment]}
        handleDelete={mockHandleDelete}
        handleEdit={mockHandleEdit}
        handleEditRequest={mockHandleEditRequest}
        onMoreComments={mockOnMoreComments}
        isLoggedIn={false}
        maxLength={800}
        supportReplies={true}
      />,
    )

    fireEvent.click(getByText(`1 reply to ${comment.creatorName}`))

    expect(() =>
      getAllByText(`1 reply to ${visibleReply.creatorName}`),
    ).toThrow()
  })

  it('does not show reply once max depth is reached', () => {
    const inVisibleReply = fakeComment()
    const visibleReply = fakeComment({ replies: [inVisibleReply] })
    const comment = fakeComment({ replies: [visibleReply] })

    const { getAllByText, getByText } = render(
      <CommentList
        isReplies={true}
        comments={[comment]}
        handleDelete={mockHandleDelete}
        handleEdit={mockHandleEdit}
        handleEditRequest={mockHandleEditRequest}
        onMoreComments={mockOnMoreComments}
        isLoggedIn={false}
        maxLength={800}
        supportReplies={true}
      />,
    )

    fireEvent.click(getByText(`1 reply to ${comment.creatorName}`))

    expect(() =>
      getAllByText(`1 reply to ${visibleReply.creatorName}`),
    ).toThrow()
  })
})
