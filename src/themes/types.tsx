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
