import { createContext } from 'react'
import { logger } from 'src/logger'

import type { MapPin } from 'oa-shared'

export interface IMapPinService {
  getMapPins: () => Promise<MapPin[]>
  getMapPinById: (id: number) => Promise<MapPin | null>
}

const getMapPins = async () => {
  try {
    const response = await fetch('/api/mappins')
    const { mapPins } = await response.json()

    return mapPins
  } catch (error) {
    logger.error('Failed to fetch map pins', { error })
    return []
  }
}

const getMapPinById = async (id: number) => {
  try {
    const response = await fetch('/api/mappins/' + id)
    const { mapPin } = await response.json()

    return mapPin as MapPin
  } catch (error) {
    logger.error('Failed to fetch map pin by user id', { id, error })
    return null
  }
}

export const MapPinServiceContext = createContext<IMapPinService | null>(null)

export const mapPinService: IMapPinService = {
  getMapPins,
  getMapPinById,
}
