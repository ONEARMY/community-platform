import { ReactElement } from 'react';
import { RenderOptions } from '@testing-library/react';

declare const customRender: (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) => any;
export { customRender as render };
