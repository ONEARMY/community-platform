import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CardList, Map } from 'oa-components'
import { Box, Flex, Heading } from 'theme-ui'

import { Clusters } from './Cluster'
import { latLongFilter } from './latLongFilter'
import { Popup } from './Popup'

import type { LatLngExpression } from 'leaflet'
import type { Map as MapType } from 'react-leaflet'
import type { ILatLng } from 'shared/models'
import type { IMapPin } from 'src/models/maps.models'

interface IProps {
  activePin: IMapPin | null
  center: ILatLng
  mapRef: React.RefObject<MapType>
  pins: IMapPin[]
  zoom: number
  onPinClicked: (pin: IMapPin) => void
  onBlur: () => void
  setZoom: (arg: number) => void
}

export const MapWithList = (props: IProps) => {
  const [filteredPins, setFilteredPins] = useState<IMapPin[] | null>(null)
  const {
    activePin,
    center,
    mapRef,
    onBlur,
    onPinClicked,
    pins,
    zoom,
    setZoom,
  } = props

  const navigate = useNavigate()

  const handleLocationFilter = () => {
    if (mapRef.current) {
      const boundaries = mapRef.current.leafletElement.getBounds()
      // Map.getBounds() is wrongly typed
      const results = latLongFilter(boundaries as any, pins)
      setFilteredPins(results)
    }
  }

  const isViewportGreaterThanTablet = window.innerWidth > 1024
  const mapCenter: LatLngExpression = center ? [center.lat, center.lng] : [0, 0]
  const mapZoom = center ? zoom : 2

  const onClick = (userId: string) => navigate(`/u/${userId}`)

  return (
    <Flex
      sx={{
        flexDirection: 'row',
        height: '100%',
      }}
    >
      <Box
        sx={{
          background: 'white',
          flex: 1,
          overflow: 'scroll',
          padding: 4,
          gap: 4,
        }}
      >
        <Heading data-cy="welome-header">
          Welcome to our world!{' '}
          {pins && `${pins.length} members (and counting...)`}
        </Heading>
        <CardList list={pins} onClick={onClick} filteredList={filteredPins} />
      </Box>
      <Map
        ref={mapRef}
        className="markercluster-map"
        center={mapCenter}
        zoom={mapZoom}
        setZoom={setZoom}
        maxZoom={18}
        style={{ flex: 1 }}
        zoomControl={isViewportGreaterThanTablet}
        onclick={() => onBlur()}
        ondragend={handleLocationFilter}
        onzoomend={handleLocationFilter}
      >
        <Clusters pins={pins} onPinClick={onPinClicked} prefix="new" />
        {activePin && <Popup activePin={activePin} mapRef={mapRef} />}
      </Map>
    </Flex>
  )
}
