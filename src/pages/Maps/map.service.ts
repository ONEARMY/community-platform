import { createContext } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { API_URL } from 'src/config/config'
import { logger } from 'src/logger'
import { DB_ENDPOINTS } from 'src/models/dbEndpoints'
import { firestore } from 'src/utils/firebase'

import type { IMapPin } from 'oa-shared'

export interface IMapPinService {
  getMapPins: () => Promise<IMapPin[]>
  getMapPinByUserId: (userName: string) => Promise<IMapPin | null>
}

const getMapPins = async () => {
  try {
    const response = await fetch('/api/mappins/')
    const { mapPins } = await response.json()

    return mapPins
  } catch (error) {
    logger.error('Failed to fetch map pins', { error })
    return null
  }
}

const getMapPinByUserId = async (userName: string) => {
  try {
    const response = await fetch('/api/mappins/' + userName)
    const { mapPin } = await response.json()

    return mapPin
  } catch (error) {
    logger.error('Failed to fetch map pin by user id', { userName, error })
    return null
  }
}

export const MapPinServiceContext = createContext<IMapPinService | null>(null)

export const mapPinService: IMapPinService = {
  getMapPins,
  getMapPinByUserId,
}
