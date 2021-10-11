import { loremIpsum } from 'lorem-ipsum'
import { IMapPin, IMapPinDetail } from 'src/models/maps.models'
import { MOCK_DB_META } from './db.mock'
import { MAP_GROUPINGS } from 'src/stores/Maps/maps.groupings'

export const generatePins = (count: number): Array<IMapPin> => {
  const filters = MAP_GROUPINGS
  const newPins = [] as Array<IMapPin>
  for (let i = 0; i < count; i++) {
    const pinType = filters[Math.floor(Math.random() * filters.length)]

    newPins.push({
      ...MOCK_DB_META(),
      location: {
        lat: 51 + (Math.random() * 1000 - 500) / 500,
        lng: 0 + (Math.random() * 1000 - 500) / 250,
      },
      type: pinType.type,
      moderation: 'awaiting-moderation',
    })
  }
  return newPins
}

export const generatePinDetails = (): IMapPinDetail => {
  const randomDate = new Date()
  randomDate.setSeconds(randomDate.getSeconds() - Math.random() * 10000)
  const lastActive = randomDate.toISOString()
  return {
    name: loremIpsum({ count: 2, units: 'words' })
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
    displayName: loremIpsum({ count: 2, units: 'words' })
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
    shortDescription: loremIpsum({ count: 2, units: 'sentences' }),
    lastActive,
    profilePicUrl: 'https://picsum.photos/50/50',
    profileUrl: '/testing',
    heroImageUrl: `https://picsum.photos/seed/${lastActive}/285/175`,
    verifiedBadge: false,
  }
}
