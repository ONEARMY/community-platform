export class DBProfile {
  id: number
  username: string
  display_name: string
  is_verified: boolean
  photo_url: string
  country: string
  roles: string[] | null

  constructor(obj: DBProfile) {
    Object.assign(this, obj)
  }
}
