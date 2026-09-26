import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LinkifyText } from './linkify-text';

describe('LinkifyText', () => {
  it('turns URLs into safe external links', () => {
    const { getByRole } = render(<LinkifyText>Visit https://example.com today.</LinkifyText>);

    expect(getByRole('link', { name: 'https://example.com' })).toHaveAttribute(
      'href',
      'https://example.com',
    );
    expect(getByRole('link')).toHaveAttribute('target', '_blank');
    expect(getByRole('link')).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('leaves text without URLs unchanged', () => {
    const { container, queryByRole } = render(<LinkifyText>Nothing to link here.</LinkifyText>);

    expect(queryByRole('link')).not.toBeInTheDocument();
    expect(container).toHaveTextContent('Nothing to link here.');
  });
});
