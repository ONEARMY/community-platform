import { UserRole } from '@onearmy.apps/shared'

export const RESEARCH_TITLE_MAX_LENGTH = 60
export const RESEARCH_TITLE_MIN_LENGTH = 5
export const RESEARCH_MAX_LENGTH = 1000
export const RESEARCH_EDITOR_ROLES: UserRole[] = [
  UserRole.ADMIN,
  UserRole.RESEARCH_EDITOR,
  UserRole.RESEARCH_CREATOR,
]
export const ITEMS_PER_PAGE = 20
