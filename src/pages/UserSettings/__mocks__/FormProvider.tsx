import {
  createMemoryRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom'
import { ThemeProvider } from '@emotion/react'
import { render } from '@testing-library/react'
import { Provider } from 'mobx-react'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { testingThemeStyles } from 'src/test/utils/themeUtils'
import { vi } from 'vitest'

import type { IUserDB } from 'oa-shared'

const Theme = testingThemeStyles

export const FormProvider = (
  user: IUserDB,
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
      {...useCommonStores().stores}
      userStore={{
        user,
        updateStatus: { Complete: true },
        getUserEmail: vi.fn(),
        getUserProfile: vi.fn().mockResolvedValue(user),
      }}
    >
      <ThemeProvider theme={Theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>,
  )
}
