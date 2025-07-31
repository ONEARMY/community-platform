export type ProfileCategory = 'member' | 'space'

export class DBProfileTag {
  id: number
  created_at: Date
  name: string
  profile_type: ProfileCategory

  constructor(obj: Partial<DBProfileTag>) {
    Object.assign(this, obj)
  }
}

export class ProfileTag {
  id: number
  createdAt: Date
  name: string
  profileType: ProfileCategory

  constructor(obj: Partial<ProfileTag>) {
    Object.assign(this, obj)
  }

  static fromDB(tag: DBProfileTag) {
    return new ProfileTag({
      id: tag.id,
      createdAt: new Date(tag.created_at),
      name: tag.name,
      profileType: tag.profile_type,
    })
  }
}
