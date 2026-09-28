import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@theme-ui/core';
import { theme } from 'oa-themes';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { NotFoundPage } from './NotFound';

describe('NotFoundPage', () => {
  it('shows the heading and a link to the home page', () => {
    render(
      <ThemeProvider theme={theme}>
        <MemoryRouter initialEntries={['/abcdefghijklm']}>
          <NotFoundPage />
        </MemoryRouter>
      </ThemeProvider>,
    );

    expect(screen.getByText(/Nada, page not found 💩/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'home page' })).toHaveAttribute('href', '/');
  });
});
