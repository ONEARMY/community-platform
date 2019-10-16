import { loremIpsum } from 'lorem-ipsum'
import {
  IMapPin,
  IMapPinDetail,
  IPinType,
  EntityType,
} from 'src/models/maps.models'
import { MOCK_DB_META } from './db.mock'
import logo from 'src/assets/images/logo.svg'
import communityBuilder from 'src/assets/icons/map-community.svg'
import machineShop from 'src/assets/icons/map-machine.svg'
import collectionPoint from 'src/assets/icons/map-collection.svg'

export const generatePins = (count: number): Array<IMapPin> => {
  const filters = generatePinFilters()
  const newPins = [] as Array<IMapPin>
  for (let i = 0; i < count; i++) {
    const pinType = filters[Math.floor(Math.random() * filters.length)]

    newPins.push({
      ...MOCK_DB_META(),
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
  const randomDate = new Date()
  randomDate.setSeconds(randomDate.getSeconds() - Math.random() * 10000)
  const lastActive = randomDate.toISOString()
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
      icon: logo,
      count: 0,
    },
    {
      grouping: 'place' as EntityType,
      displayName: 'Injection',
      name: 'injecter',
      icon: logo,
      count: 0,
    },
    {
      grouping: 'place' as EntityType,
      displayName: 'Shredder',
      name: 'shredder',
      icon: logo,
      count: 0,
    },
    {
      grouping: 'place' as EntityType,
      displayName: 'Sheet Press',
      name: 'sheetpress',
      icon: logo,
      count: 0,
    },
    {
      grouping: 'place' as EntityType,
      displayName: 'R & D / Lab',
      name: 'lab',
      icon: logo,
      count: 0,
    },
    {
      grouping: 'individual' as EntityType,
      displayName: 'Member',
      name: 'member',
      icon: collectionPoint,
      count: 0,
      visible: false,
    },
    {
      grouping: 'individual' as EntityType,
      displayName: 'Collection Point',
      name: 'collection-point',
      icon: collectionPoint,
      count: 0,
    },
    {
      grouping: 'individual' as EntityType,
      displayName: 'Machine Shop',
      name: 'machine-builder',
      icon: machineShop,
      count: 0,
    },
    {
      grouping: 'individual' as EntityType,
      displayName: 'Community Point',
      name: 'community-builder',
      icon: communityBuilder,
      count: 0,
    },
  ]
}
