import type { IPatreonUser } from './patreon'

export class DBProfile {
  id: number
  username: string
  display_name: string
  is_verified: boolean
  is_supporter: boolean
  photo_url: string
  country: string
  patreon?: IPatreonUser
  roles: string[] | null

  constructor(obj: DBProfile) {
    Object.assign(this, obj)
  }
}
