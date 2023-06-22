import { render as testLibReact } from '@testing-library/react'
import type { RenderOptions } from '@testing-library/react'
import type { ReactElement } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from 'theme-ui'
import { preciousPlasticTheme } from 'oa-themes'

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) =>
  testLibReact(ui, {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <MemoryRouter>
        <ThemeProvider theme={preciousPlasticTheme.styles}>
          {children}
        </ThemeProvider>
      </MemoryRouter>
    ),
    ...options,
  })

export { customRender as render }
