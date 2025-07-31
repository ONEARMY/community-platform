import { ProfileBadge } from './profileBadge'

import type { Image } from './media'
import type { DBProfileBadgeJoin } from './profileBadge'

// TODO: derive from DBProfile - not doing because was causing circular dependencies
export type DBAuthor = {
  id: number
  country: string
  display_name: string
  photo: string
  username: string
  badges: DBProfileBadgeJoin[]
}
export class Author {
  id: number
  country?: string
  displayName: string
  badges?: ProfileBadge[]
  photo: Image | null
  username: string

  constructor(author: Author) {
    Object.assign(this, author)
  }

  static fromDB(dbAuthor: DBAuthor, photo?: Image) {
    return new Author({
      id: dbAuthor.id,
      country: dbAuthor.country,
      badges:
        dbAuthor.badges?.map((x) => ProfileBadge.fromDBJoin(x)) || undefined,
      displayName: dbAuthor.display_name,
      photo: photo,
      username: dbAuthor.username,
    })
  }
}
