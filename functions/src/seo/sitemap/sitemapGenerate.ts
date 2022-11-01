import * as functions from 'firebase-functions'
import os from 'os'
import path from 'path'
import { EnumChangefreq, SitemapStream, streamToPromise } from 'sitemap'
import type { SitemapItem } from 'sitemap'
import { Readable } from 'stream'
import { CONFIG } from '../../config/config'
import { uploadLocalFileToStorage } from '../../Firebase/storage'
import { getCollection } from '../../Firebase/firestoreDB'
import { IDBEndpoint } from '../../models'
import axios from 'axios'

/*************************************************************************
 * Main Methods
 ************************************************************************/

const SITE_URL = CONFIG.deployment?.site_url

/**
 * Generate a sitemap of dynamic content from the site
 * Adapted from: https://javascript.plainenglish.io/how-to-create-a-dynamic-sitemap-using-firestore-and-cloud-functions-5ff05fc2c9d8
 * @returns
 */
export async function generateSitemap() {
  functions.logger.log('[sitemapGenerate] Start')
  // Only generate if a fully-qualified site url is available
  if (!SITE_URL) {
    const errMessage =
      '[deployment.site_url] missing. Specify via firebase functions:config:set'
    functions.logger.error(errMessage)
    return
  }
  const sitemapItems = await generateSitemapItems()
  const xmlString = await convertSitemapToXMLString(sitemapItems)
  const [{ metadata }] = await writeSitemapXMLStringToAssets(xmlString)
  await notifySearchEngines()
  functions.logger.log(
    `${sitemapItems.length} sitemap entries created`,
    metadata,
  )
  return xmlString
}

/** Read database entries and donvert to sitemap items */
async function generateSitemapItems() {
  const items: SitemapItem[] = []
  for (const [dbEndpoint, generator] of Object.entries(sitemapItemGenerators)) {
    const docs = await getCollection(dbEndpoint as IDBEndpoint)
    const { docFilterFn, slugField, lastModField } = endpointDbDefaults
    const filtered = docs.filter((doc) => docFilterFn(doc))
    filtered.forEach((doc) => {
      const slug = doc[slugField]
      if (slug) {
        const item: SitemapItem = generator(slug)
        const lastMod = doc[lastModField]
        if (lastMod) {
          item.lastmod = lastMod
        }
        items.push(item)
      }
    })
  }
  //   Add additional top-level endpoints
  items.push(
    { ...endpointItemDefaults, url: `${SITE_URL}/how-to` },
    { ...endpointItemDefaults, url: `${SITE_URL}/research` },
    { ...endpointItemDefaults, url: `${SITE_URL}/map` },
    { ...endpointItemDefaults, url: `${SITE_URL}/events` },
    { ...endpointItemDefaults, url: `${SITE_URL}/academy` },
  )
  return items
}

/** Generate XML from sitemap item entries **/
async function convertSitemapToXMLString(items: SitemapItem[]) {
  const stream = new SitemapStream({ hostname: SITE_URL })
  return streamToPromise(Readable.from(items).pipe(stream)).then((data) =>
    data.toString(),
  )
}
/** Write the generated sitemap xml to local storage bucket */
async function writeSitemapXMLStringToAssets(xmlString: string) {
  const fs = require('fs')
  const localFilepath = path.resolve(os.tmpdir(), 'oa-sitemap.xml')
  fs.writeFileSync(localFilepath, xmlString)
  const res = await uploadLocalFileToStorage(localFilepath, 'sitemap.xml')
  return res
}

/**
 * Send a ping notification to search engines to inform them sitemap updated
 * Currently only google (bing stopped support: https://www.ctrl.blog/entry/sitemap-ping-indexnow.html)
 * TODO - also would be good to ensure pre-render also has latest content
 * TODO - possible additional notifiers via https://www.indexnow.org/index
 * */
async function notifySearchEngines() {
  const sitemapUrl = `${SITE_URL}/sitemap`
  const googleNotiferUrl = `https://www.google.com/ping?sitemap=${sitemapUrl}`
  await axios
    .get(googleNotiferUrl)
    .catch((err) =>
      functions.logger.error(`[Sitemap] Failed to notify`, err.message),
    )
}

/*************************************************************************
 * Constants and Interfaces
 ************************************************************************/

/** Data used to extract SEO data from db endpoint */
interface IEndpointDBMapping {
  /** Specify docs to include/exclude via filter function */
  docFilterFn: (doc: any) => boolean
  /** Field used to extract slug from a doc (usually 'slug') */
  slugField: string
  /** Field used to extract when a doc was last modified (usually '_modified') */
  lastModField: string
}

const endpointDbDefaults: IEndpointDBMapping = {
  slugField: 'slug',
  lastModField: '_modified',
  docFilterFn: (doc: any) => doc.moderation === 'accepted',
}

/** Default values to apply when generating sitemap items **/
const endpointItemDefaults = {
  img: null,
  links: null,
  video: null,
}

/**
 * Generate sitemap metadata for each db endpoint
 * For details about options see https://github.com/ekalinin/sitemap.js
 * For more info about sitemaps see https://www.sitemaps.org/protocol.html
 **/
const sitemapItemGenerators: {
  [endpoint in IDBEndpoint]?: (slug: string) => SitemapItem
} = {
  howtos: (slug: string) => ({
    ...endpointItemDefaults,
    url: `${SITE_URL}/how-to/${slug}`,
    changefreq: EnumChangefreq.MONTHLY,
    priority: 0.8,
  }),

  research: (slug: string) => ({
    ...endpointItemDefaults,
    url: `${SITE_URL}/research/${slug}`,
    changefreq: EnumChangefreq.MONTHLY,
  }),
  // NOTE - additional endpoints excluded:
  // Events - don't have standalone pages for events
  // Academy - only hosts iframe so not sure how to extract list of urls
  // Map - pins don't hold much info of value for search
  // Profile/Settings - not sure if good idea to make as publically searchable
}
