import '@testing-library/jest-dom/vitest';

import { fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { render } from '../test/utils';
import { Pagination } from './Pagination';

describe('Pagination Component', () => {
  const mockOnPageChange = vi.fn();

  beforeEach(() => {
    mockOnPageChange.mockClear();
  });

  it('renders correctly on the first page', () => {
    const screen = render(<Pagination page={1} totalPages={10} onPageChange={mockOnPageChange} />);

    expect(screen.getByLabelText('Enter page number')).toHaveValue(1);
    expect(screen.getByText('of 10')).toBeInTheDocument();

    expect(screen.queryByLabelText('Go to first page')).toBeNull();
    expect(screen.queryByLabelText('Go to previous page')).toBeNull();
    expect(screen.getByLabelText('Go to next page')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to last page')).toBeInTheDocument();
  });

  it('renders correctly on a middle page', () => {
    const screen = render(<Pagination page={5} totalPages={10} onPageChange={mockOnPageChange} />);

    expect(screen.getByLabelText('Enter page number')).toHaveValue(5);
    expect(screen.getByLabelText('Go to first page')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to previous page')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to next page')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to last page')).toBeInTheDocument();
  });

  it('renders correctly on the last page', () => {
    const screen = render(<Pagination page={10} totalPages={10} onPageChange={mockOnPageChange} />);

    expect(screen.getByLabelText('Enter page number')).toHaveValue(10);
    expect(screen.getByLabelText('Go to first page')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to previous page')).toBeInTheDocument();
    expect(screen.queryByLabelText('Go to next page')).toBeNull();
    expect(screen.queryByLabelText('Go to last page')).toBeNull();
  });

  it('calls onPageChange with the correct page number when next is clicked', () => {
    const screen = render(<Pagination page={4} totalPages={10} onPageChange={mockOnPageChange} />);
    const nextButton = screen.getByLabelText('Go to next page');
    fireEvent.click(nextButton);
    expect(mockOnPageChange).toHaveBeenCalledWith(5);
  });

  it('calls onPageChange with the correct page number when previous is clicked', () => {
    const screen = render(<Pagination page={4} totalPages={10} onPageChange={mockOnPageChange} />);
    const prevButton = screen.getByLabelText('Go to previous page');
    fireEvent.click(prevButton);
    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  it('calls onPageChange with the correct page number when first is clicked', () => {
    const screen = render(<Pagination page={4} totalPages={10} onPageChange={mockOnPageChange} />);
    const firstButton = screen.getByLabelText('Go to first page');
    fireEvent.click(firstButton);
    expect(mockOnPageChange).toHaveBeenCalledWith(1);
  });

  it('calls onPageChange with the correct page number when last is clicked', () => {
    const screen = render(<Pagination page={4} totalPages={10} onPageChange={mockOnPageChange} />);
    const lastButton = screen.getByLabelText('Go to last page');
    fireEvent.click(lastButton);
    expect(mockOnPageChange).toHaveBeenCalledWith(10);
  });

  it('calls onPageChange with the correct page number when input is changed', async () => {
    vi.useFakeTimers();
    const screen = render(<Pagination page={4} totalPages={10} onPageChange={mockOnPageChange} />);
    const input = screen.getByLabelText('Enter page number');

    fireEvent.change(input, { target: { value: '7' } });

    vi.advanceTimersByTime(500);

    expect(mockOnPageChange).toHaveBeenCalledWith(7);
    vi.useRealTimers();
  });

  it('does not call onPageChange for invalid input', async () => {
    vi.useFakeTimers();
    const screen = render(<Pagination page={4} totalPages={10} onPageChange={mockOnPageChange} />);
    const input = screen.getByLabelText('Enter page number');

    fireEvent.change(input, { target: { value: '11' } });
    vi.advanceTimersByTime(500);
    expect(mockOnPageChange).not.toHaveBeenCalledWith(11);

    fireEvent.change(input, { target: { value: '0' } });
    vi.advanceTimersByTime(500);
    expect(mockOnPageChange).not.toHaveBeenCalledWith(0);
    vi.useRealTimers();
  });
});
