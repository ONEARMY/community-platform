import { createRemixStub } from '@remix-run/testing'
import { render as testLibReact } from '@testing-library/react'
import { ThemeProvider } from '@theme-ui/core'
import { preciousPlasticTheme } from 'oa-themes'

import type { RenderOptions } from '@testing-library/react'
import type { ReactElement } from 'react'

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) =>
  testLibReact(ui, {
    wrapper: ({ children }: { children: React.ReactNode }) => {
      const RemixStub = createRemixStub([
        {
          path: '',
          Component() {
            return <>{children}</>
          },
        },
      ])

      return (
        <ThemeProvider theme={preciousPlasticTheme.styles}>
          <RemixStub />
        </ThemeProvider>
      )
    },

    ...options,
  })

export { customRender as render }
