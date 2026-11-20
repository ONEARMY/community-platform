import '@testing-library/jest-dom/vitest';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@theme-ui/core';
import { theme } from 'oa-themes';
import { FactoryUser } from 'src/test/factories/User';
import { describe, expect, it, vi } from 'vitest';

import { headings } from './labels';
import { NewsListHeader } from './NewsListHeader';

const mockProfileStore = vi.hoisted(() => ({ profile: undefined as unknown }));

vi.mock('src/stores/Profile/profile.store', () => ({
  useProfileStore: () => ({
    profile: mockProfileStore.profile,
    isUserAuthorized: vi.fn(() => false),
  }),
}));

const renderHeader = () => {
  const router = createMemoryRouter([
    {
      path: '/',
      element: <NewsListHeader draftCount={0} handleShowDrafts={vi.fn()} showDrafts={false} />,
    },
  ]);
  return render(
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>,
  );
};

describe('NewsListHeader', () => {
  it('welcomes logged out visitors', () => {
    mockProfileStore.profile = undefined;
    const { getByRole, getByText } = renderHeader();

    expect(getByRole('heading', { level: 1 })).toHaveTextContent(headings.welcome);
    expect(getByText(headings.tagline)).toBeInTheDocument();
  });

  it('greets logged in users by display name', () => {
    mockProfileStore.profile = FactoryUser({ displayName: 'Dave' });
    const { getByRole, queryByText } = renderHeader();

    expect(getByRole('heading', { level: 1 })).toHaveTextContent('Hello, Dave');
    expect(queryByText(headings.tagline)).not.toBeInTheDocument();
  });
});
