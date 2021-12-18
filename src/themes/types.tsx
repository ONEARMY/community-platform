interface LinkList {
  label: string
  url: string
}

export interface PlatformTheme {
  siteName: string
  logo: string
  howtoHeading: string
  styles: any
  academyResource: string
  externalLinks: LinkList[]
}
