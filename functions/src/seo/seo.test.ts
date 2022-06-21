import * as admin from 'firebase-admin'

const firebaseTest = require('firebase-functions-test')()
import { DB_ENDPOINTS } from '../models'
import { generateSitemap } from './sitemapGenerate'

const testDocs = [
  // Should include accepted howtos and research
  {
    endpoint: DB_ENDPOINTS.howtos,
    expectIncluded: true,
    slug: 'howto-mod-accepted',
    moderation: 'accepted',
    _modified: '2022-06-20T23:28:24.653Z',
  },
  {
    endpoint: DB_ENDPOINTS.research,
    expectIncluded: true,
    slug: 'research-mod-accepted',
    moderation: 'accepted',
    _modified: '2022-06-20T23:28:24.653Z',
  },
  {
    endpoint: DB_ENDPOINTS.research,
    expectIncluded: true,
    slug: 'research-mod-awaiting',
    moderation: 'accepted',
    _modified: '2022-06-20T23:28:24.653Z',
  },
  // Should omit any not accepted or not howto/research
  {
    endpoint: DB_ENDPOINTS.howtos,
    expectIncluded: false,
    slug: 'howto-mod-awaiting',
    moderation: 'awaiting-moderation',
    _modified: '2022-06-20T23:28:24.653Z',
  },
  {
    endpoint: DB_ENDPOINTS.events,
    expectIncluded: false,
    slug: 'event-accepted',
    moderation: 'accepted',
    _modified: '2022-06-20T23:28:24.653Z',
  },
]

describe('SEO', () => {
  let db: FirebaseFirestore.Firestore
  beforeAll(async () => {
    db = admin.firestore()
    // Test will only create entries for accepted howtos and research
    for (const doc of testDocs) {
      await db.collection(doc.endpoint).add(doc)
    }
  })
  afterAll(firebaseTest.cleanup)

  describe('Sitemap', () => {
    let sitemapString: string
    beforeAll(async () => {
      sitemapString = await generateSitemap().catch(() => null)
    })
    it('generates sitemap xml as string', () => {
      console.log('sitemap String', sitemapString)
      expect(sitemapString).not.toBe(undefined)
    })
    describe('filters sitemap entries correctly', () => {
      for (const testDoc of testDocs) {
        const snippet = `/${testDoc.slug}</loc>`
        test(testDoc.slug, () => {
          const isIncluded = sitemapString.includes(snippet)
          expect(isIncluded).toBe(testDoc.expectIncluded)
        })
      }
    })
    describe('includes main module routes', () => {
      const modulePages = ['how-to', 'map', 'research', 'events', 'academy']
      for (const modulePage of modulePages) {
        const tag = `<loc>https://functions.test/${modulePage}</loc>`
        test(modulePage, () => {
          const isIncluded = sitemapString.includes(tag)
          expect(isIncluded).toBe(true)
        })
      }
    })
  })
})
/**
 * describe('filters sitemap entries correctly', () => {
      test.each(testDocs)('$entry.slug', (entry) => {
        const tag = '<loc>https://functions.test/$entry.slug</loc>'
        expect(sitemapString.includes(tag)).toBe(entry.expectIncluded)
      })
    })
    describe('includes main module routes', () => {
      const modulePages = ['how-to', 'map', 'events', 'academy']
      test.each(modulePages)('$_slug', (_slug) => {
        const tag = '<loc>https://functions.test/$_slug</loc>'
        expect(sitemapString.includes(tag)).toBe(true)
      })
    })
 */
