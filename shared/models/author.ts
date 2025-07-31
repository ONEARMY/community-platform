import { ProfileBadge } from './profileBadge'

import type { Image } from './media'
import type { DBProfile } from './profile'

export type DBAuthor = Pick<
  DBProfile,
  'id' | 'country' | 'display_name' | 'photo' | 'username' | 'badges'
>
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
