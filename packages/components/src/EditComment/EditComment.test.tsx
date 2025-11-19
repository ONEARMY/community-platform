import '@testing-library/jest-dom/vitest'

import { act, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { render } from '../test/utils'
import { EditComment } from './EditComment'

import type { IProps } from './EditComment'

describe('EditComment', () => {
  const mockOnSubmit = vi.fn().mockImplementation(() => new Response())
  const mockOnCancel = vi.fn()

  const defaultProps: IProps = {
    isReply: false,
    comment: 'A short comment',
    setShowEditModal: () => null,
    handleCancel: mockOnCancel,
    handleSubmit: () => Promise.resolve(new Response('')),
  }

  it('showed correct title when a comment', () => {
    const { getByText } = render(<EditComment {...defaultProps} />)

    expect(getByText('Edit Comment')).toBeInTheDocument()
    expect(() => getByText('Edit Reply')).toThrow()
  })

  it('showed correct title when a reply', () => {
    const { getByText } = render(
      <EditComment {...defaultProps} isReply={true} />,
    )

    expect(getByText('Edit Reply')).toBeInTheDocument()
    expect(() => getByText('Edit Comment')).toThrow()
  })

  it('enables save button when comment is not empty', () => {
    const screen = render(
      <EditComment
        isReply={false}
        comment="Test comment"
        setShowEditModal={() => null}
        handleCancel={mockOnCancel}
        handleSubmit={mockOnSubmit}
      />,
    )
    expect(screen.getByText('Save')).not.toBeDisabled()
  })

  it('calls onSubmit when the submit button is clicked', () => {
    const screen = render(
      <EditComment
        isReply={false}
        comment="Test comment"
        setShowEditModal={() => null}
        handleCancel={mockOnCancel}
        handleSubmit={mockOnSubmit}
      />,
    )
    const button = screen.getByText('Save')
    fireEvent.click(button)
    expect(mockOnSubmit).toHaveBeenCalledWith('Test comment')
  })

  it('disables save button when comment is empty', () => {
    const screen = render(
      <EditComment
        isReply={false}
        comment=""
        setShowEditModal={() => null}
        handleCancel={mockOnCancel}
        handleSubmit={mockOnSubmit}
      />,
    )
    expect(screen.getByTestId('edit-comment-submit')).toBeDisabled()
  })

  it('should dispaly error message when the comment is empty', () => {
    const screen = render(
      <EditComment
        isReply={false}
        comment=""
        setShowEditModal={() => null}
        handleCancel={mockOnCancel}
        handleSubmit={mockOnSubmit}
      />,
    )

    act(() => {
      const commentInput = screen.getByLabelText('Edit Comment')
      fireEvent.change(commentInput, { target: { value: '' } })
      fireEvent.blur(commentInput)
    })

    expect(screen.container.innerHTML).toMatch('Comment cannot be blank')
  })
})
