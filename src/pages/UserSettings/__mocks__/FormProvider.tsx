import { createMemoryRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router';
import { render } from '@testing-library/react'
import { ThemeProvider } from '@theme-ui/core'
import { ProfileStoreProvider } from 'src/stores/Profile/profile.store'
import { testingThemeStyles } from 'src/test/utils/themeUtils'

const Theme = testingThemeStyles

export const FormProvider = (
  element: React.ReactNode,
  routerInitialEntry?: string,
) => {
  if (routerInitialEntry !== undefined) {
    // impact section is only displayed if isPreciousPlastic() is true
    window.localStorage.setItem('platformTheme', 'precious-plastic')
  }

  const router = createMemoryRouter(
    createRoutesFromElements(<Route index element={element} />),
    {
      initialEntries: [routerInitialEntry ? routerInitialEntry : ''],
    },
  )

  return render(
    <ProfileStoreProvider>
      <ThemeProvider theme={Theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </ProfileStoreProvider>,
  )
}
