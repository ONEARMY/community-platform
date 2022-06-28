import type { IComment } from './howto.models'

// Re-export all other files for easy access
export * from './common.models'
export * from './events.models'
export * from './howto.models'
export * from './research.models'
export * from './maps.models'
export * from './project.models'
export * from './selectorList.models'
export * from './tags.model'
export * from './user.models'
export * from './user_pp.models'

export interface UserComment extends IComment {
  isEditable: boolean
}
