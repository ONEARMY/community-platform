import '@testing-library/jest-dom/vitest'

import { fireEvent } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { AuthorsContext } from '../providers/AuthorsContext'
import { render } from '../test/utils'
import { CommentDisplay } from './CommentDisplay'

vi.mock('../UsefulStatsButton/UsefulButtonLite', () => ({
  UsefulButtonLite: ({ usefulButtonLiteConfig }: any) => (
    <button
      data-testid="useful-button"
      onClick={() => usefulButtonLiteConfig.onUsefulClick('add')}
    >
      Useful {usefulButtonLiteConfig.votedUsefulCount}
    </button>
  ),
}))

vi.mock('../CommentAvatar/CommentAvatar', () => ({
  CommentAvatar: ({ displayName }: any) => (
    <div data-testid="comment-avatar">{displayName}</div>
  ),
}))

vi.mock('../CommentBody/CommentBody', () => ({
  CommentBody: ({ body }: any) => <div data-testid="comment-body">{body}</div>,
}))

describe('CommentDisplay', () => {
  const mockSetShowDeleteModal = vi.fn()
  const mockSetShowEditModal = vi.fn()
  const mockOnUsefulClick = vi.fn(async () => Promise.resolve())

  const mockComment = {
    id: 1,
    comment: 'Test comment',
    createdAt: new Date('2023-01-01T00:00:00Z'),
    modifiedAt: new Date('2023-01-01T00:00:00Z'),
    deleted: false,
    highlighted: false,
    createdBy: {
      username: 'testuser',
      displayName: 'Test User',
      id: 0,
      isVerified: false,
      isSupporter: false,
      photoUrl: null,
    },
    sourceId: 1,
    sourceType: 'questions' as const,
    parentId: null,
    voteCount: 0,
    hasVoted: false,
  }

  const mockUsefulButtonConfig = {
    hasUserVotedUseful: false,
    votedUsefulCount: 5,
    isLoggedIn: true,
    onUsefulClick: mockOnUsefulClick,
  }

  const mockAuthorsContextValue = {
    authors: [0],
  }
  const renderWithAuthorsContext = (ui: React.ReactElement) => {
    return render(
      <AuthorsContext.Provider value={mockAuthorsContextValue}>
        {ui}
      </AuthorsContext.Provider>,
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })
  it('renders comment body and avatar', () => {
    const { getByTestId } = renderWithAuthorsContext(
      <CommentDisplay
        comment={mockComment}
        itemType="CommentItem"
        isEditable={false}
        setShowDeleteModal={mockSetShowDeleteModal}
        setShowEditModal={mockSetShowEditModal}
        usefulButtonConfig={mockUsefulButtonConfig}
      />,
    )

    expect(getByTestId('comment-body')).toBeInTheDocument()
    expect(getByTestId('comment-avatar')).toBeInTheDocument()
    expect(getByTestId('useful-button')).toBeInTheDocument()
  })

  it('calls onUsefulClick when useful button is clicked', () => {
    const { getByTestId } = render(
      <CommentDisplay
        comment={mockComment}
        itemType="CommentItem"
        isEditable={false}
        setShowDeleteModal={mockSetShowDeleteModal}
        setShowEditModal={mockSetShowEditModal}
        usefulButtonConfig={mockUsefulButtonConfig}
      />,
    )

    fireEvent.click(getByTestId('useful-button'))
    expect(mockOnUsefulClick).toHaveBeenCalledWith('add')
  })

  it('increments useful count when useful button is clicked', () => {
    let count = 5
    const handleUsefulClick = vi.fn(() => {
      count += 1
      return Promise.resolve()
    })

    const { getByTestId, rerender } = render(
      <CommentDisplay
        comment={mockComment}
        itemType="CommentItem"
        isEditable={false}
        setShowDeleteModal={mockSetShowDeleteModal}
        setShowEditModal={mockSetShowEditModal}
        usefulButtonConfig={{
          ...mockUsefulButtonConfig,
          votedUsefulCount: count,
          onUsefulClick: handleUsefulClick,
        }}
      />,
    )

    const button = getByTestId('useful-button')
    expect(button).toHaveTextContent('Useful 5')

    fireEvent.click(button)
    expect(handleUsefulClick).toHaveBeenCalledWith('add')

    rerender(
      <CommentDisplay
        comment={mockComment}
        itemType="CommentItem"
        isEditable={false}
        setShowDeleteModal={mockSetShowDeleteModal}
        setShowEditModal={mockSetShowEditModal}
        usefulButtonConfig={{
          ...mockUsefulButtonConfig,
          votedUsefulCount: count,
          onUsefulClick: handleUsefulClick,
        }}
      />,
    )

    expect(getByTestId('useful-button')).toHaveTextContent('Useful 6')
  })
})
