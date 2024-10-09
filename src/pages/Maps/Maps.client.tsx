import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { filterMapPinsByType } from 'src/stores/Maps/filter'
import { MAP_GROUPINGS } from 'src/stores/Maps/maps.groupings'
import { Box } from 'theme-ui'

import { logger } from '../../logger'
import { transformAvailableFiltersToGroups } from './Content/Controls/transformAvailableFiltersToGroups'
import { MapWithList } from './Content/MapView/MapWithList'
import { NewMapBanner } from './Content/NewMapBanner'
import { GetLocation } from './utils/geolocation'
import { Controls, MapView } from './Content'
import { MapPinServiceContext } from './map.service'

import type { ILatLng, IMapPin } from 'oa-shared'
import type { Map } from 'react-leaflet'

import './styles.css'

const INITIAL_CENTER = { lat: 51.0, lng: 19.0 }
const INITIAL_ZOOM = 3

const MapsPage = observer(() => {
  const [activePinFilters, setActivePinFilters] = useState<string[]>([])
  const [center, setCenter] = useState<ILatLng>(INITIAL_CENTER)
  const [mapPins, setMapPins] = useState<IMapPin[]>([])
  const [notification, setNotification] = useState<string>('')
  const [selectedPin, setSelectedPin] = useState<IMapPin | null>(null)
  const [showNewMap, setShowNewMap] = useState<boolean>(false)
  const [zoom, setZoom] = useState<number>(INITIAL_ZOOM)

  const { userStore } = useCommonStores().stores
  const navigate = useNavigate()
  const location = useLocation()
  const mapPinService = useContext(MapPinServiceContext)

  const mapRef = useRef<Map>(null)
  const newMapRef = useRef<Map>(null)
  const user = userStore.activeUser

  if (!mapPinService) {
    return null
  }

  useEffect(() => {
    if (!selectedPin) {
      promptUserLocation()
    }
  }, [])

  useEffect(() => {
    const fetchMapPins = async () => {
      setNotification('Loading...')
      try {
        const pins = await mapPinService.getMapPins(user?._id)
        setMapPins(pins)
        setNotification('')
      } catch(error) {
        setNotification(error)
      }
    }
    
    fetchMapPins()
  }, [])

  useEffect(() => {
    const pinId = location.hash.slice(1)
    if (pinId.length > 0) {
      if (selectedPin) setSelectedPin(null)
      else selectPinByUserId(pinId)
    } else {
      setSelectedPin(null)
    }
  }, [location.hash])

  useEffect(() => {
    const userName = user?._id
    if (!userName) {
      return
    }

    mapPinService.getMapPinSelf(userName).then((userMapPin) => {
      if (userMapPin && !mapPins.find((pin) => pin._id === userMapPin._id)) {
        setMapPins([...mapPins, userMapPin])
      }
    })
  }, [user])

  const promptUserLocation = async () => {
    try {
      const position = await GetLocation()
      setCenter({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      })
    } catch (error) {
      logger.error(error)
    }
  }

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

  const visibleMapPins = useMemo(() => {
    return filterMapPinsByType(mapPins, activePinFilters)
  }, [mapPins, activePinFilters])

  const selectPinByUserId = async (userId: string) => {
    // First check the mapPins to see if the pin is already
    // partially loaded
    const preLoadedPin = mapPins.find((pin) => pin._id === userId)
    if (preLoadedPin) {
      setCenter(preLoadedPin.location)
      setSelectedPin(preLoadedPin)
    }

    // If only the mapPins where preloaded with the "detail" property, i think that this could fly away
    const pin = await mapPinService.getMapPinByUserId(userId)
    if (pin) {
      logger.info(`Fetched map pin by user id`, { userId })
      setCenter(pin.location)
      setSelectedPin(pin)
    } else {
      logger.error(`Failed to fetch map pin by user id`, { userId, pin })
    }
  }

  const onBlur = () => {
    setSelectedPin(null)
    navigate('/map')
  }

  return (
    // the calculation for the height is kind of hacky for now, will set properly on final mockups
    <Box id="mapPage" sx={{ height: 'calc(100vh - 120px)', width: '100%' }}>
      <NewMapBanner showNewMap={showNewMap} setShowNewMap={setShowNewMap} />
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
              selectPinByUserId(pin._id)
              navigate(`/map#${pin._id}`)
            }}
            onBlur={onBlur}
            center={center}
            zoom={zoom}
            setZoom={setZoom}
          />
        </>
      )}
      {showNewMap && (
        <MapWithList
          activePin={selectedPin}
          center={center}
          mapRef={newMapRef}
          notification={notification}
          onLocationChange={(latlng) => setCenter(latlng)}
          onPinClicked={(pin) => {
            selectPinByUserId(pin._id)
            navigate(`/map#${pin._id}`)
          }}
          onBlur={onBlur}
          pins={visibleMapPins}
          setZoom={setZoom}
          zoom={zoom}
        />
      )}
    </Box>
  )
})

export default MapsPage
