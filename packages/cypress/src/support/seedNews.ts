import { MOCK_DATA } from '../data'
import { seedDatabase } from '../utils/TestUtils'
import { seedComment, seedReply } from './seedDiscussions'
import { seedCategories } from './seedQuestions'

export const seedNews = async (profiles, tagsData) => {
  const tenantId = Cypress.env('TENANT_ID')
  Cypress.log({
    displayName: 'Seeding database news for tenant',
    message: tenantId,
  })

  const { categories } = await seedCategories('news')

  const { news } = await seedDatabase(
    {
      news: MOCK_DATA.news.map((news) => ({
        ...news,
        created_by: profiles.data[0].id,
        tags: [tagsData.data[0].id, tagsData.data[1].id],
        category: categories.data[0].id,
        tenant_id: tenantId,
      })),
    },
    tenantId,
  )

  const { comments } = await seedComment(profiles, news)
  await seedReply(profiles, comments, news)
}
