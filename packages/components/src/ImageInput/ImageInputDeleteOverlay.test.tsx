import '@testing-library/jest-dom/vitest';

import { fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { render } from '../test/utils';
import { ImageInputDeleteOverlay } from './ImageInputDeleteOverlay';

describe('ImageInputDeleteOverlay', () => {
  it('renders the delete glyph', () => {
    const { getByRole } = render(<ImageInputDeleteOverlay onClick={vi.fn()} />);

    expect(getByRole('img', { hidden: true }).getAttribute('src')).toContain('delete.svg');
  });

  it('calls onClick when the delete button is pressed', () => {
    const onClick = vi.fn();
    const { getByTestId } = render(<ImageInputDeleteOverlay onClick={onClick} />);

    fireEvent.click(getByTestId('delete-image'));

    expect(onClick).toHaveBeenCalled();
  });
});
