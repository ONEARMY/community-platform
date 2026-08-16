import '@testing-library/jest-dom/vitest';

import { describe, expect, it, vi } from 'vitest';

import { render } from '../test/utils';
import { CardButton } from './CardButton';

describe('CardButton', () => {
  it('renders as a real button when it is clickable', () => {
    const { getByRole } = render(
      <CardButton onClick={vi.fn()}>Clickable</CardButton>,
    );

    const button = getByRole('button', { name: 'Clickable' });

    expect(button.tagName).toEqual('BUTTON');
    // Buttons default to type="submit", which would submit any surrounding form.
    expect(button).toHaveAttribute('type', 'button');
  });

  it('is reachable and activatable with the keyboard', async () => {
    const onClick = vi.fn();

    const { getByRole } = render(
      <CardButton onClick={onClick}>Clickable</CardButton>,
    );

    const button = getByRole('button', { name: 'Clickable' });

    button.focus();
    expect(button).toHaveFocus();

    button.click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('exposes its selected state to assistive technology', () => {
    const { getByRole, rerender } = render(
      <CardButton isSelected={false} onClick={vi.fn()}>
        Filter
      </CardButton>,
    );

    expect(getByRole('button', { name: 'Filter' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );

    rerender(
      <CardButton isSelected onClick={vi.fn()}>
        Filter
      </CardButton>,
    );

    expect(getByRole('button', { name: 'Filter' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('stays a plain card when there is nothing to click', () => {
    const { queryByRole, getByText } = render(<CardButton>Static</CardButton>);

    expect(queryByRole('button')).toBeNull();
    expect(getByText('Static')).toBeInTheDocument();
  });
});
