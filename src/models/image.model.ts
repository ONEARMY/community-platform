export class DBImage {
  id: string
  path: string
  fullPath: string

  constructor(obj: DBImage) {
    Object.assign(this, obj)
  }
}

export class Image {
  id: string
  path: string
  fullPath: string

  constructor(obj: Image) {
    Object.assign(this, obj)
  }

  static fromDB(obj: DBImage) {
    const apiUrl = process?.env?.SUPABASE_API_URL
    return new Image({
      id: obj.id,
      path: obj.path,
      fullPath: apiUrl + '/storage/v1/object/public/' + obj.fullPath,
    })
  }
}
