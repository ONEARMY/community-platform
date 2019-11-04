import { IMapGrouping, IMapPinType } from 'src/models/maps.models'
import LogoWorkspace from 'src/assets/icons/map-workspace.svg'
import LogoCollection from 'src/assets/icons/map-collection.svg'
import LogoMember from 'src/assets/icons/map-member.svg'
import LogoMachine from 'src/assets/icons/map-machine.svg'
import LogoCommunity from 'src/assets/icons/map-community.svg'

export const MAP_ICONS: { [key in IMapPinType]: string } = {
  'collection-point': LogoCollection,
  'community-builder': LogoCommunity,
  'machine-builder': LogoMachine,
  member: LogoMember,
  workspace: LogoWorkspace,
  extrusion: LogoWorkspace,
  injection: LogoWorkspace,
  mix: LogoWorkspace,
  sheetpress: LogoWorkspace,
  shredder: LogoWorkspace,
}

// grouping used (icons will be generated from type in method below)
const GROUPINGS: IMapGrouping[] = [
  {
    grouping: 'place',
    displayName: 'Extruder',
    type: 'extrusion',
    icon: '',
  },
  {
    grouping: 'place',
    displayName: 'Injection',
    type: 'injection',
    icon: '',
  },
  {
    grouping: 'place',
    displayName: 'Shredder',
    type: 'shredder',
    icon: '',
  },
  {
    grouping: 'place',
    displayName: 'Sheet Press',
    type: 'sheetpress',
    icon: '',
  },
  {
    grouping: 'place',
    displayName: 'Mix',
    type: 'mix',
    icon: '',
  },

  {
    grouping: 'individual',
    displayName: 'Member',
    type: 'member',
    hidden: true,
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
]

// merge groupings with icons above for export
export const MAP_GROUPINGS = GROUPINGS.map(g => ({
  ...g,
  icon: MAP_ICONS[g.type],
}))
