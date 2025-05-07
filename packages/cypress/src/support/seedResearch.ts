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

  const researchData = []

  for (let i = 0; i < MOCK_DATA.research.length; i++) {
    const item = MOCK_DATA.research[i]

    researchData.push({
      title: item.title,
      description: item.description,
      slug: item.slug,
      created_by:
        profiles.data.find((x) => x.username === item.createdBy)?.id || null,
      tags: [tagsData.data[0].id, tagsData.data[1].id],
      category: categories.data[i % 2].id,
      deleted: item.deleted,
      status: item.status,
      tenant_id: tenantId,
    })
  }

  const { research } = await seedDatabase(
    {
      research: researchData,
    },
    tenantId,
  )

  // seeding
  for (let i = 0; i < MOCK_DATA.research.length; i++) {
    const researchItem = MOCK_DATA.research[i]

    if (researchItem.updates && researchItem.updates.length) {
      const { research_updates } = await seedDatabase(
        {
          research_updates: researchItem.updates.map((item) => ({
            title: item.title,
            research_id: research.data[i].id,
            description: item.description,
            created_by: profiles.data[0].id,
            is_draft: item.draft || false,
            tenant_id: tenantId,
          })),
        },
        tenantId,
      )

      // Only seed comments for first research
      if (i === 0) {
        const { comments } = await seedComment(
          profiles,
          research_updates,
          'research_update',
        )

        await seedReply(profiles, comments, research)
      }
    }
  }
}
