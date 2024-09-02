import { useState } from 'react'
import { Button, CardList, Map } from 'oa-components'
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
  notification?: string
  pins: IMapPin[]
  zoom: number
  onPinClicked: (pin: IMapPin) => void
  onBlur: () => void
  setZoom: (arg: number) => void
}

export const MapWithList = (props: IProps) => {
  const [filteredPins, setFilteredPins] = useState<IMapPin[] | null>(null)
  const [showMobileList, setShowMobileList] = useState<boolean>(false)
  const {
    activePin,
    center,
    mapRef,
    notification,
    onBlur,
    onPinClicked,
    pins,
    zoom,
    setZoom,
  } = props

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

  const mobileListDisplay = showMobileList ? 'block' : 'none'

  return (
    <Flex
      sx={{
        flexDirection: 'row',
        height: '100%',
      }}
    >
      {/* Desktop list view */}
      <Box
        sx={{
          display: ['none', 'none', 'block', 'block'],
          background: 'white',
          flex: 1,
          overflow: 'scroll',
          padding: 2,
        }}
      >
        <Heading data-cy="welome-header" sx={{ padding: 2 }}>
          Welcome to our world!{' '}
          {pins && `${pins.length} members (and counting...)`}
        </Heading>
        <CardList dataCy="desktop" list={pins} filteredList={filteredPins} />
      </Box>

      {/* Mobile/tablet list view */}
      <Box
        sx={{
          display: [mobileListDisplay, mobileListDisplay, 'none', 'none'],
          background: 'white',
          width: '100%',
          overflow: 'scroll',
          padding: 2,
        }}
      >
        <Flex
          sx={{
            justifyContent: 'center',
            paddingBottom: 2,
            position: 'absolute',
            zIndex: 1000,
            width: '100%',
          }}
        >
          <Button
            data-cy="ShowMapButton"
            icon="map"
            sx={{ position: 'sticky' }}
            onClick={() => setShowMobileList(false)}
            small
          >
            Show map view
          </Button>
        </Flex>
        <Heading
          data-cy="welome-header"
          variant="small"
          sx={{ padding: 2, paddingTop: '50px' }}
        >
          Welcome to our world!{' '}
          {pins && `${pins.length} members (and counting...)`}
        </Heading>
        <CardList
          columnsCountBreakPoints={{ 300: 1, 600: 2 }}
          dataCy="mobile"
          list={pins}
          filteredList={filteredPins}
        />
      </Box>

      {/* Same map for all viewports */}
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
          {notification && notification !== '' && (
            <Button sx={{ zIndex: 1000 }} variant="subtle">
              {notification}
            </Button>
          )}
        </Flex>
        <Clusters pins={pins} onPinClick={onPinClicked} prefix="new" />
        {activePin && <Popup activePin={activePin} mapRef={mapRef} />}
      </Map>
    </Flex>
  )
}
