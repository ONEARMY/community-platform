import * as functions from 'firebase-functions'
import { isSupporter } from './patreon'
import { PatreonUser } from '@onearmy.apps/shared'

jest.mock('../config/config', () => ({
  CONFIG: {
    deployment: {
      site_url: 'https://community.preciousplastic.com',
    },
    integrations: {
      patreon_client_id: '123456789',
      patreon_client_secret: '123456789',
    },
  },
}))

const mockPatreronUserFactory = (
  patronStatus: string,
  tierIds: string[],
): PatreonUser => ({
  id: '123456789',
  attributes: {
    about: '',
    created: '',
    email: '',
    first_name: '',
    full_name: '',
    image_url: '',
    last_name: '',
    thumb_url: '',
    url: '',
  },
  link: '',
  membership: {
    id: '123456789',
    attributes: {
      campaign_lifetime_support_cents: 0,
      currently_entitled_amount_cents: 0,
      is_follower: false,
      last_charge_date: '',
      last_charge_status: '',
      lifetime_support_cents: 0,
      next_charge_date: '',
      note: '',
      patron_status: patronStatus,
      pledge_cadence: '',
      pledge_relationship_start: '',
      will_pay_amount_cents: 0,
    },
    tiers: tierIds.map((id) => ({
      id,
      attributes: {
        amount_cents: 0,
        created_at: '',
        description: '',
        edited_at: '',
        image_url: '',
        patron_count: 0,
        published: false,
        published_at: '',
        title: '',
        url: '',
      },
    })),
  },
})

describe('isSupporter', () => {
  it('should return true for an active supporter of a onearmy tier', () => {
    const patreonUser = mockPatreronUserFactory('active_patron', ['6369370'])
    expect(isSupporter(patreonUser)).toBe(true)
  })

  it('should return true for an active supporter of a platform tier', () => {
    const patreonUser = mockPatreronUserFactory('active_patron', ['9413328'])
    expect(isSupporter(patreonUser)).toBe(true)
  })

  it('should return false for an active supporter of a platform tier on a different site', () => {
    const patreonUser = mockPatreronUserFactory('active_patron', ['9413287'])
    expect(isSupporter(patreonUser)).toBe(false)
  })

  it('should return false for a non-active supporter', () => {
    const patreonUser = mockPatreronUserFactory('declined_patron', ['3929404'])
    expect(isSupporter(patreonUser)).toBe(false)
  })
})
