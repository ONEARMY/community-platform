const ProfileType = {
  MEMBER: 'member',
  SPACE: 'space',
  WORKSPACE: 'workspace',
  MACHINE_BUILDER: 'machine-builder',
  COMMUNITY_BUILDER: 'community-builder',
  COLLECTION_POINT: 'collection-point',
} as const

export type ProfileTypeLabel = typeof ProfileType[keyof typeof ProfileType]

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
  styles: ThemeWithName
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

  alerts: any

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
    darkGrey: string
    subscribed: string
    notSubscribed: string
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
