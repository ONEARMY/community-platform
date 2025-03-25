import { DBDocSB, Doc } from './document'

import type { ContentType } from './contentType'
import type { IPatreonUser } from './patreon'

export class DBProfile {
  id: number
  username: string
  display_name: string
  is_verified: boolean
  is_supporter: boolean
  photo_url: string
  country: string
  patreon?: IPatreonUser
  roles: string[] | null
  notifications: DBNotification[]

  constructor(obj: DBProfile) {
    Object.assign(this, obj)
  }
}

// Notifications here to avoid circular dependencies
//
export class DBNotification extends DBDocSB {
  readonly owned_by: DBProfile
  readonly triggered_by: DBProfile
  readonly read: boolean
  readonly content_type: string
  readonly action_type: string
  readonly source_id: number
  // more

  static toDB(obj: Notification) {
    return new DBNotification({
      id: obj.id,
      created_at: new Date(obj.createdAt),
    })
  }
}

export class Notification extends Doc {
  actionType: ActionType
  contentType: ContentType
  sourceId: number
  ownedBy: any

  static fromDB(obj: DBNotification) {
    return new Notification({
      id: obj.id,
      createdAt: new Date(obj.created_at),
    })
  }
}

type ActionType = 'new'

export type NewNotificationData = {
  actionType: ActionType
  contentType: ContentType
  ownedBy: number
  sourceId: number
  triggeredBy: number
}
