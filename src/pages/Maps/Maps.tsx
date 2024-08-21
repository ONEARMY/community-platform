import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react'
import { Button } from 'oa-components'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { filterMapPinsByType } from 'src/stores/Maps/filter'
import { MAP_GROUPINGS } from 'src/stores/Maps/maps.groupings'
import { Box, Flex } from 'theme-ui'

import { logger } from '../../logger'
import { transformAvailableFiltersToGroups } from './Content/Controls/transformAvailableFiltersToGroups'
import { MapWithList } from './Content/MapView/MapWithList'
import { NewMapBanner } from './Content/NewMapBanner'
import { GetLocation } from './utils/geolocation'
import { Controls, MapView } from './Content'
import { MapPinServiceContext } from './map.service'

import type { Map } from 'react-leaflet'
import type { ILatLng } from 'shared/models'
import type { IMapPin } from 'src/models/maps.models'

import './styles.css'

const INITIAL_CENTER = { lat: 51.0, lng: 19.0 }
const INITIAL_ZOOM = 3

const MapsPage = observer(() => {
  const [activePinFilters, setActivePinFilters] = useState<string[]>([])
  const [center, setCenter] = useState<ILatLng>(INITIAL_CENTER)
  const [mapPins, setMapPins] = useState<IMapPin[]>([])
  const [selectedPin, setSelectedPin] = useState<IMapPin | null>(null)
  const [showNewMap, setShowNewMap] = useState<boolean>(false)
  const [zoom, setZoom] = useState<number>(INITIAL_ZOOM)

  const { userStore } = useCommonStores().stores
  const navigate = useNavigate()
  const location = useLocation()
  const mapPinService = useContext(MapPinServiceContext)

  const mapRef = React.useRef<Map>(null)
  const newMapRef = React.useRef<Map>(null)
  const user = userStore.activeUser

  if (!mapPinService) {
    return null
  }

  const fetchMapPins = async () => {
    const pins = await mapPinService.getMapPins()
    setMapPins([...mapPins, ...pins])
  }

  useEffect(() => {
    const appendLoggedInUser = async (userName: string = '') => {
      if (!userName) {
        return
      }

      const userMapPin = await mapPinService.getMapPinSelf(userName)

      if (userMapPin && !mapPins.find((pin) => pin._id === userMapPin._id)) {
        setMapPins([...mapPins, userMapPin])
      }
    }

    appendLoggedInUser(user?._id)
  }, [user])

  useEffect(() => {
    if (mapPins.length === 0) fetchMapPins()

    const showPin = async () => {
      await showPinFromURL()

      if (!selectedPin) {
        promptUserLocation()
      }
    }
    showPin()

    return () => {
      setSelectedPin(null)
    }
  }, [])

  const availableFilters = useMemo(() => {
    return transformAvailableFiltersToGroups(mapPins, [
      {
        grouping: 'verified-filter',
        displayName: 'Verified',
        type: 'verified',
      },
      ...MAP_GROUPINGS,
    ])
  }, [mapPins])

  const promptUserLocation = async () => {
    try {
      const position = await GetLocation()
      setCenter({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      })
    } catch (error) {
      logger.error(error)
      // do nothing if location cannot be retrieved
    }
  }

  /**
   * Check current hash in case matches a mappin and try to load
   *
   **/
  const showPinFromURL = async () => {
    const pinId = location.hash.slice(1)
    if (pinId) {
      logger.info(`Fetching map pin by user id: ${pinId}`)
      await getPinByUserId(pinId)
    }
  }

  const getPinByUserId = async (userId: string) => {
    navigate(`/map#${userId}`)

    // First check the mapPins to see if the pin is already
    // partially loaded
    const preLoadedPin = mapPins.find((pin) => pin._id === userId)
    if (preLoadedPin) {
      setCenter(preLoadedPin.location)
      setSelectedPin(preLoadedPin)
    }

    const pin = await mapPinService.getMapPinByUserId(userId)
    if (pin) {
      logger.info(`Fetched map pin by user id`, { userId })
      setCenter(pin.location)
      setSelectedPin(pin)
    } else {
      logger.error(`Failed to fetch map pin by user id`, { userId, pin })
    }
  }

  const visibleMapPins = useMemo(() => {
    return filterMapPinsByType(mapPins, activePinFilters)
  }, [mapPins, activePinFilters])

  return (
    // the calculation for the height is kind of hacky for now, will set properly on final mockups
    <Box id="mapPage" sx={{ height: 'calc(100vh - 80px)', width: '100%' }}>
      <NewMapBanner
        onClick={() => setShowNewMap(!showNewMap)}
        text={
          !showNewMap
            ? "🗺 We're developing new map interface. Test it out!"
            : '🗺 This is our new map interface. Go back to the old one!'
        }
      />
      {!showNewMap && (
        <>
          <Controls
            availableFilters={availableFilters}
            onLocationChange={(latlng) => setCenter(latlng)}
            onFilterChange={(selected) => {
              setActivePinFilters(selected)
            }}
          />
          <MapView
            activePin={selectedPin}
            mapRef={mapRef}
            pins={visibleMapPins}
            onPinClicked={(pin) => {
              getPinByUserId(pin._id)
            }}
            onBlur={() => {
              navigate('/map')
              setSelectedPin(null)
            }}
            center={center}
            zoom={zoom}
            setZoom={setZoom}
          />
        </>
      )}
      {showNewMap && (
        <>
          <Flex
            sx={{
              display: ['none', 'none', 'none', 'inherit'],
              flexDirection: 'row',
              height: '100%',
            }}
          >
            <MapWithList
              activePin={selectedPin}
              mapRef={newMapRef}
              pins={visibleMapPins}
              onPinClicked={(pin) => {
                getPinByUserId(pin._id)
              }}
              onBlur={() => {
                setSelectedPin(null)
              }}
              center={center}
              zoom={zoom}
              setZoom={setZoom}
            />
          </Flex>
          <Box
            sx={{
              display: ['inherit', 'inherit', 'inherit', 'none'],
              padding: 2,
              justifyContent: 'center',
            }}
          >
            Not yet setup of this size screen yet, but we will be very soon!{' '}
            <Button onClick={() => setShowNewMap(!showNewMap)}>
              Back to the old map
            </Button>
          </Box>
        </>
      )}
    </Box>
  )
})

export default MapsPage
