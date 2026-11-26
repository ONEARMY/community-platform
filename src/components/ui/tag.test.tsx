import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Tag } from '@/components/ui/tag';

describe('Tag', () => {
  it('renders the label prefixed with #', () => {
    const { getByText } = render(<Tag label="plastic" />);

    expect(getByText('#plastic')).toBeInTheDocument();
  });

  it('renders nothing when the label is empty', () => {
    const { container } = render(<Tag label="" />);

    expect(container).toBeEmptyDOMElement();
  });
});
