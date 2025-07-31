export class DBProfileBadge {
  id: number
  name: string
  display_name: string
  image_url: string
  action_url: string | null

  constructor(obj: Partial<DBProfileBadge>) {
    Object.assign(this, obj)
  }
}

export class DBProfileBadgeJoin {
  profile_badges: DBProfileBadge

  constructor(obj: Partial<DBProfileBadge>) {
    Object.assign(this, obj)
  }
}

export class ProfileBadge {
  id: number
  name: string
  displayName: string
  imageUrl: string
  actionUrl?: string

  constructor(obj: Partial<ProfileBadge>) {
    Object.assign(this, obj)
  }

  static fromDBJoin(tag: DBProfileBadgeJoin) {
    const value = tag.profile_badges
    return new ProfileBadge({
      id: value.id,
      name: value.name,
      displayName: value.display_name,
      imageUrl: value.image_url,
      actionUrl: value.action_url || undefined,
    })
  }

  static fromDB(value: DBProfileBadge) {
    return new ProfileBadge({
      id: value.id,
      name: value.name,
      displayName: value.display_name,
      imageUrl: value.image_url,
      actionUrl: value.action_url || undefined,
    })
  }
}
