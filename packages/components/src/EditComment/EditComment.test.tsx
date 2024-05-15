import { fireEvent } from '@testing-library/react'
import { vi } from 'vitest'

import { render } from '../tests/utils'
import { EditComment, type IProps } from './EditComment'
import { Default, EditReply } from './EditComment.stories'

describe('EditComment', () => {
  const mockOnSubmit = vi.fn()
  const mockOnCancel = vi.fn()

  it('showed correct title when a comment', () => {
    const { getByText } = render(<Default {...(Default.args as IProps)} />)

    expect(getByText('Edit Comment')).toBeInTheDocument()
    expect(() => getByText('Edit Reply')).toThrow()
  })
  it('showed correct title when a reply', () => {
    const { getByText } = render(<EditReply {...(EditReply.args as IProps)} />)

    expect(getByText('Edit Reply')).toBeInTheDocument()
    expect(() => getByText('Edit Comment')).toThrow()
  })
  it('enables save button when comment is not empty', () => {
    const screen = render(
      <EditComment
        isReply={false}
        comment="Test comment"
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
        handleCancel={mockOnCancel}
        handleSubmit={mockOnSubmit}
      />,
    )
    expect(screen.getByText('Save')).toBeDisabled()
  })
  it('should dispaly error message when the comment is empty', () => {
    const screen = render(
      <EditComment
        isReply={false}
        comment=""
        handleCancel={mockOnCancel}
        handleSubmit={mockOnSubmit}
      />,
    )
    const inputComment = screen.getByLabelText('Edit Comment')
    inputComment.blur()
    expect(screen.getByText('Comment cannot be blank')).toBeInTheDocument()
  })
})
