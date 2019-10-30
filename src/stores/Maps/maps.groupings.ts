import { IPinType, IPinGrouping } from 'src/models/maps.models'
import LogoWorkspace from 'src/assets/icons/map-workspace.svg'
import LogoCollection from 'src/assets/icons/map-collection.svg'
import LogoMember from 'src/assets/icons/map-member.svg'
import LogoMachine from 'src/assets/icons/map-machine.svg'
import LogoCommunity from 'src/assets/icons/map-community.svg'

// define icons used for different groupings
// TODO - ideally icons should be pulled from storage and linked simply with grouping name
const MAP_ICONS = {
  extruder: LogoWorkspace,
  injecter: LogoWorkspace,
  shredder: LogoWorkspace,
  sheetpress: LogoWorkspace,
  lab: LogoWorkspace,
  member: LogoMember,
  'collection-point': LogoCollection,
  'machine-builder': LogoMachine,
  'community-builder': LogoCommunity,
}

// grouping used (icons will be generated from name in method below)
const GROUPINGS = [
  {
    grouping: 'place',
    displayName: 'Extruder',
    name: 'extruder',
    count: 0,
  },
  {
    grouping: 'place',
    displayName: 'Injection',
    name: 'injecter',
    count: 0,
  },
  {
    grouping: 'place',
    displayName: 'Shredder',
    name: 'shredder',
    count: 0,
  },
  {
    grouping: 'place',
    displayName: 'Sheet Press',
    name: 'sheetpress',
    count: 0,
  },
  {
    grouping: 'place',
    displayName: 'R & D / Lab',
    name: 'lab',
    count: 0,
  },
  {
    grouping: 'individual',
    displayName: 'Member',
    name: 'member',
    count: 0,
    visible: false,
  },
  {
    grouping: 'individual',
    displayName: 'Collection Point',
    name: 'collection-point',
    count: 0,
  },
  {
    grouping: 'individual',
    displayName: 'Machine Shop',
    name: 'machine-builder',
    count: 0,
  },
  {
    grouping: 'individual',
    displayName: 'Community Point',
    name: 'community-builder',
    count: 0,
  },
]
export const MAP_GROUPINGS: IPinType[] = GROUPINGS.map(g => ({
  ...g,
  grouping: g.grouping as IPinGrouping,
  icon: getIcon(g.name),
}))

function getIcon(name: string): string {
  if (MAP_ICONS.hasOwnProperty(name)) {
    return MAP_ICONS[name]
  } else {
    // return default icon and log for reference
    console.log(
      `%c No map icon for [${name}] \n Maybe you should add one?`,
      'background: #222; color: #bada55',
    )
    return 'assets/icons/map-marker.png'
  }
}
