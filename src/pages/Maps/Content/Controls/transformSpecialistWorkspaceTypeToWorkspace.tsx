import { ProfileTypeList } from 'oa-shared'

import type { ProfileTypeName } from 'oa-shared'

type WorkshopProfileType =
  | 'extrusion'
  | 'injection'
  | 'shredder'
  | 'sheetpress'
  | 'mix'

export const transformSpecialistWorkspaceTypeToWorkspace = (
  type: ProfileTypeName | WorkshopProfileType,
): ProfileTypeName =>
  ['extrusion', 'injection', 'shredder', 'sheetpress', 'mix'].includes(type)
    ? ProfileTypeList.WORKSPACE
    : (type as ProfileTypeName)
