import '@testing-library/jest-dom/vitest';
import { act, render, screen, within } from '@testing-library/react';
import type { Author } from 'oa-shared';
import { MemoryRouter } from 'react-router';
import { theme } from 'oa-themes';
import { ThemeProvider } from '@theme-ui/core';
import { describe, expect, it } from 'vitest';
import { ResearchContributors } from './ResearchContributors';

const makeContributor = (username: string): Author =>
  ({
    id: 1,
    country: 'GB',
    displayName: username,
    photo: null,
    username,
  }) as Author;

const makeContributors = (count: number) =>
  Array.from({ length: count }, (_, index) => makeContributor(`contributor-${index}`));

const renderContributors = (contributors: Author[]) =>
  render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>
        <ResearchContributors contributors={contributors} />
      </ThemeProvider>
    </MemoryRouter>,
  );

describe('ResearchContributors', () => {
  it('renders nothing without contributors', () => {
    const { container } = renderContributors([]);

    expect(container).toBeEmptyDOMElement();
  });

  it('shows the username when there is a single contributor', () => {
    renderContributors(makeContributors(1));

    expect(screen.getByText('contributor-0')).toBeInTheDocument();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('shows a count instead of every username when there are several contributors', () => {
    renderContributors(makeContributors(2));

    expect(screen.getByRole('button')).toHaveTextContent('2 contributors');
    expect(screen.queryByText('contributor-0')).toBeNull();
  });

  it('shows at most three avatars for larger groups', () => {
    renderContributors(makeContributors(14));

    const trigger = screen.getByRole('button');
    expect(trigger).toHaveTextContent('14 contributors');
    expect(trigger.querySelectorAll('[aria-hidden="true"]')).toHaveLength(3);
  });

  it('lists every contributor once the modal opens', async () => {
    renderContributors(makeContributors(14));

    await act(async () => {
      screen.getByRole('button').click();
    });

    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getAllByRole('listitem')).toHaveLength(14);
  });
});
