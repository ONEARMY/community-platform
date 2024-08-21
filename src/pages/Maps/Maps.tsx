import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { filterMapPinsByType } from 'src/stores/Maps/filter'
import { MAP_GROUPINGS } from 'src/stores/Maps/maps.groupings'
import { Box } from 'theme-ui'

import { logger } from '../../logger'
import { transformAvailableFiltersToGroups } from './Content/Controls/transformAvailableFiltersToGroups'
import { GetLocation } from './utils/geolocation'
import { Controls, MapView } from './Content'
import { MapPinServiceContext } from './map.service'

import type { Map } from 'react-leaflet'
import type { ILatLng } from 'shared/models'
import type { IMapPin } from 'src/models/maps.models'

import './styles.css'

const initialState = {
  center: { lat: 51.0, lng: 19.0 },
  zoom: 3,
  firstLoad: true,
}

const MapsPage = observer(() => {
  const mapRef = React.useRef<Map>(null)
  const location = useLocation()
  const [mapPins, setMapPins] = useState<IMapPin[]>([])
  const [selectedPin, setSelectedPin] = useState<IMapPin | null>(null)
  const { userStore } = useCommonStores().stores
  const [activePinFilters, setActivePinFilters] = useState<string[]>([])
  const user = userStore.activeUser
  const navigate = useNavigate()
  const mapPinService = useContext(MapPinServiceContext)

  const [state, setState] = useState<{
    center: ILatLng
    zoom: number
    firstLoad: boolean
  }>(initialState)

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
    fetchMapPins()

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

  const setCenter = (latlng: ILatLng) => {
    setState((state) => ({
      ...state,
      center: latlng,
      zoom: 8,
      firstLoad: false,
    }))
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
        center={state.center}
        zoom={state.zoom}
      />
    </Box>
  )
})

export default MapsPage
