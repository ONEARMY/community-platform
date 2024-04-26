import { collection, getDocs, query, where } from 'firebase/firestore'
import { firestore } from 'src/utils/firebase'

import { DB_ENDPOINTS } from '../../models'

import type { IMapPin } from '../../models'

// Load map pins base from environment configuration
const API_BASE_URL = 'https://experiment-0424-sze2iv2xoq-lm.a.run.app'

const getMapPins = async (loggedInUserName) => {
  // TODO: Introduce error handling
  const mapPins = await fetch(API_BASE_URL + '/map-pins').then((response) =>
    response.json(),
  )

  // Include query for logged in user's pin
  // eslint-disable-next-line no-console
  console.log('mapPins', { loggedInUserName })

  return mapPins
}

const getMapPinByUserId = async (userName: string, isLoggedIn: boolean) => {
  // eslint-disable-next-line no-console
  console.log('getMapPinByUserId', { userName, isLoggedIn })
  const collectionRef = collection(firestore, DB_ENDPOINTS.mappins)

  const userMapPinQuery = query(collectionRef, where('userId', '==', userName))
  // eslint-disable-next-line no-console

  const [userMapPin] = (await getDocs(userMapPinQuery)).docs

  if (!userMapPin) {
    return null
  }

  return userMapPin.data() as IMapPin
}

export const mapPinService = {
  getMapPins,
  getMapPinByUserId,
}
