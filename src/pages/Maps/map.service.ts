import { createContext } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { API_URL } from 'src/config/config'
import { logger } from 'src/logger'
import { firestore } from 'src/utils/firebase'

import { DB_ENDPOINTS } from '../../models'

import type { IMapPin } from '../../models'

export interface IMapPinService {
  getMapPins: () => Promise<IMapPin[]>
  getMapPinByUserId: (userName: string) => Promise<IMapPin | null>
  getMapPinSelf: (userId: string) => Promise<IMapPin | null>
}

const getMapPins = async () => {
  try {
    const response = await fetch(API_URL + '/map-pins')
    const mapPins = await response.json()

    return mapPins
  } catch (error) {
    return []
  }
}

const getMapPinByUserId = async (userName: string) => {
  try {
    const response = await fetch(API_URL + '/map-pins/' + userName)
    const mapPin = await response.json()

    return mapPin
  } catch (error) {
    logger.error('Failed to fetch map pins', error)
    return null
  }
}

const getMapPinSelf = async (userId: string) => {
  const collectionRef = collection(firestore, DB_ENDPOINTS.mappins)
  const userMapPinQuery = query(collectionRef, where('_id', '==', userId))
  const queryResults = await getDocs(userMapPinQuery)

  if (!queryResults?.docs) {
    return null
  }

  const [userMapPin] = queryResults.docs

  if (!userMapPin) {
    return null
  }

  return userMapPin.data() as IMapPin
}

export const MapPinServiceContext = createContext<IMapPinService | null>(null)

export const mapPinService: IMapPinService = {
  getMapPins,
  getMapPinByUserId,
  getMapPinSelf,
}
