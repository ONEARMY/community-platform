export class DBProfileTag {
  profile_tags: {
    id: number
    created_at: Date
    name: string
    profile_type: string
  }

  constructor(obj: Partial<DBProfileTag>) {
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
    const value = tag.profile_tags
    return new ProfileTag({
      id: value.id,
      createdAt: new Date(value.created_at),
      name: value.name,
      profileType: value.profile_type,
    })
  }
}
