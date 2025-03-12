export type PatreonTier = {
  id: string
  name: string
  description: string
}

export type PatreonSettings = {
  id: string
  created_at: Date
  tiers: PatreonTier[]
  tenant_id: string
}
