import { loremIpsum } from 'lorem-ipsum'
import {
  IMapPin,
  IMapPinDetail,
  IPinType,
  IDatabaseMapPin,
  EntityType,
} from 'src/models/maps.models'
import { DB_META_MOCK } from './database.mock'

export const generatePins = (count: number): Array<IDatabaseMapPin> => {
  const filters = generatePinFilters()
  const newPins = [] as Array<IDatabaseMapPin>
  for (let i = 0; i < count; i++) {
    const pinType = filters[Math.floor(Math.random() * filters.length)]

    newPins.push({
      ...DB_META_MOCK,
      location: {
        address: 'testing',
        lat: 51 + (Math.random() * 1000 - 500) / 500,
        lng: 0 + (Math.random() * 1000 - 500) / 250,
      },
      pinType: pinType.name,
    })
  }
  return newPins
}

export const generatePinDetails = (pin: IMapPin): IMapPinDetail => {
  const lastActive = new Date()
  lastActive.setSeconds(lastActive.getSeconds() - Math.random() * 10000)
  return {
    ...pin,
    name: loremIpsum({ count: 2, units: 'words' })
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
    shortDescription: loremIpsum({ count: 2, units: 'sentences' }),
    lastActive,
    profilePicUrl: 'https://picsum.photos/50/50',
    profileUrl: '/testing',
    heroImageUrl: 'https://picsum.photos/285/175',
  }
}

export const generatePinFilters = (): Array<IPinType> => {
  return [
    {
      grouping: 'place' as EntityType,
      displayName: 'Extruder',
      name: 'extruder',
      icon: 'E',
      count: 0,
    },
    {
      grouping: 'place' as EntityType,
      displayName: 'Injection',
      name: 'injecter',
      icon: 'I',
      count: 0,
    },
    {
      grouping: 'place' as EntityType,
      displayName: 'Shredder',
      name: 'shredder',
      icon: 'S',
      count: 0,
    },
    {
      grouping: 'place' as EntityType,
      displayName: 'Sheet Press',
      name: 'sheetPresser',
      icon: 'P',
      count: 0,
    },
    {
      grouping: 'place' as EntityType,
      displayName: 'R & D / Lab',
      name: 'lab',
      icon: 'R',
      count: 0,
    },
    {
      grouping: 'individual' as EntityType,
      displayName: 'Community Builder',
      name: 'communityBuilder',
      icon: 'C',
      count: 0,
    },
    {
      grouping: 'individual' as EntityType,
      displayName: 'Member',
      name: 'member',
      icon: '',
      count: 0,
    },
    {
      grouping: 'individual' as EntityType,
      displayName: 'Machine Builder',
      name: 'machineBuilder',
      icon: 'M',
      count: 0,
    },
  ]
}
