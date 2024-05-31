import '@testing-library/jest-dom'

import { fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { render } from '../tests/utils'
import { CreateComment } from './CreateComment'
import { WithCustomPlaceholder } from './CreateComment.stories'

describe('CreateComment Component', () => {
  const mockOnSubmit = vi.fn()
  const mockOnChange = vi.fn()

  it('renders correctly when logged in', () => {
    const screen = render(
      <CreateComment
        maxLength={100}
        isLoggedIn={true}
        comment=""
        onSubmit={mockOnSubmit}
        onChange={mockOnChange}
      />,
    )
    expect(
      screen.getByPlaceholderText('Leave your questions or feedback...'),
    ).toBeInTheDocument()
    expect(screen.queryByText('Login to leave a comment')).toBeNull()
  })

  it('renders login prompt when not logged in', () => {
    const screen = render(
      <CreateComment
        maxLength={100}
        isLoggedIn={false}
        comment=""
        onSubmit={mockOnSubmit}
        onChange={mockOnChange}
      />,
    )
    expect(screen.getByText('Login')).toBeInTheDocument()
    expect(
      screen.queryByPlaceholderText('Leave your questions or feedback...'),
    ).toBeNull()
  })

  it('enables submit button when comment is entered and user is logged in', () => {
    const screen = render(
      <CreateComment
        maxLength={100}
        isLoggedIn={true}
        comment="Test comment"
        onSubmit={mockOnSubmit}
        onChange={mockOnChange}
      />,
    )
    expect(screen.getByText('Leave a comment')).not.toBeDisabled()
  })

  it('disables submit button when no comment is entered', () => {
    const screen = render(
      <CreateComment
        maxLength={100}
        isLoggedIn={true}
        comment=""
        onSubmit={mockOnSubmit}
        onChange={mockOnChange}
      />,
    )
    expect(screen.getByText('Leave a comment')).toBeDisabled()
  })

  it('handles user input in textarea', () => {
    const screen = render(
      <CreateComment
        maxLength={100}
        isLoggedIn={true}
        comment=""
        onSubmit={mockOnSubmit}
        onChange={mockOnChange}
      />,
    )
    const textarea = screen.getByPlaceholderText(
      'Leave your questions or feedback...',
    )
    fireEvent.change(textarea, { target: { value: 'New comment' } })
    expect(mockOnChange).toHaveBeenCalledWith('New comment')
  })

  it('calls onSubmit when the submit button is clicked', () => {
    const screen = render(
      <CreateComment
        maxLength={100}
        isLoggedIn={true}
        comment="Test comment"
        onSubmit={mockOnSubmit}
        onChange={mockOnChange}
      />,
    )
    const button = screen.getByText('Leave a comment')
    fireEvent.click(button)
    expect(mockOnSubmit).toHaveBeenCalledWith('Test comment')
  })

  it('renders with custom placeholder', () => {
    const screen = render(
      <WithCustomPlaceholder
        comment={''}
        placeholder="Custom placeholder"
        onChange={vi.fn()}
        onSubmit={() => null}
        userProfileType="member"
        maxLength={12300}
        isLoggedIn={true}
      />,
    )

    expect(
      screen.getByPlaceholderText('Custom placeholder'),
    ).toBeInTheDocument()
  })
})
