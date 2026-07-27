import '@testing-library/jest-dom/vitest';

import { describe, expect, it, vi } from 'vitest';

import { render } from '../test/utils';
import { Modal } from './Modal';

const DEFAULT_MAX_WIDTH = '90vw';
const DEFAULT_MAX_HEIGHT = '95vh';

const styleSheetText = () =>
  Array.from(document.querySelectorAll('style'))
    .map((style) => style.textContent ?? '')
    .join('');

const breakpointStyleFor = (dialog: HTMLElement) => {
  const match = styleSheetText().match(new RegExp(`@media[^{]*\\{\\.${dialog.className}\\{([^}]*)\\}`));

  return match ? match[1] : null;
};

describe('Modal', () => {
  it('renders at the default max width and max height when neither is provided', () => {
    const { getByRole } = render(
      <Modal isOpen={true} onDismiss={vi.fn()}>
        <div>Content</div>
      </Modal>,
    );

    const dialog = getByRole('dialog');

    expect(dialog).toHaveStyle(`max-width: ${DEFAULT_MAX_WIDTH}`);
    expect(dialog).toHaveStyle(`max-height: ${DEFAULT_MAX_HEIGHT}`);
  });

  it('renders at the given max width and max height when provided', () => {
    const { getByRole } = render(
      <Modal isOpen={true} onDismiss={vi.fn()} maxWidth="600px" maxHeight="70vh">
        <div>Content</div>
      </Modal>,
    );

    const dialog = getByRole('dialog');

    expect(dialog).toHaveStyle('max-width: 600px');
    expect(dialog).toHaveStyle('max-height: 70vh');
  });

  it('renders a responsive max height when given an array of values', () => {
    const { getByRole } = render(
      <Modal isOpen={true} onDismiss={vi.fn()} maxHeight={['50vh', '70vh']}>
        <div>Content</div>
      </Modal>,
    );

    const dialog = getByRole('dialog');

    expect(dialog).toHaveStyle('max-height: 50vh');
    expect(breakpointStyleFor(dialog)).toContain('max-height:70vh');
  });
});
