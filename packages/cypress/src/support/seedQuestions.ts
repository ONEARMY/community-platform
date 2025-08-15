import { MOCK_DATA } from '../data'
import { seedDatabase } from '../utils/TestUtils'
import { seedComment, seedReply } from './seedDiscussions'

export const seedCategories = async (type: string) => {
  const tenantId = Cypress.env('TENANT_ID')

  return await seedDatabase(
    {
      categories: MOCK_DATA.categories.map((category) => ({
        ...category,
        type,
        tenant_id: tenantId,
      })),
    },
    tenantId,
  )
}

export const seedProfileTags = async () => {
  const tenantId = Cypress.env('TENANT_ID')

  const response = await seedDatabase(
    {
      profile_tags: MOCK_DATA.profileTags.map((category) => ({
        ...category,
        tenant_id: tenantId,
      })),
    },
    tenantId,
  )

  return response
}

export const seedProfileTypes = async () => {
  const tenantId = Cypress.env('TENANT_ID')

  const response = await seedDatabase(
    {
      profile_types: MOCK_DATA.profileTypes.map((type) => ({
        ...type,
        tenant_id: tenantId,
      })),
    },
    tenantId,
  )

  return response
}

export const seedTags = async () => {
  const tenantId = Cypress.env('TENANT_ID')

  return await seedDatabase(
    {
      tags: MOCK_DATA.tags.map((category) => ({
        ...category,
        tenant_id: tenantId,
      })),
    },
    tenantId,
  )
}

export const seedQuestions = async (profiles) => {
  const tenantId = Cypress.env('TENANT_ID')
  Cypress.log({
    displayName: 'Seeding database questions for tenant',
    message: tenantId,
  })
  const { categories } = await seedCategories('questions')

  const { questions } = await seedDatabase(
    {
      questions: MOCK_DATA.questions.map((question) => ({
        ...question,
        tenant_id: tenantId,
        created_by: profiles[0].id,
        category: categories.data[0].id,
      })),
    },
    tenantId,
  )

  const { comments } = await seedComment(profiles, questions, 'questions')
  await seedReply(profiles, comments, questions)
}
