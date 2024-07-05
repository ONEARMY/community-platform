/* eslint-disable @typescript-eslint/naming-convention */
export enum UserRole {
  SUPER_ADMIN = 'super-admin',
  SUBSCRIBER = 'subscriber',
  ADMIN = 'admin',
  BETA_TESTER = 'beta-tester',
  RESEARCH_EDITOR = 'research_editor',
  RESEARCH_CREATOR = 'research_creator',
}

export enum ExternalLinkLabel {
  EMAIL = 'email',
  WEBSITE = 'website',
  DISCORD = 'discord',
  BAZAR = 'bazar',
  FORUM = 'forum',
  SOCIAL_MEDIA = 'social media',
}

// See https://docs.patreon.com/?javascript#user-v2
export interface PatreonUserAttributes {
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

// See https://docs.patreon.com/#member
export interface PatreonMembershipAttributes {
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

// See https://docs.patreon.com/#tier
export interface PatreonTierAttributes {
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

interface PatreonTier {
  id: string
  attributes: PatreonTierAttributes
}

interface PatreonMembership {
  id: string
  attributes: PatreonMembershipAttributes
  tiers: PatreonTier[]
}

export interface PatreonUser {
  id: string
  attributes: PatreonUserAttributes
  link: string
  membership?: PatreonMembership
}
