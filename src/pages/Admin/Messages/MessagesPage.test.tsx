import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import type { AdminMessage } from './MessagesPage';
import { MessagesPage } from './MessagesPage';

const first: AdminMessage = {
  id: 1,
  message: 'Hi, do you sell the shredder blades?',
  createdAt: '2026-08-20T10:30:00Z',
  sender: { username: 'maker', displayName: 'Maker One' },
  receiver: { username: 'workshop', displayName: 'Workshop Two' },
};

const second: AdminMessage = {
  id: 2,
  message: 'Yes, they ship next week.',
  createdAt: '2026-08-21T09:00:00Z',
  sender: { username: 'workshop', displayName: 'Workshop Two' },
  receiver: { username: 'maker', displayName: 'Maker One' },
};

const renderPage = (messages: AdminMessage[], page = 1, totalPages = 1) =>
  render(
    <MemoryRouter>
      <MessagesPage
        messages={messages}
        page={page}
        totalPages={totalPages}
        totalCount={messages.length}
      />
    </MemoryRouter>,
  );

const detail = () => screen.getByLabelText('Selected message');

describe('MessagesPage', () => {
  it('lists each message with sender, receiver, preview and sent date', () => {
    renderPage([first]);

    expect(screen.getByRole('heading', { name: 'Messages' })).toBeInTheDocument();

    const row = screen.getByRole('row', { name: /shredder blades/ });
    expect(within(row).getByRole('link', { name: 'Maker One' })).toHaveAttribute('href', '/u/maker');
    expect(within(row).getByRole('link', { name: 'Workshop Two' })).toHaveAttribute(
      'href',
      '/u/workshop',
    );
    expect(within(row).getByText('20 Aug 2026')).toBeInTheDocument();
  });

  it('shows the first message in full by default', () => {
    renderPage([first, second]);

    expect(within(detail()).getByText(first.message)).toBeInTheDocument();
    expect(within(detail()).getByText('20 Aug 2026, 10:30')).toBeInTheDocument();
    expect(within(detail()).getByRole('link', { name: 'Maker One' })).toHaveAttribute(
      'href',
      '/u/maker',
    );
  });

  it('shows the full message of the clicked row', () => {
    renderPage([first, second]);

    fireEvent.click(screen.getByRole('button', { name: second.message }));

    expect(within(detail()).getByText(second.message)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: second.message })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('row', { name: /ship next week/ })).toHaveAttribute(
      'data-state',
      'selected',
    );
  });

  it('renders a profile without a username as plain text', () => {
    renderPage([{ ...first, sender: { username: null, displayName: 'Maker One' } }]);

    expect(screen.queryByRole('link', { name: 'Maker One' })).not.toBeInTheDocument();
    expect(screen.getAllByText('Maker One').length).toBeGreaterThan(0);
  });

  it('has no create, edit or delete controls', () => {
    renderPage([first]);

    expect(screen.queryByRole('button', { name: /create|edit|delete/i })).not.toBeInTheDocument();
  });

  it('shows an empty state without a detail pane', () => {
    renderPage([]);

    expect(screen.getByText('No messages found.')).toBeInTheDocument();
    expect(screen.queryByLabelText('Selected message')).not.toBeInTheDocument();
  });

  it('links to the neighbouring pages', () => {
    renderPage([first], 2, 3);

    expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Previous/ })).toHaveAttribute('href', '/?page=1');
    expect(screen.getByRole('button', { name: /Next/ })).toHaveAttribute('href', '/?page=3');
  });
});
