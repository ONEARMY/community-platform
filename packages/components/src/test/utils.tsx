import type { RenderOptions } from '@testing-library/react';
import { render as testLibReact } from '@testing-library/react';
import { ThemeProvider } from '@theme-ui/core';
import { preciousPlasticTheme } from 'oa-themes';
import type { ReactElement } from 'react';
import { createRoutesStub } from 'react-router';

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  testLibReact(ui, {
    wrapper: ({ children }: { children: React.ReactNode }) => {
      const RouterStub = createRoutesStub([
        {
          path: '',
          Component() {
            return <>{children}</>;
          },
        },
      ]);

      return (
        <ThemeProvider theme={preciousPlasticTheme.styles}>
          <RouterStub />
        </ThemeProvider>
      );
    },

    ...options,
  });

export { customRender as render };
