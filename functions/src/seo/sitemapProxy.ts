import * as functions from 'firebase-functions'
import { generateSitemap } from '.'
import { bucket } from '../Firebase/storage'

/**
 * Read saved sitemap.xml from storage and return on request for sitemap
 *
 * Test in emulator:
 * http://localhost:4002/community-platform-emulated/us-central1/seo-sitemapProxy
 */
export const sitemapProxy = functions.https.onRequest(async (req, res) => {
  const ref = bucket.file('sitemap.xml')
  const [exists] = await ref.exists()
  // If sitemap does not exist (e.g. new site) try to generate
  if (!exists) {
    try {
      const sitemapString = await generateSitemap()
      res.send(sitemapString)
    } catch (error) {
      res.status(404).send()
    }
    return
  }
  // Otherwise read the sitemap from storage and return
  const data = await ref.download()
  const sitemapString = Buffer.from(...data).toString()
  res.send(sitemapString)
})
