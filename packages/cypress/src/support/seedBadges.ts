import { MOCK_DATA } from '../data'
import { seedDatabase } from '../utils/TestUtils'

export const seedBadges = async () => {
  const tenantId = Cypress.env('TENANT_ID')
  Cypress.log({
    displayName: 'Seeding database badged for tenant',
    message: tenantId,
  })

  const response = await seedDatabase(
    {
      profile_badges: MOCK_DATA.badges.map((badge) => ({
        ...badge,
        tenant_id: tenantId,
      })),
    },
    tenantId,
  )

  return response
}
