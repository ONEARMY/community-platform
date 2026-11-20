import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Category } from 'oa-shared';
import { FactoryCategory } from 'src/test/factories/Category';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CategoryHorizontalList } from './CategoryHorizontalList';

const categories: Category[] = [
  { ...FactoryCategory, id: 1, name: 'Guides', createdAt: new Date('2024-12-03T18:03:51Z') },
  { ...FactoryCategory, id: 2, name: 'Machines', createdAt: new Date('2022-12-01T18:03:51Z') },
  {
    ...FactoryCategory,
    id: 3,
    name: 'Moulds',
    createdAt: new Date('2022-12-03T18:03:51Z'),
    imageUrl: 'https://example.com/moulds.svg',
  },
];

beforeEach(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      disconnect() {}
    },
  );
});

describe('CategoryHorizontalList', () => {
  it('renders a labelled group of toggle buttons ordered oldest first', () => {
    render(
      <CategoryHorizontalList
        activeCategory={null}
        allCategories={categories}
        setActiveCategory={vi.fn()}
      />,
    );

    const group = screen.getByRole('group', { name: 'Filter by category' });
    expect(group).toBeInTheDocument();
    expect(screen.getAllByRole('button').map((button) => button.textContent)).toEqual([
      'Machines',
      'Moulds',
      'Guides',
    ]);
  });

  it('renders nothing without categories', () => {
    const { container } = render(
      <CategoryHorizontalList activeCategory={null} allCategories={[]} setActiveCategory={vi.fn()} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('marks only the active category as pressed', () => {
    render(
      <CategoryHorizontalList
        activeCategory={categories[1]}
        allCategories={categories}
        setActiveCategory={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: 'Machines' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: 'Moulds' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('selects a category and clears it when pressed again', async () => {
    const setActiveCategory = vi.fn();
    const { rerender } = render(
      <CategoryHorizontalList
        activeCategory={null}
        allCategories={categories}
        setActiveCategory={setActiveCategory}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Moulds' }));
    expect(setActiveCategory).toHaveBeenLastCalledWith(categories[2]);

    rerender(
      <CategoryHorizontalList
        activeCategory={categories[2]}
        allCategories={categories}
        setActiveCategory={setActiveCategory}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Moulds' }));
    expect(setActiveCategory).toHaveBeenLastCalledWith(null);
  });

  it('is reachable with Tab and navigable with the arrow keys', async () => {
    const setActiveCategory = vi.fn();
    render(
      <CategoryHorizontalList
        activeCategory={null}
        allCategories={categories}
        setActiveCategory={setActiveCategory}
      />,
    );

    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'Machines' })).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('button', { name: 'Moulds' })).toHaveFocus();
    expect(setActiveCategory).not.toHaveBeenCalled();

    await userEvent.keyboard('{Enter}');
    expect(setActiveCategory).toHaveBeenLastCalledWith(categories[2]);
  });

  it('treats category images as decorative because the name is shown', () => {
    render(
      <CategoryHorizontalList
        activeCategory={null}
        allCategories={categories}
        setActiveCategory={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: 'Moulds' }).querySelector('img')).toHaveAttribute(
      'alt',
      '',
    );
  });
});
