import type { DBMedia, Image } from './media'

export class DBAuthor {
  readonly id: number
  readonly country?: string
  readonly display_name: string
  readonly is_supporter: boolean
  readonly is_verified: boolean
  readonly photo: DBMedia | null
  readonly username: string

  constructor(dbAuthor: DBAuthor) {
    Object.assign(this, dbAuthor)
  }
}

export class Author {
  id: number
  country?: string
  displayName: string
  isVerified: boolean
  isSupporter: boolean
  photo: Image | null
  username: string

  constructor(author: Author) {
    Object.assign(this, author)
  }

  static fromDB(dbAuthor: DBAuthor, photo: Image) {
    return new Author({
      id: dbAuthor.id,
      country: dbAuthor.country,
      isSupporter: dbAuthor.is_supporter,
      isVerified: dbAuthor.is_verified,
      displayName: dbAuthor.display_name,
      photo: photo,
      username: dbAuthor.username,
    })
  }
}
