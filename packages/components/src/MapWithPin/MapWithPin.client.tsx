import { useState } from 'react'
import { ZoomControl } from 'react-leaflet'
import { Alert, Box, Flex, Text } from 'theme-ui'

import { Button } from '../Button/Button'
import { Map } from '../Map/Map.client'
import { OsmGeocoding } from '../OsmGeocoding/OsmGeocoding'
import { MapPin } from './MapPin.client'

import type { DivIcon, LeafletMouseEvent } from 'leaflet'
import type { Map as MapType } from 'react-leaflet'
import type { Result } from '../OsmGeocoding/types'

import 'leaflet/dist/leaflet.css'

const useUserLocation = 'Use my current location'
const mapInstructions =
  'To move your pin, grab it to move it or double click where you want it to go.'

export interface Props {
  mapRef: React.RefObject<MapType>
  position: {
    lat: number
    lng: number
  }
  markerIcon?: DivIcon
  updatePosition?: any
  center?: any
  zoom?: number
  hasUserLocation?: boolean
  onClickMapPin?: () => void
  popup?: React.ReactNode
}

export const MapWithPin = (props: Props) => {
  const [zoom, setZoom] = useState(props.zoom || 1)
  const [center, setCenter] = useState(
    props.center || [props.position.lat, props.position.lng],
  )
  const { mapRef, position, markerIcon, onClickMapPin, popup } = props

  const hasUserLocation = props.hasUserLocation || false
  const onPositionChanged =
    props.updatePosition ||
    function () {
      // do nothing
    }

  const setLocationToNavigatorLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onPositionChanged({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setCenter([position.coords.latitude, position.coords.longitude])
        setZoom(15)
      },
      () => {
        // do nothing
      },
    )
  }

  const onDblClick = (evt: LeafletMouseEvent) => {
    onPositionChanged({ ...evt.latlng })
  }

  return (
    <Flex sx={{ flexDirection: 'column', gap: 2 }}>
      <Alert
        variant="info"
        sx={{
          marginTop: 2,
        }}
      >
        <Text sx={{ fontSize: 1 }}>{mapInstructions}</Text>
      </Alert>
      <div
        style={{
          position: 'relative',
          borderRadius: 6,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            zIndex: 2,
            padding: 4,
            top: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Flex style={{ width: '280px' }}>
            <OsmGeocoding
              callback={(data: Result) => {
                if (data.lat && data.lon) {
                  onPositionChanged({
                    lat: data.lat,
                    lng: data.lon,
                  })
                  setCenter([data.lat, data.lon])
                  setZoom(15)
                }
              }}
              acceptLanguage="en"
            />
            {hasUserLocation && (
              <Button
                type="button"
                mx={2}
                onClick={(evt) => {
                  evt.preventDefault()
                  setLocationToNavigatorLocation()
                }}
              >
                {useUserLocation}
              </Button>
            )}
          </Flex>
        </Box>

        <Map
          ref={mapRef}
          className="markercluster-map settings-page"
          center={center}
          zoom={zoom}
          zoomControl={false}
          setZoom={setZoom}
          ondblclick={onDblClick}
          doubleClickZoom={false}
          style={{
            height: '500px',
            zIndex: 1,
          }}
        >
          <ZoomControl position="topleft" />
          <>
            {popup}
            {position?.lat && position.lng && (
              <MapPin
                position={position}
                markerIcon={markerIcon}
                onClick={onClickMapPin}
                onDrag={(evt: any) => {
                  if (evt.lat && evt.lng)
                    onPositionChanged({
                      lat: evt.lat,
                      lng: evt.lng,
                    })
                }}
              />
            )}
          </>
        </Map>
      </div>
    </Flex>
  )
}
