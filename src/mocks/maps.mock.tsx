import { IMapPin } from 'src/models/maps.models'

const eTypes = ['shredder', 'extruder', 'injector', 'research', 'press']
const iTypes = ['community', 'member', 'builder']

export const generatePins = (count: number): Array<IMapPin> => {
  const newPins = [] as Array<IMapPin>
  for (let i = 0; i < count; i++) {
    const entityType = Math.random() < 0.5 ? 'place' : 'individual'
    const pinType =
      entityType === 'place'
        ? eTypes[Math.floor(Math.random() * eTypes.length)]
        : iTypes[Math.floor(Math.random() * iTypes.length)]

    newPins.push({
      id: '' + Math.random(),
      location: {
        address: 'testing',
        lat: 51 + (Math.random() * 1000 - 500) / 500,
        lng: 0 + (Math.random() * 1000 - 500) / 250,
      },
      entityType,
      pinType,
    })
  }
  return newPins
}
