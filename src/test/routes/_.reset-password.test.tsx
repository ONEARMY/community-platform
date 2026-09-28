import '@testing-library/jest-dom/vitest';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@theme-ui/core';
import { theme } from 'oa-themes';
import { useEffect } from 'react';
import type { ActionFunctionArgs } from 'react-router';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { afterEach, describe, expect, it, vi } from 'vitest';

import Index from 'src/routes/_.reset-password';

vi.mock('@/components/ui/turnstile', () => ({
  TURNSTILE_TEST_SITE_KEY: 'test-key',
  Turnstile: ({ onVerify }: { onVerify: (token: string) => void }) => {
    useEffect(() => onVerify('test-token'), []);
    return null;
  },
}));

const mockAction = vi.fn(async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  return { success: true, email: formData.get('email') as string, error: null };
});

const renderRoute = () => {
  const router = createMemoryRouter(
    [
      {
        path: '/reset-password',
        element: <Index />,
        loader: () => ({ turnstileSiteKey: 'test-key' }),
        action: mockAction,
      },
    ],
    { initialEntries: ['/reset-password'] },
  );

  const result = render(
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>,
  );

  result.container.addEventListener('submit', (event) => {
    event.preventDefault();
    router.navigate('/reset-password', {
      formMethod: 'post',
      formData: new FormData(event.target as HTMLFormElement),
    });
  });

  return result;
};

const getEmailField = (container: HTMLElement) =>
  container.querySelector('[data-cy="email"]') as HTMLInputElement | null;

describe('reset-password route', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('submits the email, then goes back to the reset form', async () => {
    const { container } = renderRoute();
    const user = userEvent.setup();

    await screen.findByText('Reset Password');
    await user.type(getEmailField(container)!, 'user@example.com');

    const submit = screen.getByRole('button', { name: 'Reset password' });
    await waitFor(() => expect(submit).toBeEnabled());
    await user.click(submit);

    const goBack = await screen.findByText('Go back to reset form');
    expect(mockAction).toHaveBeenCalledTimes(1);
    expect(screen.getByText('user@example.com')).toBeInTheDocument();
    expect(getEmailField(container)).not.toBeInTheDocument();

    await user.click(goBack);

    await waitFor(() => expect(getEmailField(container)).toBeInTheDocument());
    expect(screen.queryByText('Go back to reset form')).not.toBeInTheDocument();
  });
});
