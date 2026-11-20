import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';

const renderTooltip = () =>
  render(
    <Tooltip>
      <TooltipTrigger>Trigger</TooltipTrigger>
      <TooltipContent>Helpful hint</TooltipContent>
    </Tooltip>,
  );

describe('Tooltip', () => {
  it('opens on keyboard focus and closes on Escape', async () => {
    const user = userEvent.setup();
    renderTooltip();

    await user.tab();

    expect(screen.getByRole('button', { name: 'Trigger' })).toHaveFocus();
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Helpful hint');

    await user.keyboard('{Escape}');

    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
  });

  it('opens on touch tap', async () => {
    const user = userEvent.setup();
    renderTooltip();
    const trigger = screen.getByRole('button', { name: 'Trigger' });

    await user.pointer({ keys: '[TouchA]', target: trigger });

    expect(await screen.findByRole('tooltip')).toHaveTextContent('Helpful hint');
  });

  it('closes an open tooltip on a second touch tap', async () => {
    const user = userEvent.setup();
    renderTooltip();
    const trigger = screen.getByRole('button', { name: 'Trigger' });

    await user.pointer({ keys: '[TouchA]', target: trigger });
    await screen.findByRole('tooltip');

    await user.pointer({ keys: '[TouchA]', target: trigger });

    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
  });

  it('closes a touch-opened tooltip when tapping outside', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Tooltip>
          <TooltipTrigger>Trigger</TooltipTrigger>
          <TooltipContent>Helpful hint</TooltipContent>
        </Tooltip>
        <p>Outside</p>
      </>,
    );

    await user.pointer({ keys: '[TouchA]', target: screen.getByRole('button', { name: 'Trigger' }) });
    await screen.findByRole('tooltip');

    await user.pointer({ keys: '[TouchA]', target: screen.getByText('Outside') });

    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
  });

  it('describes the trigger with the tooltip content', async () => {
    const user = userEvent.setup();
    renderTooltip();

    await user.tab();
    const tooltip = await screen.findByRole('tooltip');

    expect(screen.getByRole('button', { name: 'Trigger' })).toHaveAttribute(
      'aria-describedby',
      tooltip.id,
    );
  });
});
