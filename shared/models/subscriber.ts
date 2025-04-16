import type { ContentType } from './common'

export class DBSubscriber {
  id: number
  createdAt: Date
  user_id: number
  content_id: number
  content_type: ContentType
}
