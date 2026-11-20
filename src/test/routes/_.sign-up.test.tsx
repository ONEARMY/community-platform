import '@testing-library/jest-dom/vitest';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@theme-ui/core';
import { FRIENDLY_MESSAGES } from 'oa-shared';
import { theme } from 'oa-themes';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it, vi } from 'vitest';

import Index from 'src/routes/_.sign-up';

vi.mock('@/components/ui/turnstile', () => ({
  TURNSTILE_TEST_SITE_KEY: 'test-key',
  Turnstile: () => null,
}));

const renderRoute = () => {
  const router = createMemoryRouter(
    [
      {
        path: '/sign-up',
        element: <Index />,
        loader: () => ({ turnstileSiteKey: 'test-key' }),
      },
    ],
    { initialEntries: ['/sign-up'] },
  );

  return render(
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>,
  );
};

const getField = (container: HTMLElement, name: string) =>
  container.querySelector(`[data-cy="${name}"]`) as HTMLInputElement;

describe('sign-up route', () => {
  it('validates the sign-up form', async () => {
    const { container } = renderRoute();
    const user = userEvent.setup();

    await screen.findByText('Create an account');

    await user.type(getField(container, 'email'), 'a');
    await user.tab();
    expect(await screen.findByText(FRIENDLY_MESSAGES['auth/invalid-email'])).toBeVisible();

    await user.type(getField(container, 'password'), 'a');
    await user.tab();
    expect(await screen.findByText(FRIENDLY_MESSAGES['sign-up/password-short'])).toBeVisible();

    await user.type(getField(container, 'confirm-password'), 'b');
    await user.tab();
    expect(await screen.findByText(FRIENDLY_MESSAGES['sign-up/password-mismatch'])).toBeVisible();
  });
});
