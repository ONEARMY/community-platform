import { useEffect } from 'react'
import { Tooltip } from 'react-tooltip'
import { Button, Map } from 'oa-components'
import { logger } from 'src/logger'
import { Box, Flex } from 'theme-ui'

import { GetLocation } from '../../utils/geolocation'
import { Clusters } from './Cluster.client'
import { Popup } from './Popup.client'

import type { LatLngExpression } from 'leaflet'
import type { ILatLng, IMapPin } from 'oa-shared'
import type { RefObject } from 'react'
import type { Map as MapType, MapProps } from 'react-leaflet'

interface IProps {
  allPins: IMapPin[] | null
  center: ILatLng
  mapRef: RefObject<MapType<MapProps, any>>
  onBlur: () => void
  onPinClick: (IMapPin) => void
  selectedPin: IMapPin | undefined
  setBoundaries: (LatLngBounds) => void
  setCenter: (ILatLng) => void
  setShowMobileList: (boolean) => void
  setZoom: (number) => void
  zoom: number
}

const INITIAL_ZOOM = 3
const ZOOM_IN_TOOLTIP = 'Zoom in to your location'
const ZOOM_OUT_TOOLTIP = 'Zoom out to world view'

export const MapView = (props: IProps) => {
  const {
    allPins,
    center,
    mapRef,
    onBlur,
    onPinClick,
    selectedPin,
    setBoundaries,
    setCenter,
    setShowMobileList,
    setZoom,
    zoom,
  } = props

  const buttonStyle = {
    backgroundColor: 'white',
    borderRadius: 99,
    padding: 4,
    ':hover': {
      backgroundColor: 'lightgray',
    },
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
    }
  }

  const handleLocationChange = () => {
    if (mapRef.current) {
      const boundaries = mapRef.current.leafletElement.getBounds()
      setBoundaries(boundaries)
    }
  }

  const isViewportGreaterThanTablet = window.innerWidth > 1024
  const mapCenter: LatLngExpression = center ? [center.lat, center.lng] : [0, 0]
  const mapZoom = center ? zoom : 2

  useEffect(() => {
    if (mapRef.current) {
      ;(window as any).mapInstance = mapRef.current
    }
  }, [mapRef])

  return (
    <Map
      ref={mapRef}
      className="markercluster-map"
      center={mapCenter}
      zoom={mapZoom}
      setZoom={setZoom}
      maxZoom={18}
      style={{ flex: 1 }}
      zoomControl={isViewportGreaterThanTablet}
      onclick={onBlur}
      ondragend={handleLocationChange}
      onzoomend={handleLocationChange}
      onresize={handleLocationChange}
      useFlyTo
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          padding: 4,
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Button
          data-tooltip-content={ZOOM_IN_TOOLTIP}
          data-cy="LocationViewButton"
          data-tooltip-id="locationButton-tooltip"
          sx={buttonStyle}
          onClick={() => {
            promptUserLocation()
            setZoom(6)
          }}
          icon="gps-location"
        />
        <Tooltip id="locationButton-tooltip" place="left" />

        <Button
          data-tooltip-content={ZOOM_OUT_TOOLTIP}
          data-cy="WorldViewButton"
          data-tooltip-id="worldViewButton-tooltip"
          sx={buttonStyle}
          onClick={() => {
            setZoom(INITIAL_ZOOM)
          }}
          icon="globe"
        />
        <Tooltip id="worldViewButton-tooltip" place="top" />
      </Box>

      <Flex
        sx={{
          flexDirection: 'column',
          alignItems: 'center',
          padding: 2,
          gap: 2,
        }}
      >
        <Button
          data-cy="ShowMobileListButton"
          icon="step"
          sx={{ display: ['flex', 'flex', 'none'], zIndex: 1000 }}
          onClick={() => setShowMobileList(true)}
          small
        >
          Show list view
        </Button>
      </Flex>
      {allPins && (
        <Clusters pins={allPins} onPinClick={onPinClick} prefix="new" />
      )}
      {selectedPin && (
        <Popup activePin={selectedPin} mapRef={mapRef} onClose={onBlur} />
      )}
    </Map>
  )
}
