import * as admin from 'firebase-admin'

const firebaseTest = require('firebase-functions-test')()
import { DB_ENDPOINTS } from '../../models'
import { generateSitemap } from './sitemapGenerate'
import { IModerationStatus } from 'oa-shared'

const testDocs = [
  // Should include accepted howtos and research
  {
    endpoint: DB_ENDPOINTS.howtos,
    expectIncluded: true,
    slug: 'howto-mod-accepted',
    moderation: IModerationStatus.ACCEPTED,
    _modified: '2022-06-20T23:28:24.653Z',
  },
  {
    endpoint: DB_ENDPOINTS.research,
    expectIncluded: true,
    slug: 'research-mod-accepted',
    moderation: IModerationStatus.ACCEPTED,
    _modified: '2022-06-20T23:28:24.653Z',
  },
  {
    endpoint: DB_ENDPOINTS.research,
    expectIncluded: true,
    slug: 'research-mod-awaiting',
    moderation: IModerationStatus.ACCEPTED,
    _modified: '2022-06-20T23:28:24.653Z',
  },
  // Should omit any not accepted or not howto/research
  {
    endpoint: DB_ENDPOINTS.howtos,
    expectIncluded: false,
    slug: 'howto-mod-awaiting',
    moderation: IModerationStatus.AWAITING_MODERATION,
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
    // Use nested describe-test statements to allow iterating over dynamic data
    // This seems to play more nicely than test.each which kept losing variables
    describe('sitemap populates entries as expected', () => {
      for (const testDoc of testDocs) {
        // we just check for the end of location tags for the slug as additional prefix
        // will also be included before
        const snippet = `/${testDoc.slug}</loc>`
        test(testDoc.slug, () => {
          const isIncluded = sitemapString.includes(snippet)
          expect(isIncluded).toBe(testDoc.expectIncluded)
        })
      }
    })
    describe('sitemap includes additional top-level routes', () => {
      const modulePages = ['how-to', 'map', 'research', 'academy']
      for (const modulePage of modulePages) {
        // the top-level pages should appear fully encapsulated, with domain specified from config
        const tag = `<loc>http://localhost:4000/${modulePage}</loc>`
        test(modulePage, () => {
          const isIncluded = sitemapString.includes(tag)
          expect(isIncluded).toBe(true)
        })
      }
    })
  })
})
