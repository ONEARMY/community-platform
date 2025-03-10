export class DBProfile {
  id: number
  username: string
  display_name: string
  is_verified: boolean
  is_supporter: boolean
  photo_url: string
  country: string
  patreon: IPatreonUser
  roles: string[] | null

  constructor(obj: DBProfile) {
    Object.assign(this, obj)
  }
}

export interface IPatreonUserAttributes {
  about: string
  created: string
  email: string
  first_name: string
  full_name: string
  image_url: string
  last_name: string
  thumb_url: string
  url: string
}

export interface IPatreonMembershipAttributes {
  campaign_lifetime_support_cents: number
  currently_entitled_amount_cents: number
  is_follower: boolean
  last_charge_date: string
  last_charge_status: string
  lifetime_support_cents: number
  next_charge_date: string
  note: string
  patron_status: string
  pledge_cadence: string
  pledge_relationship_start: string
  will_pay_amount_cents: number
}

export interface IPatreonTierAttributes {
  amount_cents: number
  created_at: string
  description: string
  edited_at: string
  image_url: string
  patron_count: number
  published: boolean
  published_at: string
  title: string
  url: string
}

interface IPatreonTier {
  id: string
  attributes: IPatreonTierAttributes
}

interface IPatreonMembership {
  id: string
  attributes: IPatreonMembershipAttributes
  tiers: IPatreonTier[]
}

export interface IPatreonUser {
  id: string
  attributes: IPatreonUserAttributes
  link: string
  membership?: IPatreonMembership
}
