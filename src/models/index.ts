import type { IComment } from './discussion.models'

export * from './common.models'
export * from './discussion.models'
export * from './howto.models'
export * from './maps.models'
export * from './message.models'
export * from './notifications.models'
export * from './project.models'
export * from './question.models'
export * from './research.models'
export * from './selectorList.models'
export * from './tags.model'
export * from './user.models'
export * from './moderation.model'

export interface UserComment extends IComment {
  isEditable: boolean
}
