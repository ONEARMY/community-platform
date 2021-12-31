import * as React from 'react'
import { Map, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet'
import L from 'leaflet'
import Text from 'src/components/Text'
import { Box } from 'rebass/styled-components'
import theme from 'src/themes/styled.theme'
import customMarkerIcon from 'src/assets/icons/map-marker.png'

const customMarker = L.icon({
  iconUrl: customMarkerIcon,
  iconSize: [20, 28],
  iconAnchor: [10, 28],
})

function DraggableMarker(props: { position: any; ondragend: any }) {
  const [draggable, setDraggable] = React.useState(true)
  const markerRef = React.useRef(null)

  console.log(`DraggableMarket: init position`, props.position)

  const toggleDraggable = React.useCallback(() => {
    setDraggable(d => !d)
  }, [])

  return (
    <Marker
      draggable={draggable}
      ondragend={() => {
        const marker: any = markerRef.current
        const markerLatLng = marker.leafletElement.getLatLng()
        console.log({ markerLatLng })
        // console.log(`DraggableMarker.dragend`, markerLatLng)
        // if (marker != null) {
        //   setPosition(markerLatLng)
        // }

        if (props.ondragend) {
          props.ondragend(markerLatLng)
        }
      }}
      position={[props.position.lat, props.position.lng]}
      ref={markerRef}
      icon={customMarker}
    >
      <Popup minWidth={90}>
        <span onClick={toggleDraggable}>
          {draggable
            ? 'Marker is draggable ' +
              JSON.stringify({ position: props.position })
            : 'Click here to make marker draggable'}
        </span>
      </Popup>
    </Marker>
  )
}

function MapWithDraggablePin(props: any) {
  const [zoom, setZoom] = React.useState(props.zoom || 3)
  const clickHandler =
    props.updatePosition ||
    function(evt) {
      console.log('fallback', evt)
    }

  return (
    <>
      Map with Draggable Pin
      {JSON.stringify(props.position)}
      <button
        onClick={evt => {
          console.log(`Clicked the reset button`)
          clickHandler({
            lat: 0,
            lng: 0,
          })
          evt.stopPropagation()
        }}
      >
        Reset Position
      </button>
      <div>
        <Map
          center={[props.position.lat, props.position.lng]}
          zoom={zoom}
          zoomControl={false}
          onclick={evt => {
            console.log(`map clicked:`, {
              evt,
            })
            clickHandler(evt.latlng)
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
              console.log(`MapWithDraggablePin: On drag end`, { evt })
              clickHandler(evt)
            }}
          />
        </Map>
      </div>
      <Box bg={theme.colors.softblue} mt={2} p={2} sx={{ borderRadius: '3px' }}>
        <Text small>
          You can click on the map, or drag the marker to adjust it's position.
        </Text>
      </Box>
    </>
  )
}

export default MapWithDraggablePin
