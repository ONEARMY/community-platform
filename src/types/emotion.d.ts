import '@emotion/react'
import { ThemeWithName } from 'src/themes/types';

declare module '@emotion/react' {
    export interface Theme extends ThemeWithName { }
}
