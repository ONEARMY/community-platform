import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';

const renderMenu = (onDelete = vi.fn()) =>
  render(
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon-xs" />}>
        <span className="sr-only">Show Actions</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem disabled onClick={onDelete}>
          Delete
        </DropdownMenuItem>
        <DropdownMenuItem>Copy Link</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>,
  );

describe('DropdownMenu', () => {
  it('opens from its labelled trigger and closes after selecting an action', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" size="icon-xs" />}>
          <span className="sr-only">Show Actions</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    await user.click(screen.getByRole('button', { name: 'Show Actions' }));
    await user.click(await screen.findByRole('menuitem', { name: 'Edit' }));

    expect(onEdit).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole('menuitem', { name: 'Edit' })).toBeNull());
  });

  it('dismisses with Escape and restores focus to the trigger', async () => {
    const user = userEvent.setup();
    renderMenu();
    const trigger = screen.getByRole('button', { name: 'Show Actions' });

    await user.click(trigger);
    await screen.findByRole('menu');
    await user.keyboard('{Escape}');

    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });

  it('dismisses when clicking outside the menu', async () => {
    const user = userEvent.setup();
    renderMenu();
    render(<button type="button">Outside</button>);

    await user.click(screen.getByRole('button', { name: 'Show Actions' }));
    await screen.findByRole('menu');
    await user.click(screen.getByRole('button', { name: 'Outside' }));

    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
  });

  it('navigates actions with the keyboard and does not activate disabled actions', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    renderMenu(onDelete);

    await user.tab();
    await user.keyboard('{ArrowDown}');
    const edit = await screen.findByRole('menuitem', { name: 'Edit' });
    await waitFor(() => expect(document.activeElement).toBe(edit));

    await user.keyboard('{ArrowDown}');
    const disabledAction = screen.getByRole('menuitem', { name: 'Delete' });
    expect(disabledAction.getAttribute('aria-disabled')).toBe('true');
    await user.keyboard('{Enter}');
    expect(onDelete).not.toHaveBeenCalled();
    expect(screen.getByRole('menu')).toBeTruthy();

    await user.keyboard('{ArrowDown}');
    await waitFor(() =>
      expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: 'Copy Link' })),
    );
  });
});
