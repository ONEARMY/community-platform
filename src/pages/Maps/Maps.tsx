import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { observer } from 'mobx-react'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { MAP_PROFILE_TYPE_HIDDEN_BY_DEFAULT } from 'src/config/config'
import { MAP_GROUPINGS } from 'src/stores/Maps/maps.groupings'
import { Box } from 'theme-ui'

import { logger } from '../../logger'
import { transformAvailableFiltersToGroups } from './Content/Controls/transformAvailableFiltersToGroups'
import { GetLocation } from './utils/geolocation'
import { Controls, MapView } from './Content'

import type { Map } from 'react-leaflet'
import type { ILatLng } from 'src/models/maps.models'

import './styles.css'

const MapsPage = observer(() => {
  const mapRef = React.useRef<Map>(null)
  const location = useLocation()
  const { mapsStore } = useCommonStores().stores

  const [state, setState] = useState<{
    center: ILatLng
    zoom: number
    firstLoad: boolean
  }>({
    center: { lat: 51.0, lng: 19.0 },
    zoom: 3,
    firstLoad: true,
  })

  useEffect(() => {
    retrieveMapPins()
    mapsStore.retrievePinFilters()

    const showPin = async () => {
      await showPinFromURL()

      if (!mapsStore.activePin) {
        promptUserLocation()
      }
    }
    showPin()

    return () => {
      mapsStore.removeSubscriptions()
      mapsStore.setActivePin(undefined)
    }
  }, [])

  useEffect(() => {
    showPinFromURL()
  }, [location.hash])

  const availableFilters = () => {
    return transformAvailableFiltersToGroups(mapsStore, [
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

  const retrieveMapPins = () =>
    mapsStore.retrieveMapPins(MAP_PROFILE_TYPE_HIDDEN_BY_DEFAULT)
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

  const { filteredPins, activePinFilters } = mapsStore
  return (
    // the calculation for the height is kind of hacky for now, will set properly on final mockups
    <Box id="mapPage" sx={{ height: 'calc(100vh - 80px)', width: '100%' }}>
      <Controls
        availableFilters={availableFilters()}
        onLocationChange={(latlng) => setCenter(latlng)}
      />
      <MapView
        mapRef={mapRef}
        pins={filteredPins}
        filters={activePinFilters}
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
