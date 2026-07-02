import '@testing-library/jest-dom/vitest';

import { fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AuthorsContext } from '../providers/AuthorsContext';
import { render } from '../test/utils';
import { CommentDisplay } from './CommentDisplay';
import { UsefulButtonLite, UsefulConfig } from '../UsefulStatsButton/UsefulButtonLite';

vi.mock('../UsefulStatsButton/UsefulButtonLite', () => ({
  UsefulButtonLite: ({ onUsefulClick, votedUsefulCount }: UsefulConfig) => (
    <button data-testid="useful-button" onClick={() => onUsefulClick('add')}>
      Useful {votedUsefulCount}
    </button>
  ),
}));

vi.mock('../CommentAvatar/CommentAvatar', () => ({
  CommentAvatar: ({ displayName }: any) => <div data-testid="comment-avatar">{displayName}</div>,
}));

vi.mock('../CommentBody/CommentBody', () => ({
  CommentBody: ({ body }: any) => <div data-testid="comment-body">{body}</div>,
}));

describe('CommentDisplay', () => {
  const mockOnUsefulClick = vi.fn(async () => Promise.resolve());

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
      photo: null,
    },
    sourceId: 1,
    sourceType: 'questions' as const,
    parentId: null,
    voteCount: 0,
    hasVoted: false,
  };

  const mockUsefulButton = <UsefulButtonLite hasUserVotedUseful={false} votedUsefulCount={5} isLoggedIn={true} onUsefulClick={mockOnUsefulClick} />;

  const mockAuthorsContextValue = {
    authors: [0],
  };
  const renderWithAuthorsContext = (ui: React.ReactElement) => {
    return render(<AuthorsContext.Provider value={mockAuthorsContextValue}>{ui}</AuthorsContext.Provider>);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('renders comment body and avatar', () => {
    const { getByTestId, getAllByTestId } = renderWithAuthorsContext(
      <CommentDisplay
        comment={mockComment}
        itemType="CommentItem"
        isEditable={false}
        menuActions={<></>}
        footerActions={mockUsefulButton}
      />,
    );

    expect(getByTestId('comment-body')).toBeInTheDocument();
    expect(getAllByTestId('comment-avatar').length).toBeGreaterThanOrEqual(1);
    expect(getByTestId('useful-button')).toBeInTheDocument();
  });

  it('calls onUsefulClick when useful button is clicked', () => {
    const { getByTestId } = render(
      <CommentDisplay
        comment={mockComment}
        itemType="CommentItem"
        isEditable={false}
        menuActions={<></>}
        footerActions={mockUsefulButton}
      />,
    );

    fireEvent.click(getByTestId('useful-button'));
    expect(mockOnUsefulClick).toHaveBeenCalledWith('add');
  });

  it('increments useful count when useful button is clicked', () => {
    let count = 5;
    const handleUsefulClick = vi.fn(() => {
      count += 1;
      return Promise.resolve();
    });

      const mockUsefulButton = <UsefulButtonLite hasUserVotedUseful={false} votedUsefulCount={count} isLoggedIn={true} onUsefulClick={handleUsefulClick} />;

    const { getByTestId, rerender } = render(
      <CommentDisplay
        comment={mockComment}
        itemType="CommentItem"
        isEditable={false}
        menuActions={<></>}
        footerActions={mockUsefulButton}
      />,
    );

    const button = getByTestId('useful-button');
    expect(button).toHaveTextContent('Useful 5');

    fireEvent.click(button);
    expect(handleUsefulClick).toHaveBeenCalledWith('add');

    rerender(
      <CommentDisplay
        comment={mockComment}
        itemType="CommentItem"
        isEditable={false}
        menuActions={<></>}
        footerActions={mockUsefulButton}
      />,
    );

    expect(getByTestId('useful-button')).toHaveTextContent('Useful 6');
  });
});
