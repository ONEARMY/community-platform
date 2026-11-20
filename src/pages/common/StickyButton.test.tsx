import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@theme-ui/core';
import { theme } from 'oa-themes';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';
import { StickyButton } from './StickyButton';

const renderAt = (path: string) => {
  window.history.pushState({}, '', path);

  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={[path]}>
        <StickyButton />
      </MemoryRouter>
    </ThemeProvider>,
  );
};

describe('StickyButton', () => {
  afterEach(() => {
    window.history.pushState({}, '', '/');
  });

  it('links to feedback with the current path and search', () => {
    const { container } = renderAt('/library?sort=MostUsefulLastWeek');

    const link = container.querySelector('[data-cy=feedback]');
    expect(link).toHaveAttribute('href', expect.stringContaining('/library?sort=MostUsefulLastWeek'));
    expect(link).toHaveTextContent('Report a Problem');
  });

  it('renders the short mobile label', () => {
    renderAt('/library?sort=MostUsefulLastWeek');

    expect(screen.getByText('Problem?')).toBeInTheDocument();
  });

  it.each(['/support', '/admin'])('is hidden on %s', (path) => {
    const { container } = renderAt(path);

    expect(container.querySelector('[data-cy=feedback]')).not.toBeInTheDocument();
  });
});
