import { json } from '@remix-run/node'
import { cdnImageUrl } from 'src/utils/cdnImageUrl'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { firestore } from 'src/utils/firebase'
import { DB_ENDPOINTS } from 'src/models/dbEndpoints'
import Keyv from 'keyv'

import type { IMapPin } from 'oa-shared'

const cache = new Keyv<IMapPin[]>({ ttl: 600000 }) // ttl: 10 minutes

// runs on the server
export const loader = async () => {
  const cachedMappins = await cache.get('mappins')

  // check if cached map pins are availbe, if not - load from db and cache them
  if (cachedMappins) {
    return json({ mapPins: cachedMappins })
  } else {
    const collectionRef = collection(firestore, DB_ENDPOINTS.mappins)
    const userMapPinQuery = query(
      collectionRef,
      where('_deleted', '==', false),
      where('moderation', '==', 'accepted'),
    )

    const queryResults = await getDocs(userMapPinQuery)

    const mapPins: IMapPin[] = []
    queryResults.forEach((doc) => {
      mapPins.push(doc.data() as IMapPin)
    })
    const mapPinsWithCDN = _transformCreatorImagesToCND(mapPins)

    cache.set('mappins', mapPinsWithCDN)
    return json({ mapPins: mapPinsWithCDN })
  }
}

export const action = async ({ request }) => {
  const method = request.method
  switch (method) {
    case 'POST':
      // Create new map pin
      cache.delete('mappins') // delete cache - forced to reload from db
      return json({ message: 'Created a map pin' })
    case 'PUT':
      // Edit existing map pin
      cache.delete('mappins') // delete cache - forced to reload from db
      return json({ message: 'Updated a map pin' })
    case 'DELETE':
      // Delete a map pin
      cache.delete('mappins') // delete cache - forced to reload from db
      return json({ message: 'Deleted a map pin' })
    default:
      return json({ message: 'Method Not Allowed' }, { status: 405 })
  }
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
