import '@testing-library/jest-dom/vitest';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@theme-ui/core';
import { theme } from 'oa-themes';
import {
  createMemoryRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router';
import { emailPreferences as labels } from 'src/pages/SignUp/labels';
import { afterEach, describe, expect, it, vi } from 'vitest';

import Index from './_.setup-email-preferences';

const mockSetPreferences = vi.fn();

vi.mock('src/services/notificationsPreferencesService', () => ({
  notificationsPreferencesService: {
    setPreferences: (...args: unknown[]) => mockSetPreferences(...args),
  },
}));

// Run the promise through the toast helper so the success/error/finally
// callbacks fire the same way they do at runtime.
const mockToastPromise = vi.fn(
  async (promise: Promise<unknown>, options: any) => {
    try {
      await promise;
      options.success?.();
    } catch (error) {
      options.error?.(error);
    } finally {
      options.finally?.();
    }
  },
);

vi.mock('src/common/Toast/useToast', () => ({
  useToast: () => ({ promise: mockToastPromise }),
}));

vi.mock('src/common/Toast/CustomToast', () => ({
  CustomToast: () => null,
}));

const renderRoute = () => {
  const router = createMemoryRouter(
    createRoutesFromElements(
      <>
        <Route path="/setup-email-preferences" element={<Index />} />
        <Route path="/settings/profile" element={<div>Profile page</div>} />
      </>,
    ),
    { initialEntries: ['/setup-email-preferences'] },
  );

  const result = render(
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>,
  );

  return { ...result, router };
};

describe('setup-email-preferences route', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the email preferences onboarding screen', () => {
    renderRoute();

    expect(screen.getByText(labels.heading)).toBeInTheDocument();
    expect(screen.getByText(labels.subtitle)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: labels.submit }),
    ).toBeInTheDocument();
  });

  it('renders all three reach options', () => {
    renderRoute();

    expect(screen.getByText(labels.options.all.title)).toBeInTheDocument();
    expect(
      screen.getByText(labels.options.important.title),
    ).toBeInTheDocument();
    expect(screen.getByText(labels.options.none.title)).toBeInTheDocument();
  });

  it('defaults the selected reach to "important"', () => {
    const { container } = renderRoute();

    const importantInput = container.querySelector(
      '[data-cy="email-preference-important"] input',
    );
    expect(importantInput).toBeChecked();
  });

  it('saves preferences and navigates to the profile page on success', async () => {
    mockSetPreferences.mockResolvedValue({ ok: true });

    const { router } = renderRoute();

    await userEvent.click(screen.getByRole('button', { name: labels.submit }));

    await waitFor(() => {
      expect(mockSetPreferences).toHaveBeenCalledWith({
        comments: true,
        replies: true,
        researchUpdates: true,
        isUnsubscribed: false,
        contentReach: { value: 'important', label: 'important' },
      });
    });

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/settings/profile');
    });
  });

  it('still navigates to the profile page when saving fails', async () => {
    mockSetPreferences.mockRejectedValue(new Error('boom'));

    const { router } = renderRoute();

    await userEvent.click(screen.getByRole('button', { name: labels.submit }));

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/settings/profile');
    });
  });
});
