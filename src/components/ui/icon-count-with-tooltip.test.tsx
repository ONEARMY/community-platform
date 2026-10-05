import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { IconCountWithTooltip } from './icon-count-with-tooltip';

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

  it('shows the tooltip text when the trigger receives keyboard focus', async () => {
    const { findByText } = render(
      <IconCountWithTooltip count={12} icon="comment" text="Total comments" />,
    );

    await userEvent.tab();

    expect(await findByText('Total comments')).toBeInTheDocument();
  });

  it('passes dataCy through as the data-cy attribute', () => {
    const { getByText } = render(
      <IconCountWithTooltip count={3} dataCy="ItemUpdateText" icon="update" text="Amount of updates" />,
    );

    expect(getByText('3')).toHaveAttribute('data-cy', 'ItemUpdateText');
  });
});
