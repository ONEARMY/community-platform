import { IMapPin } from '../../types'
import { GROUPINGS} from './legacy.maps.groupings'

const randomID = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let autoId = ''
  for (let i = 0; i < 20; i++) {
    autoId += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return autoId
}

const getRandom = ():IMapPin => {
  return {
    _id: randomID(),
    _createdBy: 'testing',
    location: {
      lat: 48 + (Math.random() * 1000 - 500) / 500,
      lng: 4 + (Math.random() * 10 ) + (Math.random() * 1000 - 500) / 250,
    },
    type: 'collection-point',
    moderation: 'awaiting-moderation'
  }
}

export const getFixedTestsPins = () : IMapPin[] => {
  const types = [{type: 'collection-point'}, {type: 'workspace', subType: 'mix'} ]
  const newPins: IMapPin[] = types.map(t => {
    return Object.assign({}, getRandom(), t)
  })
  return newPins
}

export const getRandomTestsPins = (count: number) : IMapPin[] => {
  const filters = GROUPINGS
  const subTypes = filters.filter(g => g.subType).map(g => g.subType)
  const newPins: IMapPin[] = []
  for (let i = 0; i < count; i++) {
    const pinType = filters[Math.floor(Math.random() * filters.length)]
    const newPin:IMapPin = Object.assign({}, getRandom(), {type: pinType.type})
    if (newPin.type === 'workspace'){
      newPin.subType = subTypes[Math.floor(Math.random() * subTypes.length)]
    } 
    newPins.push(newPin)
  }
  
  return newPins
}
