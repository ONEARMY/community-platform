import * as React from 'react'
import OsmGeocoding from 'src/components/OsmGeocoding/OsmGeocoding'
import { Map, TileLayer, Marker, ZoomControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import Text from 'src/components/Text'
import { Button } from 'oa-components'
import { Box, Flex } from 'rebass'
import theme from 'src/themes/styled.theme'
import customMarkerIcon from 'src/assets/icons/map-marker.png'
import { logger } from 'src/logger'
import styled from '@emotion/styled'

const customMarker = L.icon({
  iconUrl: customMarkerIcon,
  iconSize: [20, 28],
  iconAnchor: [10, 28],
})

function DraggableMarker(props: { position: any; ondragend: any }) {
  const [draggable] = React.useState(true)
  const markerRef = React.useRef(null)

  return (
    <Marker
      draggable={draggable}
      ondragend={() => {
        const marker: any = markerRef.current

        if (!marker) {
          logger.warn('DraggableMarker: marker not found')
          return null
        }

        const markerLatLng = marker.leafletElement.getLatLng()
        if (props.ondragend) {
          logger.debug({ markerLatLng }, 'DraggableMarker.Marker.ondragend')
          props.ondragend(markerLatLng)
        }
      }}
      position={[props.position.lat, props.position.lng]}
      ref={markerRef}
      icon={customMarker}
    />
  )
}

const MapControls = styled('div')`
  position: absolute;
  top: 0;
  left: 0;
  padding: ${props => props.theme.space[2]}px;
  z-index: 2;
`

interface Props {
  position: any
  updatePosition?: any
  center?: any
  zoom?: number
  hasUserLocation?: boolean
}

function MapWithDraggablePin(props: Props) {
  const [zoom, setZoom] = React.useState(props.zoom || 1)
  const [center, setCenter] = React.useState(
    props.center || [props.position.lat, props.position.lng],
  )
  const hasUserLocation = props.hasUserLocation || false
  const onPositionChanged =
    props.updatePosition ||
    function(evt) {
      logger.debug({ evt }, 'MapWithDraggablePin.clickHandler.fallback')
    }

  return (
    <div
      style={{
        position: 'relative',
      }}
    >
      <MapControls>
        <Flex style={{ width: '280px' }}>
          <OsmGeocoding
            callback={data => {
              logger.debug(data, 'MapWithDraggablePin.ReactOsmGeocoding')
              if (data.lat && data.lon) {
                onPositionChanged({
                  lat: data.lat,
                  lng: data.lon,
                })
                setCenter([data.lat, data.lon])
                setZoom(15)
              }
            }}
            countrycodes=""
            acceptLanguage="en"
          />
          {hasUserLocation && (
            <Button
              mx={2}
              onClick={evt => {
                evt.preventDefault()
                navigator.geolocation.getCurrentPosition(
                  position => {
                    logger.debug(`MapWithDraggablePin.geolocation.success`, {
                      position,
                    })
                    onPositionChanged({
                      lat: position.coords.latitude,
                      lng: position.coords.longitude,
                    })
                    setCenter([
                      position.coords.latitude,
                      position.coords.longitude,
                    ])
                    setZoom(15)
                  },
                  err => {
                    logger.error(err, 'MapWithDraggablePin.geolocation.error')
                  },
                )
              }}
            >
              Use my current location
            </Button>
          )}
        </Flex>
      </MapControls>
      <div>
        <Map
          center={center}
          zoom={zoom}
          zoomControl={false}
          onViewportChanged={evt => {
            logger.debug(evt, `MapWithDraggablePin.onViewportChanged`)
            if (evt.zoom) {
              setZoom(evt.zoom)
            }
          }}
          onclick={evt => {
            logger.debug(evt, 'MapWithDraggablePin.onclick')
            onPositionChanged({
              lat: evt.latlng.lat,
              lng: evt.latlng.lng,
            })
          }}
          style={{
            height: '300px',
            zIndex: 1,
          }}
        >
          <ZoomControl position="topright" />
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <DraggableMarker
            position={props.position}
            ondragend={evt => {
              logger.debug(evt, `MapWithDraggablePin.DraggableMarker.onDragEnd`)

              if (evt.lat && evt.lng)
                onPositionChanged({
                  lat: evt.lat,
                  lng: evt.lng,
                })
            }}
          />
        </Map>
      </div>
      <Box bg={theme.colors.softblue} mt={2} p={2} sx={{ borderRadius: '3px' }}>
        <Text small>
          You can click on the map, or drag the marker to adjust it's position.
        </Text>
      </Box>
    </div>
  )
}

export default MapWithDraggablePin
