import type { IHowtoDB } from './howto.models'

// Re-export all other files for easy access
export * from './comment.model'
export * from './common.models'
export * from './howto.models'
export * from './research.models'
export * from './maps.models'
export * from './message.models'
export * from './project.models'
export * from './selectorList.models'
export * from './tags.model'
export * from './user.models'
export * from './userPreciousPlastic.models'
export * from './notifications.models'
export * from './question.models'

export type CommentableModel = IHowtoDB
