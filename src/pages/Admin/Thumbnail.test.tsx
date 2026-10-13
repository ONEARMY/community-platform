import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Thumbnail } from './Thumbnail';

describe('Thumbnail', () => {
  it('renders the image lazily with the merged class', () => {
    render(<Thumbnail imageUrl="https://example.com/a.webp" alt="A thing" className="object-cover" />);

    const img = screen.getByRole('img', { name: 'A thing' });
    expect(img).toHaveAttribute('src', 'https://example.com/a.webp');
    expect(img).toHaveAttribute('loading', 'lazy');
    expect(img).toHaveClass('size-10', 'max-w-none', 'object-cover');
    expect(img).not.toHaveClass('object-contain');
  });

  it('renders the placeholder when there is no image url', () => {
    render(<Thumbnail imageUrl={null} alt="A thing" />);

    expect(screen.getByRole('img', { name: 'No image' })).toBeInTheDocument();
  });

  it('falls back to the placeholder when the image fails to load', () => {
    render(<Thumbnail imageUrl="https://example.com/missing.webp" alt="A thing" />);

    fireEvent.error(screen.getByRole('img', { name: 'A thing' }));

    expect(screen.getByRole('img', { name: 'No image' })).toBeInTheDocument();
    expect(screen.queryByRole('img', { name: 'A thing' })).not.toBeInTheDocument();
  });
});
