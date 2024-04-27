import { collection, getDocs, query, where } from 'firebase/firestore'
import { API_URL } from 'src/config/config'
import { firestore } from 'src/utils/firebase'

import { DB_ENDPOINTS } from '../../models'

import type { IMapPin } from '../../models'

const getMapPins = async (loggedInUserName) => {
  // TODO: Introduce error handling
  const mapPins = await fetch(API_URL + '/map-pins').then((response) =>
    response.json(),
  )

  // Include query for logged in user's pin
  // eslint-disable-next-line no-console
  console.log('mapPins', { loggedInUserName })

  return mapPins
}

const getMapPinByUserId = async (userName: string, isLoggedIn: boolean) => {
  if (!isLoggedIn) {
    const mapPin = await fetch(API_URL + '/map-pins/' + userName).then(
      (response) => response.json(),
    )
    return mapPin
  }

  const collectionRef = collection(firestore, DB_ENDPOINTS.mappins)

  const userMapPinQuery = query(collectionRef, where('_id', '==', userName))

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
