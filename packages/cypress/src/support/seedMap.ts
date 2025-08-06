import { MOCK_DATA } from '../data'
import { seedDatabase } from '../utils/TestUtils'

export const seedMap = async (profiles) => {
  const tenantId = Cypress.env('TENANT_ID')
  Cypress.log({
    displayName: 'Seeding database news for tenant',
    message: tenantId,
  })

  const res = await seedDatabase(
    {
      map_pins: MOCK_DATA.mapPins.map((pin, index) => ({
        profile_id: profiles[index].id,
        tenant_id: tenantId,
        ...pin,
      })),
    },
    tenantId,
  )

  console.log(res)
}
