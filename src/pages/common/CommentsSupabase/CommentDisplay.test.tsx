import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@theme-ui/core';
import type { Comment } from 'oa-shared';
import { theme } from 'oa-themes';
import { MemoryRouter } from 'react-router';
import { FactoryComment } from 'src/test/factories/Comment';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AuthorsContext } from './AuthorsContext';
import { CommentDisplay } from './CommentDisplay';

const renderComment = (comment: Comment, authors: number[] = []) =>
  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        <AuthorsContext.Provider value={{ authors }}>
          <CommentDisplay
            comment={comment}
            menuActions={<button type="button">Menu</button>}
            footerActions={<button type="button">Useful</button>}
          />
        </AuthorsContext.Provider>
      </MemoryRouter>
    </ThemeProvider>,
  );

describe('CommentDisplay', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the comment with its actions', () => {
    renderComment(FactoryComment({ comment: 'Hello there', deleted: false }));

    expect(screen.getByTestId('commentText')).toHaveTextContent('Hello there');
    expect(screen.getByText('Menu')).toBeInTheDocument();
    expect(screen.getByText('Useful')).toBeInTheDocument();
  });

  it('renders a placeholder for a deleted comment', () => {
    renderComment(FactoryComment({ comment: 'Hidden', deleted: true }));

    expect(screen.getByText('[The original comment got deleted]')).toBeInTheDocument();
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
    expect(screen.queryByText('Menu')).not.toBeInTheDocument();
  });

  it('marks the content author', () => {
    const comment = FactoryComment({ deleted: false });
    renderComment(comment, [comment.createdBy!.id]);

    expect(screen.getAllByTestId('author-balloon').length).toBeGreaterThan(0);
  });

  it('does not mark other commenters', () => {
    renderComment(FactoryComment({ deleted: false }));

    expect(screen.queryByTestId('author-balloon')).not.toBeInTheDocument();
  });

  it('links urls in the body', () => {
    renderComment(FactoryComment({ comment: 'See https://example.com', deleted: false }));

    expect(screen.getByRole('link', { name: 'https://example.com' })).toHaveAttribute(
      'href',
      'https://example.com',
    );
  });

  it('toggles long comments', async () => {
    vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(300);
    vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(100);
    renderComment(FactoryComment({ deleted: false }));

    await userEvent.click(screen.getByRole('button', { name: 'Show more' }));

    expect(screen.getByRole('button', { name: 'Show less' })).toBeInTheDocument();
  });

  it('hides the toggle for short comments', () => {
    renderComment(FactoryComment({ deleted: false }));

    expect(screen.queryByRole('button', { name: 'Show more' })).not.toBeInTheDocument();
  });
});
