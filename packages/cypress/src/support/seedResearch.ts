import { MOCK_DATA } from '../data'
import { seedDatabase } from '../utils/TestUtils'
import { seedComment, seedReply } from './seedDiscussions'
import { seedCategories } from './seedQuestions'

export const seedResearch = async (profiles, tagsData) => {
  const tenantId = Cypress.env('TENANT_ID')
  Cypress.log({
    displayName: 'Seeding database research for tenant',
    message: tenantId,
  })

  const { categories } = await seedCategories('research')

  const { research } = await seedDatabase(
    {
      research: MOCK_DATA.research.map((item) => ({
        title: item.title,
        description: item.description,
        slug: item.slug,
        created_by: profiles.data[0].id,
        tags: [tagsData.data[0].id, tagsData.data[1].id],
        category: categories.data[0].id,
        deleted: item.deleted,
        tenant_id: tenantId,
      })),
    },
    tenantId,
  )

  const researchItem = MOCK_DATA.research[0]

  if (researchItem.updates && researchItem.updates.length) {
    const { research_updates } = await seedDatabase(
      {
        research_updates: researchItem.updates.map((item) => ({
          title: item.title,
          research_id: research.data[0].id,
          description: item.description,
          created_by: profiles.data[0].id,
          tenant_id: tenantId,
        })),
      },
      tenantId,
    )

    const { comments } = await seedComment(
      profiles,
      research_updates,
      'research_update',
    )

    await seedReply(profiles, comments, research)
  }
}
