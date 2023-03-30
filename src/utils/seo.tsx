export interface ISEOMeta {
  title: string
  faviconUrl: string
  description: string
  imageUrl: string
}
/** Reduced list of meta properties used within site index.html for update */
type IPlatformMetaProperty =
  | 'og:title'
  | 'og:image'
  | 'og:description'
  | 'og:url'
type IPlatformMetaName =
  | 'description'
  | 'twitter:title'
  | 'twitter:description'
  | 'twitter:image'
  | 'twitter:card'

/**
 * Update document SEO tags
 *
 * NOTE - this only updates tags that already appear in the public index.html file and does not
 * add additional
 *
 * Alternative methods to update from within components or server can be found at the links below
 * https://create-react-app.dev/docs/title-and-meta-tags/
 * https://www.npmjs.com/package/react-document-meta
 * https://github.com/nfl/react-helmet
 */
export const seoTagsUpdate = (update: Partial<ISEOMeta>) => {
  const allTags = { ...getDefaultSEOTags(), ...update }
  const { title, description, imageUrl, faviconUrl } = allTags
  if (title) {
    document.title = title
    setMetaProperty('og:title', title)
    setMetaName('twitter:title', title)
  }
  if (description) {
    setMetaName('description', description)
    setMetaProperty('og:description', description)
    setMetaName('twitter:description', description)
  }
  if (faviconUrl) {
    const el = document.getElementById('favicon') as HTMLLinkElement
    if (el) {
      el.href = faviconUrl
    }
  }
  if (imageUrl) {
    setMetaName('twitter:image', imageUrl)
    setMetaProperty('og:image', imageUrl)
  }
}

/**
 * Use a component to force SEO tag updates. This may be useful in cases such
 * as alongside a router's child routes
 * @example `<SeoTagsUpdateComponent title='my title' />`
 */
export const SeoTagsUpdateComponent = (update: Partial<ISEOMeta>) => {
  seoTagsUpdate(update)
  return null
}

/**
 * Load the default SEO tags for the site (as currently hardcoded into the public index.html file)
 * TODO - it would be better if these were linked to the active site/deployment/theme in some way
 */
const getDefaultSEOTags = (): ISEOMeta => {
  const PUBLIC_URL = location.origin
  return {
    title: 'Community Platform',
    description:
      'A series of tools for the Precious Plastic community to collaborate around the world. Connect, share and meet each other to tackle plastic waste.',
    faviconUrl: `${PUBLIC_URL}/favicon.ico`,
    imageUrl: `${PUBLIC_URL}/social-image.jpg`,
  }
}

const setMetaName = (name: IPlatformMetaName, value: string) => {
  const el = document.querySelector(`meta[name="${name}"]`)
  if (el) {
    el.setAttribute('content', value)
  }
}
const setMetaProperty = (property: IPlatformMetaProperty, value: string) => {
  const el = document.querySelector(`meta[property="${property}"]`)
  if (el) {
    el.setAttribute('content', value)
  }
}
