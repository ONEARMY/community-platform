import * as functions from 'firebase-functions'
import { bucket } from '../../Firebase/storage'
import { generateSitemap } from './sitemapGenerate'

/**
 * Read saved sitemap.xml from storage and return on request for sitemap
 *
 * Test in emulator:
 * http://localhost:4002/community-platform-emulated/us-central1/seo-sitemapProxy
 */
export const sitemapProxy = async (
  req: functions.https.Request,
  res: functions.Response,
) => {
  const ref = bucket.file('sitemap.xml')
  const [exists] = await ref.exists()
  // If sitemap does not exist (e.g. new site) try to generate
  if (!exists) {
    const sitemapString = await generateSitemap()
    if (sitemapString) {
      res.send(sitemapString)
    } else {
      res.status(404).send()
    }
    return
  }
  // Otherwise read the sitemap from storage and return
  const data = await ref.download()
  const sitemapString = Buffer.from(...data).toString()
  res.send(sitemapString)
}
