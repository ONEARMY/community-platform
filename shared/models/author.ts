import { ProfileBadge } from './profileBadge'

import type { DBMedia, Image } from './media'
import type { DBProfileBadgeJoin } from './profileBadge'

// TODO: derive from DBProfile - not doing because was causing circular dependencies
export type DBAuthor = {
  readonly id: number
  readonly username: string
  readonly country: string
  readonly display_name: string
  readonly photo: DBMedia | null
  readonly badges?: DBProfileBadgeJoin[]
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
    const badges =
      dbAuthor.badges?.map((badge) => ProfileBadge.fromDBJoin(badge)) || []

    return new Author({
      id: dbAuthor.id,
      country: dbAuthor.country,
      badges,
      displayName: dbAuthor.display_name,
      photo: photo ?? null,
      username: dbAuthor.username,
    })
  }
}
