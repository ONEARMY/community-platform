import type { IMapGrouping } from 'src/models/maps.models'
import { getSupportedProfileTypes } from 'src/modules/profile'
import Workspace from 'src/pages/User/workspace/Workspace'

// grouping used (icons will be generated from type in method below)
const GROUPINGS: IMapGrouping[] = [
  {
    grouping: 'place',
    displayName: 'Extrusion',
    type: 'workspace',
    subType: 'extrusion',
    icon: '',
  },
  {
    grouping: 'place',
    displayName: 'Injection',
    type: 'workspace',
    subType: 'injection',
    icon: '',
  },
  {
    grouping: 'place',
    displayName: 'Shredder',
    type: 'workspace',
    subType: 'shredder',
    icon: '',
  },
  {
    grouping: 'place',
    displayName: 'Sheetpress',
    type: 'workspace',
    subType: 'sheetpress',
    icon: '',
  },
  {
    grouping: 'place',
    displayName: 'Mix',
    type: 'workspace',
    subType: 'mix',
    icon: '',
  },
  {
    grouping: 'individual',
    displayName: 'Collection Point',
    type: 'collection-point',
    icon: '',
  },
  {
    grouping: 'individual',
    displayName: 'Machine Shop',
    type: 'machine-builder',
    icon: '',
  },
  {
    grouping: 'individual',
    displayName: 'Community Point',
    type: 'community-builder',
    icon: '',
  },
  {
    grouping: 'individual',
    displayName: 'Want to get started',
    type: 'member',
    icon: '',
  },
  {
    grouping: 'individual',
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
