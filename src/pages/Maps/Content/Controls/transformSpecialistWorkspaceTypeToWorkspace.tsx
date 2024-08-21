import { ProfileTypeList } from 'oa-shared'

import type { IProfileTypeName } from 'oa-shared'

export const transformSpecialistWorkspaceTypeToWorkspace = (
  type: string,
): IProfileTypeName =>
  ['extrusion', 'injection', 'shredder', 'sheetpress', 'mix'].includes(type)
    ? ProfileTypeList.WORKSPACE
    : (type as IProfileTypeName)
