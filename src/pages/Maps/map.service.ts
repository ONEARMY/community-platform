import { collection, getDocs, query, where } from 'firebase/firestore'
import { API_URL } from 'src/config/config'
import { logger } from 'src/logger'
import { firestore } from 'src/utils/firebase'

import { DB_ENDPOINTS } from '../../models'

import type { IMapPin } from '../../models'

const getMapPins = async () => {
  const mapPins = await fetch(API_URL + '/map-pins')
    .then((response) => response.json())
    .catch(() => [])

  return mapPins
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

  const [userMapPin] = (await getDocs(userMapPinQuery)).docs

  if (!userMapPin) {
    return null
  }

  return userMapPin.data() as IMapPin
}

export const mapPinService = {
  getMapPins,
  getMapPinByUserId,
  getMapPinSelf,
}
