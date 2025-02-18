import { MOCK_DATA } from '../data'
import { seedDatabase } from './commands'

export const seedCategories = async () => {
  const tenantId = Cypress.env('TENANT_ID')

  return await seedDatabase(
    {
      categories: MOCK_DATA.categoriesSupabase.map((category) => ({
        ...category,
        tenant_id: tenantId,
      })),
    },
    tenantId,
  )
}

export const seedTags = async () => {
  const tenantId = Cypress.env('TENANT_ID')

  return await seedDatabase(
    {
      tags: MOCK_DATA.tagsSupabase.map((category) => ({
        ...category,
        tenant_id: tenantId,
      })),
    },
    tenantId,
  )
}

export const seedQuestions = async (profileData) => {
  const tenantId = Cypress.env('TENANT_ID')
  Cypress.log({
    displayName: 'Seeding database questions for tenant',
    message: tenantId,
  })

  const categoryData = await seedCategories()
  const questionData = await seedDatabase(
    {
      questions: MOCK_DATA.questions.map((question) => ({
        ...question,
        tenant_id: tenantId,
        created_by: profileData.profiles.data[0].id,
        category: categoryData.categories.data[0].id,
      })),
    },
    tenantId,
  )

  const commentData = await seedDatabase(
    {
      comments: [
        {
          tenant_id: tenantId,
          created_at: new Date().toUTCString(),
          comment: 'First comment',
          created_by: profileData.profiles.data[0].id,
          source_type: 'question',
          source_id: questionData.questions.data[0].id,
        },
      ],
    },
    tenantId,
  )

  await seedDatabase(
    {
      comments: [
        {
          tenant_id: tenantId,
          created_at: new Date().toUTCString(),
          comment: 'First Reply',
          created_by: profileData.profiles.data[0].id,
          source_type: 'question',
          source_id: questionData.questions.data[0].id,
          parent_id: commentData.comments.data[0].id,
        },
      ],
    },
    tenantId,
  )
}
