import { createContext } from 'react'
import { logger } from 'src/logger'

import type { MapPin } from 'oa-shared'

export interface IMapPinService {
  getMapPins: () => Promise<MapPin[]>
  getMapPinByUsername: (userName: string) => Promise<MapPin | null>
}

const getMapPins = async () => {
  try {
    const response = await fetch('/api/mappins/')
    const { mapPins } = await response.json()

    return mapPins
  } catch (error) {
    logger.error('Failed to fetch map pins', { error })
    return []
  }
}

const getMapPinByUsername = async (userName: string) => {
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
  getMapPinByUsername,
}
