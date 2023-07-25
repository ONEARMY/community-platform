import type { UserRole } from 'oa-shared'

export const RESEARCH_TITLE_MAX_LENGTH = 60
export const RESEARCH_TITLE_MIN_LENGTH = 5
export const RESEARCH_MAX_LENGTH = 1000
export const RESEARCH_EDITOR_ROLES: UserRole[] = [
  'admin',
  'research_editor',
  'research_creator',
]
