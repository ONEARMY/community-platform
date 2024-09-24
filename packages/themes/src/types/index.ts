import type { ProfileTypeName } from 'oa-shared'

export interface PlatformTheme {
  id: string
  siteName: string
  description: string
  logo: string
  favicon: string
  badge: string
  avatar: string
  styles: ThemeWithName
}

type Badge = {
  lowDetail: string
  normal: string
}

export interface ThemeWithName {
  name: string
  logo: string

  alerts: any

  badges: {
    [K in ProfileTypeName]?: Badge
  }

  text: any

  fonts: {
    body: string
  }

  forms: {
    input: any
    inputOutline: any
    error: any
    textarea?: any
    textareaError?: any
  }

  /**
   * Following properties are taken from DefaultTheme
   * exported from `styled-components`
   *
   * This should ideally be imported rather than manually
   * inlined. However some behaviour is making this hard to
   * achieve at the moment.
   */

  cards?: {
    primary: any
  }

  colors: {
    white: string
    black: string
    primary: string
    softyellow: string
    accent: { base: string; hover: string }
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
    offWhite: string
    lightgrey: string
    darkGrey: string
    subscribed: string
    notSubscribed: string
    betaGreen: string
  }

  fontSizes: number[]

  space: number[]
  radii: number[]

  zIndex: {
    behind: number
    level: number
    default: number
    modalProfile: number
    logoContainer: number
    header: number
  }
  breakpoints: string[]
  buttons: any
  maxContainerWidth: number
  regular: number
  bold: number

  sizes: {
    container: number
  }
}
