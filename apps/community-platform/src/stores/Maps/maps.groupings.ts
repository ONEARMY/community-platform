import { IPinGrouping } from '@onearmy.apps/shared'

import { getSupportedProfileTypes } from '../../modules/profile'
import Workspace from '../../pages/User/workspace/Workspace'

import type { IMapGrouping } from '../../models/maps.models'

// grouping used (icons will be generated from type in method below)
const GROUPINGS: IMapGrouping[] = [
  {
    grouping: IPinGrouping.PLACE,
    displayName: 'Extrusion',
    type: 'workspace',
    subType: 'extrusion',
    icon: '',
  },
  {
    grouping: IPinGrouping.PLACE,
    displayName: 'Injection',
    type: 'workspace',
    subType: 'injection',
    icon: '',
  },
  {
    grouping: IPinGrouping.PLACE,
    displayName: 'Shredder',
    type: 'workspace',
    subType: 'shredder',
    icon: '',
  },
  {
    grouping: IPinGrouping.PLACE,
    displayName: 'Sheetpress',
    type: 'workspace',
    subType: 'sheetpress',
    icon: '',
  },
  {
    grouping: IPinGrouping.PLACE,
    displayName: 'Mix',
    type: 'workspace',
    subType: 'mix',
    icon: '',
  },
  {
    grouping: IPinGrouping.INDIVIDUAL,
    displayName: 'Collection Point',
    type: 'collection-point',
    icon: '',
  },
  {
    grouping: IPinGrouping.INDIVIDUAL,
    displayName: 'Machine Shop',
    type: 'machine-builder',
    icon: '',
  },
  {
    grouping: IPinGrouping.INDIVIDUAL,
    displayName: 'Community Point',
    type: 'community-builder',
    icon: '',
  },
  {
    grouping: IPinGrouping.INDIVIDUAL,
    displayName: 'Want to get started',
    type: 'member',
    icon: '',
  },
  {
    grouping: IPinGrouping.INDIVIDUAL,
    displayName: 'Space',
    type: 'space',
    icon: '',
  },
]

const supportedProfileTypes = getSupportedProfileTypes().map(
  ({ label }) => label,
)

// merge groupings with icons above for export
export const MAP_GROUPINGS = GROUPINGS.map((g) => ({
  ...g,
  icon: Workspace.findWorkspaceBadge(g.type, true),
})).filter(({ type }) => supportedProfileTypes.includes(type))
