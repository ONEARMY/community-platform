import '@testing-library/jest-dom/vitest';
import { render, within } from '@testing-library/react';
import type { ReactNode } from 'react';
import { createRoutesStub } from 'react-router';
import { describe, expect, it } from 'vitest';
import { Breadcrumbs } from './Breadcrumbs';

const renderInRouter = (ui: ReactNode) => {
  const Stub = createRoutesStub([{ path: '/', Component: () => <>{ui}</> }]);
  return render(<Stub />);
};

describe('Breadcrumbs', () => {
  it('renders every step with a chevron between them', () => {
    const { getByText, getAllByTestId } = renderInRouter(
      <Breadcrumbs
        steps={[
          { text: 'Question', link: '/questions' },
          { text: 'Category', link: '/questions?category=Category' },
          { text: 'Are we real?' },
        ]}
      />,
    );

    expect(getByText('Question')).toBeInTheDocument();
    expect(getByText('Category')).toBeInTheDocument();
    expect(getByText('Are we real?')).toBeInTheDocument();
    expect(getAllByTestId('breadcrumbsItem')).toHaveLength(3);
    expect(getAllByTestId('breadcrumbsChevron')).toHaveLength(2);
  });

  it('links earlier steps and marks the last step as the current page', () => {
    const { getAllByTestId } = renderInRouter(
      <Breadcrumbs steps={[{ text: 'Question', link: '/questions' }, { text: 'Are we real?' }]} />,
    );

    const [first, last] = getAllByTestId('breadcrumbsItem');
    expect(within(first).getByRole('link')).toHaveAttribute('href', '/questions');
    expect(within(last).getByText('Are we real?')).toHaveAttribute('aria-current', 'page');
    expect(getAllByTestId('breadcrumbsChevron')).toHaveLength(1);
  });

  it('renders inside a labelled navigation landmark', () => {
    const { getByRole } = renderInRouter(
      <Breadcrumbs steps={[{ text: 'News', link: '/news' }, { text: 'First news article!' }]} />,
    );

    expect(getByRole('navigation', { name: 'breadcrumb' })).toBeInTheDocument();
  });
});
