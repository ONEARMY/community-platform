import {
  createMemoryRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom'
import { render } from '@testing-library/react'
import { ThemeProvider } from '@theme-ui/core'
import { Provider } from 'mobx-react'
import { testingThemeStyles } from 'src/test/utils/themeUtils'

import type { Profile } from 'oa-shared'

const Theme = testingThemeStyles

export const FormProvider = (
  profile: Profile,
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
    <Provider
      profileStore={{
        profile,
      }}
    >
      <ThemeProvider theme={Theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>,
  )
}
