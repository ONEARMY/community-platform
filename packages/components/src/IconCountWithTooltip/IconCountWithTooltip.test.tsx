import '@testing-library/jest-dom/vitest';

import { describe, expect, it } from 'vitest';

import { render } from '../test/utils';
import { IconCountWithTooltip } from './IconCountWithTooltip';

describe('IconCountWithTooltip', () => {
  it('validates the component behaviour', () => {
    const { getByText } = render(
      <IconCountWithTooltip count={345} icon="show" text="Number of Views" />,
    );

    expect(getByText('345')).toBeInTheDocument();
  });

  it('displays the correct count format', () => {
    const { getByText, rerender } = render(
      <IconCountWithTooltip count={1500} icon="show" text="Number of Views" />,
    );

    expect(getByText('1.5K')).toBeInTheDocument();

    rerender(<IconCountWithTooltip count={2099999} icon="show" text="Number of Views" />);

    expect(getByText('2.1M')).toBeInTheDocument();
  });
});
