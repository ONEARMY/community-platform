export interface PlatformThemeStyles {
  text: Record<string, unknown>

  fonts: {
    body: string
  }

  forms: {
    input: Record<string, unknown>
    inputOutline: Record<string, unknown>
    error: Record<string, unknown>
    textarea?: Record<string, unknown>
    textareaError?: Record<string, unknown>
  }

  /**
   * Following properties are taken from DefaultTheme
   * exported from `styled-components`
   *
   * This should ideally be imported rather than manually
   * inlined. However some behaviour is making this hard to
   * achieve at the moment.
   */
  typography: {
    auxiliary: Record<string, unknown>
    paragraph: Record<string, unknown>
  }

  cards?: {
    primary: Record<string, unknown>
  }

  colors: {
    white: string
    black: string
    primary: string
    softyellow: string
    yellow: { base: string; hover: string }
    blue: string
    red: string
    red2: string
    softblue: string
    bluetag: string
    grey: string
    green: string
    error: string
    background: string
    silver: string
    softgrey: string
    offwhite: string
    lightgrey: string
    darkGrey: string
  }

  fontSizes: number[]

  space: number[]
  radii: number[]

  zIndex: {
    behind: number
    level: number
    default: number
    slickArrows: number
    modalProfile: number
    logoContainer: number
    mapFlexBar: number
    header: number
  }
  breakpoints: string[]
  buttons: Record<string, unknown>
  maxContainerWidth: number
  regular: number
  bold: number
}
