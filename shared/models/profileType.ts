export class DBProfileType {
  id: number
  name: string
  display_name: string
  order: number
  image_url: string

  constructor(obj: Partial<DBProfileType>) {
    Object.assign(this, obj)
  }
}

export class ProfileType {
  id: number
  name: string
  displayName: string
  order: number
  imageUrl: string

  constructor(obj: Partial<ProfileType>) {
    Object.assign(this, obj)
  }

  static fromDB(value: DBProfileType) {
    return new ProfileType({
      id: value.id,
      name: value.name,
      displayName: value.display_name,
      order: value.order,
      imageUrl: value.image_url,
    })
  }
}
