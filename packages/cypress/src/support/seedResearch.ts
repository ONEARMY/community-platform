import { MOCK_DATA } from '../data'
import { seedDatabase } from '../utils/TestUtils'
import { seedComment, seedReply } from './seedDiscussions'
import { seedCategories } from './seedQuestions'

import type { DBProfile, DBResearchItem } from 'oa-shared'

export const seedResearch = async (profiles: DBProfile[], tagsData) => {
  const tenantId = Cypress.env('TENANT_ID')
  Cypress.log({
    displayName: 'Seeding database research for tenant',
    message: tenantId,
  })

  const { categories } = await seedCategories('research')

  const researchData: Partial<DBResearchItem & { tenant_id: string }>[] = []

  for (let i = 0; i < MOCK_DATA.research.length; i++) {
    const item = MOCK_DATA.research[i]
    const createdBy: number =
      profiles.find((profile) => profile.username === item.created_by_username)
        .id || profiles[0].id

    researchData.push({
      created_at: item.created_at,
      deleted: item.deleted,
      modified_at: item.modified_at,
      description: item.description,
      slug: item.slug,
      previous_slugs: item.previous_slugs,
      title: item.title,
      status: item.status,
      created_by: createdBy,
      is_draft: item.is_draft,
      tags: [tagsData.data[0].id, tagsData.data[1].id],
      category: categories.data[i % 2].id,
      tenant_id: tenantId,
    })
  }

  const { research } = await seedDatabase(
    {
      research: researchData,
    },
    tenantId,
  )

  for (let i = 0; i < MOCK_DATA.research.length; i++) {
    const researchItem = MOCK_DATA.research[i]
    const createdBy =
      profiles.find(
        (profile) => profile.username === researchItem.created_by_username,
      ).id || profiles[0].id

    if (researchItem.updates) {
      const { research_updates } = await seedDatabase(
        {
          research_updates: MOCK_DATA.researchUpdates.map((item) => ({
            created_at: item.created_at,
            deleted: item.deleted,
            description: item.description,
            modified_at: item.modified_at,
            title: item.title,
            research_id: research.data[i].id,
            created_by: createdBy,
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
