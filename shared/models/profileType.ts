export class DBProfileType {
  id: number
  description: string
  display_name: string
  image_url: string
  small_image_url: string
  map_pin_name: string
  name: string
  order: number
  is_space: boolean

  constructor(obj: Partial<DBProfileType>) {
    Object.assign(this, obj)
  }
}

export class ProfileType {
  id: number
  description: string
  displayName: string
  imageUrl: string
  smallImageUrl: string
  mapPinName: string
  name: string
  order: number
  isSpace: boolean

  constructor(obj: Partial<ProfileType>) {
    Object.assign(this, obj)
  }

  static fromDB(value: DBProfileType) {
    return new ProfileType({
      id: value.id,
      description: value.description,
      displayName: value.display_name,
      imageUrl: value.image_url,
      smallImageUrl: value.small_image_url,
      mapPinName: value.map_pin_name,
      name: value.name,
      order: value.order,
      isSpace: value.is_space,
    })
  }
}
