import { collection, getDocs, query, where } from 'firebase/firestore'
import { API_URL } from 'src/config/config'
import { firestore } from 'src/utils/firebase'

import { DB_ENDPOINTS } from '../../models'

import type { IMapPin } from '../../models'

const getMapPins = async () => {
  const mapPins = await fetch(API_URL + '/map-pins').then((response) =>
    response.json(),
  ).catch(() => [])

  return mapPins
}

const getMapPinByUserId = async (userName: string, isLoggedIn: boolean) => {
  if (!isLoggedIn) {
    const mapPin = await fetch(API_URL + '/map-pins/' + userName).then(
      (response) => response.json(),
    ).catch(() => null)
    return mapPin
  }

  // TODO: For logged in users when fetching their own
  // pin we want to fetch directly from firestore and bypass
  // the moderation status.
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
