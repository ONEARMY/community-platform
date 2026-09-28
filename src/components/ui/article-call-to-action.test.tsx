import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/react';
import type { Author } from 'oa-shared';
import type { ReactNode } from 'react';
import { createRoutesStub } from 'react-router';
import { describe, expect, it } from 'vitest';
import { ArticleCallToAction } from './article-call-to-action';

const makeAuthor = (username: string): Author =>
  ({
    id: 1,
    username,
    displayName: username,
    country: 'GB',
    badges: [],
    photo: null,
  }) as unknown as Author;

// Username renders a react-router <Link>, so the tree needs a router in context.
const renderInRouter = (ui: ReactNode) => {
  const Stub = createRoutesStub([{ path: '/', Component: () => <>{ui}</> }]);
  return render(<Stub />);
};

describe('ArticleCallToAction', () => {
  it('attributes the article to its author', () => {
    const { getByText, getAllByText } = renderInRouter(
      <ArticleCallToAction author={makeAuthor('jane')}>
        <button type="button">Leave a comment</button>
      </ArticleCallToAction>,
    );

    expect(getByText('Made by')).toBeInTheDocument();
    expect(getAllByText('jane').length).toBeGreaterThan(0);
  });

  it('renders the call-to-action heading', () => {
    const { getByRole } = renderInRouter(
      <ArticleCallToAction author={makeAuthor('jane')}>
        <button type="button">Leave a comment</button>
      </ArticleCallToAction>,
    );

    expect(getByRole('heading')).toHaveTextContent('Like what you see?');
  });

  it('renders the engagement controls passed as children', () => {
    const { getByRole } = renderInRouter(
      <ArticleCallToAction author={makeAuthor('jane')}>
        <button type="button">Leave a comment</button>
      </ArticleCallToAction>,
    );

    expect(getByRole('button', { name: 'Leave a comment' })).toBeInTheDocument();
  });

  it('lists contributors when there are any', () => {
    const { getByText, getAllByText } = renderInRouter(
      <ArticleCallToAction
        author={makeAuthor('jane')}
        contributors={[makeAuthor('ravi'), makeAuthor('mo')]}
      >
        <button type="button">Leave a comment</button>
      </ArticleCallToAction>,
    );

    expect(getByText(/With contributions from:/)).toBeInTheDocument();
    expect(getAllByText('ravi').length).toBeGreaterThan(0);
    expect(getAllByText('mo').length).toBeGreaterThan(0);
  });

  it('omits the contributors line when the list is empty', () => {
    const { queryByText } = renderInRouter(
      <ArticleCallToAction author={makeAuthor('jane')} contributors={[]}>
        <button type="button">Leave a comment</button>
      </ArticleCallToAction>,
    );

    expect(queryByText(/With contributions from:/)).not.toBeInTheDocument();
  });

  it('omits the contributors line when none are given', () => {
    const { queryByText } = renderInRouter(
      <ArticleCallToAction author={makeAuthor('jane')}>
        <button type="button">Leave a comment</button>
      </ArticleCallToAction>,
    );

    expect(queryByText(/With contributions from:/)).not.toBeInTheDocument();
  });
});
