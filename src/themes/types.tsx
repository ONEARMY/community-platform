import type { ProfileTypeLabel } from 'src/modules/profile'

interface LinkList {
  label: string
  url: string
}

export interface PlatformTheme {
  id: string
  siteName: string
  logo: string
  badge: string
  avatar: string
  howtoHeading: string
  styles: any
  academyResource: string
  externalLinks: LinkList[]
}

type Badge = {
  lowDetail: string
  normal: string
}

export interface ThemeWithName {
  name: string

  logo: string

  profileGuidelinesURL: string

  communityProgramURL: string

  badges: {
    [K in ProfileTypeLabel]?: Badge
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
  typography: {
    auxiliary: any
    paragraph: any
  }

  cards?: {
    primary: any
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
  buttons: any
  maxContainerWidth: number
  regular: number
  bold: number
}
