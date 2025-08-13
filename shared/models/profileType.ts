export class DBProfileType {
  id: number
  description: string
  display_name: string
  image_url: string
  map_pin_name: string
  name: string
  order: number

  constructor(obj: Partial<DBProfileType>) {
    Object.assign(this, obj)
  }
}

export class ProfileType {
  id: number
  description: string
  displayName: string
  imageUrl: string
  mapPinName: string
  name: string
  order: number

  constructor(obj: Partial<ProfileType>) {
    Object.assign(this, obj)
  }

  static fromDB(value: DBProfileType) {
    return new ProfileType({
      id: value.id,
      description: value.description,
      displayName: value.display_name,
      imageUrl: value.image_url,
      mapPinName: value.map_pin_name,
      name: value.name,
      order: value.order,
    })
  }
}
