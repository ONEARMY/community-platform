import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { ThemeProvider } from '@emotion/react'
import { createRoutesFromElements, Route } from '@remix-run/react'
import { render as testLibReact } from '@testing-library/react'
import { preciousPlasticTheme } from 'oa-themes'

import type { RenderOptions } from '@testing-library/react'
import type { ReactElement } from 'react'

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) =>
  testLibReact(ui, {
    wrapper: ({ children }: { children: React.ReactNode }) => {
      const router = createMemoryRouter(
        createRoutesFromElements(<Route index element={children}></Route>),
      )

      return (
        <ThemeProvider theme={preciousPlasticTheme.styles}>
          <RouterProvider router={router} />
        </ThemeProvider>
      )
    },

    ...options,
  })

export { customRender as render }
