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

export class Profile {
  id: number
  username: string
  displayName: string
  isVerified: boolean
  isSupporter: boolean
  photoUrl: string
  country: string

  constructor(obj: Profile) {
    Object.assign(this, obj)
  }

  static fromDB(profile: DBProfile) {
    return new Profile({
      id: profile.id,
      username: profile.username,
      country: profile.country,
      displayName: profile.display_name,
      isSupporter: profile.is_supporter,
      isVerified: profile.is_verified,
      photoUrl: profile.photo_url,
    })
  }
}
