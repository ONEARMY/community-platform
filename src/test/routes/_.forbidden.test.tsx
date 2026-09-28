import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@theme-ui/core';
import { theme } from 'oa-themes';
import { createMemoryRouter, RouterProvider } from 'react-router';
import Index, { loader } from 'src/routes/_.forbidden';
import { describe, expect, it, vi } from 'vitest';

vi.mock('src/repository/supabase.server', () => ({
  createSupabaseServerClient: () => ({ client: {} }),
}));

vi.mock('src/services/tenantSettingsService.server', () => ({
  TenantSettingsService: class {
    get = async () => ({ emailFrom: 'test@example.com' });
  },
}));

const renderRoute = (path: string) => {
  const router = createMemoryRouter([{ path: '/forbidden', element: <Index />, loader }], {
    initialEntries: [path],
  });

  render(
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>,
  );
};

describe('forbidden route', () => {
  it('shows the default message without page details', async () => {
    renderRoute('/forbidden');

    expect(await screen.findByText(/You don't have the right permissions/)).toBeInTheDocument();
    expect(screen.getByText('Report the problem')).toBeInTheDocument();
  });

  it('shows the early-access message for research-create', async () => {
    renderRoute('/forbidden?page=research-create');

    expect(await screen.findByText(/This is a new feature/)).toBeInTheDocument();
    expect(screen.getByText('I want to use it')).toBeInTheDocument();
  });

  it('shows a plain permission message for news-create', async () => {
    renderRoute('/forbidden?page=news-create');

    expect(
      await screen.findByText("You don't have permission to create news posts."),
    ).toBeInTheDocument();
    expect(screen.getByText('Report the problem')).toBeInTheDocument();
  });
});
