import { MOCK_DATA } from '../data'
import { seedDatabase } from './commands'

export const seedQuestionComments = async () => {
  const tenantId = Cypress.env('TENANT_ID')
  Cypress.log({
    displayName: 'Seeding database question with comments for tenant',
    message: tenantId,
  })

  const profileData = await seedDatabase(
    {
      profiles: [
        {
          firebase_auth_id: 'demo_user',
          username: 'demo_user',
          tenant_id: tenantId,
          created_at: new Date().toUTCString(),
          display_name: 'Demo User',
          is_verified: false,
        },
      ],
    },
    tenantId,
  )
  const questionData = await seedDatabase(
    {
      questions: [
        {
          ...MOCK_DATA.questions[0],
          tenant_id: tenantId,
          created_by: profileData.profiles.data[0].id,
        },
      ],
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

  return commentData
}

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

export const seedQuestions = async () => {
  const tenantId = Cypress.env('TENANT_ID')
  Cypress.log({
    displayName: 'Seeding database questions for tenant',
    message: tenantId,
  })

  const profileData = await seedDatabase(
    {
      profiles: [
        {
          firebase_auth_id: 'demo_user',
          username: 'demo_user',
          tenant_id: tenantId,
          created_at: new Date().toUTCString(),
          display_name: 'Demo User',
          is_verified: false,
        },
      ],
    },
    tenantId,
  )
  const categoryData = await seedCategories()
  await seedDatabase(
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
}
