export class DBAuthor {
  readonly id: number
  readonly firebase_auth_id: string
  readonly display_name: string
  readonly username: string
  readonly photo_url: string
  readonly country: string
  readonly is_verified: boolean
  readonly is_supporter: boolean

  constructor(obj: DBAuthor) {
    Object.assign(this, obj)
  }
}

export class Author {
  id: number
  name: string
  username: string
  firebaseAuthId: string
  photoUrl: string
  country: string
  isVerified: boolean
  isSupporter: boolean

  constructor(obj: Author) {
    Object.assign(this, obj)
  }

  static fromDB(obj: DBAuthor) {
    return new Author({
      id: obj.id,
      name: obj.display_name,
      username: obj.username,
      firebaseAuthId: obj.firebase_auth_id,
      photoUrl: obj.photo_url,
      isVerified: obj.is_verified,
      isSupporter: obj.is_supporter,
      country: obj.country,
    })
  }
}
