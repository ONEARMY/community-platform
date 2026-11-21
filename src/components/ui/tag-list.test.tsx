import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TagList } from '@/components/ui/tag-list';

describe('TagList', () => {
  it('renders multiple tags', () => {
    const { getByText } = render(<TagList tags={['The best tag', 'The second best tag']} />);

    expect(getByText('#The best tag')).toBeInTheDocument();
    expect(getByText('#The second best tag')).toBeInTheDocument();
  });

  it('skips empty tags', () => {
    const { getByTestId } = render(<TagList data-testid="list" tags={['one', '', 'two']} />);

    expect(getByTestId('list').children).toHaveLength(2);
  });
});
