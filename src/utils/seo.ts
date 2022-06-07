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
 * NOTE 1 - this only updates tags that already appear in the public index.html file and does not
 * add additional
 *
 * NOTE 2 - this function is designed for use by store that manually specify tags on page load
 * Alternative methods to update from within components or server can be found at the links below
 * https://create-react-app.dev/docs/title-and-meta-tags/
 * https://www.npmjs.com/package/react-document-meta
 * https://github.com/nfl/react-helmet
 */
export const updateSeoTags = (update: Partial<ISEOMeta>) => {
  const { title, description, imageUrl, faviconUrl } = update
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

function setMetaName(name: IPlatformMetaName, value: string) {
  const el = document.querySelector(`meta[name="${name}"]`)
  if (el) {
    el.setAttribute('content', value)
  }
}
function setMetaProperty(property: IPlatformMetaProperty, value: string) {
  const el = document.querySelector(`meta[property="${property}"]`)
  if (el) {
    el.setAttribute('content', value)
  }
}
