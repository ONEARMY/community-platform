import '@testing-library/jest-dom/vitest';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@theme-ui/core';
import { theme } from 'oa-themes';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it, vi } from 'vitest';

import Index from 'src/routes/_.sign-in';

vi.mock('@/components/ui/turnstile', () => ({
  TURNSTILE_TEST_SITE_KEY: 'test-key',
  Turnstile: () => null,
}));

describe('sign-in route', () => {
  it('links to the reset password page', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/sign-in',
          element: <Index />,
          loader: () => ({ turnstileSiteKey: 'test-key' }),
        },
        { path: '/reset-password', element: <div>Reset password page</div> },
      ],
      { initialEntries: ['/sign-in'] },
    );

    render(
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>,
    );

    const link = await screen.findByText('Forgotten password?');
    expect(link).toHaveAttribute('data-cy', 'lost-password');
    expect(link).toHaveAttribute('href', '/reset-password');

    await userEvent.click(link);

    expect(await screen.findByText('Reset password page')).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/reset-password');
  });
});
