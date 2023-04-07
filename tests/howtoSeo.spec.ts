import { howtos } from 'oa-shared/lib/mocks/data'
import { test, expect } from './support'
import { TestDB } from './support/db/FirebaseTestDatabase'
import { generateDatabasePrefix } from './support/db/generateDatabasePrefix'
import { setDatabasePrefix } from './support/setDatabasePrefix'

test.describe('[How To]', () => {
  test.describe('[SEO Metadata]', () => {
    test('Populates title and description tags', async ({ page, context }) => {
      const DB_PREFIX = generateDatabasePrefix()
      await TestDB.seedDB(DB_PREFIX, ['howtos'])
      await context.addInitScript(setDatabasePrefix, DB_PREFIX)
      const { slug, title, description, cover_image } =
        howtos.cmMzzlQP00fCckYIeL2e

      await page.goto(`/how-to/${slug}`)

      const pageTitle = await page.getByText(title)

      await expect(pageTitle).toBeVisible()

      // General
      await expect(await page.title()).toBe(title)

      const metaDescription = await page.$('meta[name="description"]')
      await expect(await metaDescription?.getAttribute('content')).toBe(
        description,
      )

      const ogTitle = await page.$('meta[property="og:title"]')
      await expect(await ogTitle?.getAttribute('content')).toBe(title)

      const ogDescription = await page.$('meta[property="og:description"]')
      await expect(await ogDescription?.getAttribute('content')).toBe(
        description,
      )

      const ogImage = await page.$('meta[property="og:image"]')
      await expect(await ogImage?.getAttribute('content')).toBe(
        cover_image.downloadUrl,
      )

      const twitterTitle = await page.$('meta[name="twitter:title"]')
      await expect(await twitterTitle?.getAttribute('content')).toBe(title)

      const twitterDescription = await page.$(
        'meta[name="twitter:description"]',
      )
      await expect(await twitterDescription?.getAttribute('content')).toBe(
        description,
      )

      const twitterImage = await page.$('meta[name="twitter:image"]')
      await expect(await twitterImage?.getAttribute('content')).toBe(
        cover_image.downloadUrl,
      )
    })
  })
})
