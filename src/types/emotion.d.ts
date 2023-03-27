import '@emotion/react'
import type { ThemeWithName } from 'oa-themes'

declare module '@emotion/react' {
  export interface Theme extends ThemeWithName {}
}
