export class DBProfileTag {
  id: number
  created_at: Date
  name: string
  profile_type: string

  constructor(obj: Partial<ProfileTag>) {
    Object.assign(this, obj)
  }
}

export class ProfileTag {
  id: number
  createdAt: Date
  name: string
  profileType: string

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
