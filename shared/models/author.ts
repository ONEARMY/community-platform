import { ProfileBadge } from './profileBadge'

import type { DBMedia, Image } from './media'
import type { DBProfileBadge, DBProfileBadgeJoin } from './profileBadge'

// TODO: derive from DBProfile - not doing because was causing circular dependencies
export type DBAuthor = {
  readonly id: number
  readonly username: string
  readonly country: string
  readonly display_name: string
  readonly photo: DBMedia | null
  readonly badges?: DBProfileBadgeJoin[] | DBProfileBadge[]
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
      dbAuthor.badges?.map((badge) =>
        badge.profile_badges
          ? ProfileBadge.fromDBJoin(badge)
          : ProfileBadge.fromDBJSONJoin(badge as DBProfileBadge),
      ) || []

    return new Author({
      id: dbAuthor.id,
      country: dbAuthor.country,
      badges,
      displayName: dbAuthor.display_name,
      photo: photo,
      username: dbAuthor.username,
    })
  }
}
