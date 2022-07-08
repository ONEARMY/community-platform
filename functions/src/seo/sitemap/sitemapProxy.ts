import * as functions from 'firebase-functions'
import { writeFileSync } from 'fs-extra'
import { tmpdir } from 'os'
import path from 'path'
import { bucket } from '../../Firebase/storage'
import { generateSitemap } from './sitemapGenerate'

/**
 * Read saved sitemap.xml from storage and return on request for sitemap
 *
 * Test in emulator:
 * http://localhost:4002/community-platform-emulated/us-central1/seo-sitemapProxy
 */
export const handleSitemapProxy = async (
  req: functions.https.Request,
  res: functions.Response,
) => {
  let sitemapString: string
  const ref = bucket.file('sitemap.xml')
  const [exists] = await ref.exists()
  // If sitemap already exists read from storage
  if (exists) {
    const data = await ref.download()
    sitemapString = Buffer.from(...data).toString()
  }
  // If sitemap does not exist (e.g. new site) try to generate
  else {
    sitemapString = await generateSitemap()
  }
  if (!sitemapString) {
    res.status(404).send()
    return
  }
  // Write to disk and return as a file
  const sitemapPath = path.resolve(tmpdir(), 'sitemap.xml')
  writeFileSync(sitemapPath, sitemapString)
  res.status(200).sendFile(sitemapPath)
}
