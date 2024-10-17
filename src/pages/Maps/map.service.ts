import { createContext } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { API_URL } from 'src/config/config'
import { logger } from 'src/logger'
import { DB_ENDPOINTS } from 'src/models/dbEndpoints'
import { cdnImageUrl } from 'src/utils/cdnImageUrl'
import { firestore } from 'src/utils/firebase'

import type { IMapPin } from 'oa-shared'

export interface IMapPinService {
  getMapPins: (currentUserId?: string) => Promise<IMapPin[]>
  getMapPinByUserId: (userName: string) => Promise<IMapPin | null>
  getMapPinSelf: (userId: string) => Promise<IMapPin | null>
}

const getMapPins = async (currentUserId?: string) => {
  try {
    const response = await fetch(API_URL + '/map-pins')
    const mapPins = await response.json()

    const hasCurrentUserPin = !!mapPins.find(({ _id }) => _id === currentUserId)

    if (currentUserId && !hasCurrentUserPin) {
      const userMapPin = await getMapPinByUserId(currentUserId)
      userMapPin && mapPins.push(userMapPin)
    }

    return _transformCreatorImagesToCND(mapPins)
  } catch (error) {
    logger.error('Failed to fetch map pins', { error })
    return []
  }
}

const getMapPinByUserId = async (userName: string) => {
  try {
    const response = await fetch(API_URL + '/map-pins/' + userName)
    const mapPin = await response.json()

    return mapPin
  } catch (error) {
    logger.error('Failed to fetch map pin by user id', { userName, error })
    return null
  }
}

const getMapPinSelf = async (userId: string) => {
  const collectionRef = collection(firestore, DB_ENDPOINTS.mappins)
  const userMapPinQuery = query(collectionRef, where('_id', '==', userId))
  const queryResults = await getDocs(userMapPinQuery)

  if (!queryResults?.docs) {
    logger.error('Invalid or empty response from query', { userId })
    return null
  }

  const [userMapPin] = queryResults.docs

  if (!userMapPin) {
    logger.error('No map pin found for user', { userId })
    return null
  }

  return userMapPin.data() as IMapPin
}

const _transformCreatorImagesToCND = (pins: IMapPin[]) => {
  return pins.map((pin) => {
    if (!pin.creator) {
      return pin
    }
    return {
      ...pin,
      creator: {
        ...pin.creator,
        ...(pin.creator.coverImage
          ? { coverImage: cdnImageUrl(pin.creator.coverImage, { width: 500 }) }
          : {}),
        ...(pin.creator.userImage
          ? { userImage: cdnImageUrl(pin.creator.userImage, { width: 300 }) }
          : {}),
      },
    }
  })
}

export const MapPinServiceContext = createContext<IMapPinService | null>(null)

export const mapPinService: IMapPinService = {
  getMapPins,
  getMapPinByUserId,
  getMapPinSelf,
}
