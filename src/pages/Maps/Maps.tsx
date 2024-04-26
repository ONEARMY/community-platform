import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { observer } from 'mobx-react'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { filterMapPinsByType } from 'src/stores/Maps/filter'
import { MAP_GROUPINGS } from 'src/stores/Maps/maps.groupings'
import { Box } from 'theme-ui'

import { logger } from '../../logger'
import { transformAvailableFiltersToGroups } from './Content/Controls/transformAvailableFiltersToGroups'
import { GetLocation } from './utils/geolocation'
import { Controls, MapView } from './Content'
import { mapPinService } from './map.service'

import type { Map } from 'react-leaflet'
import type { ILatLng, IMapPin } from 'src/models/maps.models'

import './styles.css'

const MapsPage = observer(() => {
  const mapRef = React.useRef<Map>(null)
  const location = useLocation()
  const [mapPins, setMapPins] = useState<IMapPin[]>([])
  const { mapsStore, userStore } = useCommonStores().stores
  const [activePinFilters, setActivePinFilters] = useState<string[]>([])
  const user = userStore.activeUser

  const [state, setState] = useState<{
    center: ILatLng
    zoom: number
    firstLoad: boolean
  }>({
    center: { lat: 51.0, lng: 19.0 },
    zoom: 3,
    firstLoad: true,
  })

  const fetchMapPins = async (userName) => {
    const pins = await mapPinService.getMapPins(userName)
    setMapPins(pins)
  }

  const fetchMapPinByUserId = async (userName: string, isLoggedIn: boolean) => {
    const userMapPin = await mapPinService.getMapPinByUserId(
      userName,
      isLoggedIn,
    )

    if (userMapPin) {
      setMapPins([...mapPins, userMapPin])
    }
  }

  useEffect(() => {
    if (user?._id) {
      fetchMapPinByUserId(user?._id, !!user?._id)
    }
  }, [user])

  useEffect(() => {
    fetchMapPins(user?._id)

    // mapsStore.retrieveMapPins(MAP_PROFILE_TYPE_HIDDEN_BY_DEFAULT)

    const showPin = async () => {
      await showPinFromURL()

      if (!mapsStore.activePin) {
        promptUserLocation()
      }
    }
    showPin()

    return () => {
      mapsStore.setActivePin(undefined)
    }
  }, [])

  useEffect(() => {
    showPinFromURL()
  }, [location.hash])

  const availableFilters = () => {
    return transformAvailableFiltersToGroups(mapPins, [
      {
        grouping: 'verified-filter',
        displayName: 'Verified',
        type: 'verified',
      },
      ...MAP_GROUPINGS,
    ])
  }

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

  /** Check current hash in case matches a mappin and try to load */
  const showPinFromURL = async () => {
    const pinId = location.hash.slice(1)
    // Only lookup if not already the active pin
    if (pinId && pinId !== mapsStore.activePin?._id) {
      const pin = await mapsStore.getPin(pinId)
      if (pin._deleted) return
      mapsStore.setActivePin(pin)
    }
    // Center on the pin if first load
    if (state.firstLoad && mapsStore.activePin) {
      setCenter(mapsStore.activePin.location)
    }
    // TODO - handle pin not found
  }

  return (
    // the calculation for the height is kind of hacky for now, will set properly on final mockups
    <Box id="mapPage" sx={{ height: 'calc(100vh - 80px)', width: '100%' }}>
      <Controls
        availableFilters={availableFilters()}
        onLocationChange={(latlng) => setCenter(latlng)}
        onFilterChange={(selected) => {
          setActivePinFilters(selected)
        }}
      />
      <MapView
        mapRef={mapRef}
        pins={filterMapPinsByType(mapPins, activePinFilters)}
        filters={MAP_GROUPINGS}
        onBoundingBoxChange={(boundingBox) =>
          mapsStore.setMapBoundingBox(boundingBox)
        }
        center={state.center}
        zoom={state.zoom}
      />
    </Box>
  )
})

export default MapsPage
