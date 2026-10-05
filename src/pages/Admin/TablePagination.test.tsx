import '@testing-library/jest-dom/vitest';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { createMemoryRouter, MemoryRouter, RouterProvider, useSearchParams } from 'react-router';
import { describe, expect, it } from 'vitest';
import { TablePagination } from './TablePagination';

const renderPagination = (page: number, totalPages: number) =>
  render(
    <MemoryRouter>
      <TablePagination page={page} totalPages={totalPages} />
    </MemoryRouter>,
  );

const pageLinks = () =>
  within(screen.getByRole('navigation', { name: 'pagination' }))
    .getAllByRole('link')
    .map((link) => [link.textContent, link.getAttribute('href')]);

describe('TablePagination', () => {
  it('preserves query parameters through pagination and history navigation', async () => {
    function Page() {
      const [params] = useSearchParams();
      return <TablePagination page={Number(params.get('page') ?? 1)} totalPages={10} />;
    }
    const router = createMemoryRouter([{ path: '/admin/comments', element: <Page /> }], {
      initialEntries: ['/admin/comments?page=5&keep=yes'],
    });
    render(<RouterProvider router={router} />);
    expect(screen.getByRole('link', { name: 'Go to next page' })).toHaveAttribute(
      'href',
      '/admin/comments?page=6&keep=yes',
    );
    fireEvent.click(screen.getByRole('link', { name: 'Go to next page' }));
    expect(screen.getByRole('link', { name: '6' })).toHaveAttribute('aria-current', 'page');
    await act(async () => {
      await router.navigate(-1);
    });
    expect(screen.getByRole('link', { name: '5' })).toHaveAttribute('aria-current', 'page');
    await act(async () => {
      await router.navigate(1);
    });
    expect(screen.getByRole('link', { name: '6' })).toHaveAttribute('aria-current', 'page');
    expect(router.state.location.search).toBe('?page=6&keep=yes');
  });

  it('renders nothing when there is a single page', () => {
    renderPagination(1, 1);

    expect(screen.queryByRole('navigation', { name: 'pagination' })).not.toBeInTheDocument();
  });

  it('links the neighbouring pages, both ends and previous/next from a middle page', () => {
    renderPagination(5, 10);

    expect(pageLinks()).toEqual([
      ['Previous', '/?page=4'],
      ['1', '/?page=1'],
      ['4', '/?page=4'],
      ['5', '/?page=5'],
      ['6', '/?page=6'],
      ['10', '/?page=10'],
      ['Next', '/?page=6'],
    ]);
    const current = screen.getByRole('link', { name: '5' });
    expect(current).toHaveAttribute('aria-current', 'page');
    expect(current).toHaveAttribute('data-active', '');
    expect(current).toHaveAttribute('data-slot', 'pagination-link');
    expect(screen.getByRole('link', { name: '4' })).not.toHaveAttribute('data-active');
    expect(screen.getAllByText('More pages')).toHaveLength(2);
  });

  it('omits previous on the first page', () => {
    renderPagination(1, 3);

    expect(pageLinks()).toEqual([
      ['1', '/?page=1'],
      ['2', '/?page=2'],
      ['3', '/?page=3'],
      ['Next', '/?page=2'],
    ]);
  });

  it('omits next on the last page', () => {
    renderPagination(3, 3);

    expect(pageLinks()).toEqual([
      ['Previous', '/?page=2'],
      ['1', '/?page=1'],
      ['2', '/?page=2'],
      ['3', '/?page=3'],
    ]);
  });

  it('skips the ellipsis when the window touches an end', () => {
    renderPagination(3, 5);

    expect(pageLinks().map(([label]) => label)).toEqual([
      'Previous',
      '1',
      '2',
      '3',
      '4',
      '5',
      'Next',
    ]);
    expect(screen.queryByText('More pages')).not.toBeInTheDocument();
  });
});
