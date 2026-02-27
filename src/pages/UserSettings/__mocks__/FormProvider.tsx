import { render } from '@testing-library/react';
import { ThemeProvider } from '@theme-ui/core';
import { theme } from 'oa-themes';
import { createMemoryRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router';
import { ProfileStoreProvider } from 'src/stores/Profile/profile.store';

export const FormProvider = (element: React.ReactNode, routerInitialEntry?: string) => {
  const router = createMemoryRouter(createRoutesFromElements(<Route index element={element} />), {
    initialEntries: [routerInitialEntry ? routerInitialEntry : ''],
  });

  return render(
    <ProfileStoreProvider>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </ProfileStoreProvider>,
  );
};
