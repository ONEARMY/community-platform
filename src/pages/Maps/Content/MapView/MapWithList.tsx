import { useEffect, useMemo, useState } from 'react'
import { Button, Map } from 'oa-components'
import { Box, Flex } from 'theme-ui'

import { Clusters } from './Cluster'
import { latLongFilter } from './latLongFilter'
import { MapWithListHeader } from './MapWithListHeader'
import { Popup } from './Popup'

import type { LatLngExpression } from 'leaflet'
import type { Map as MapType } from 'react-leaflet'
import type { ILatLng } from 'shared/models'
import type { IMapPin } from 'src/models/maps.models'

const allFilters = [
  {
    label: 'Workspace',
    type: 'workspace',
  },
  {
    label: 'Machine Builder',
    type: 'machine-builder',
  },
  {
    label: 'Community Point',
    type: 'community-builder',
  },
  {
    label: 'Collection Point',
    type: 'collection-point',
  },
  {
    label: 'Space',
    type: 'space',
  },
  {
    label: 'Want to get started',
    type: 'member',
  },
]

interface IProps {
  activePin: IMapPin | null
  center: ILatLng
  mapRef: React.RefObject<MapType>
  notification?: string
  pins: IMapPin[]
  zoom: number
  onBlur: () => void
  onPinClicked: (pin: IMapPin) => void
  setZoom: (arg: number) => void
}

export const MapWithList = (props: IProps) => {
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

  const [activePinFilters, setActivePinFilters] = useState<string[]>([])
  const [allPinsInView, setAllPinsInView] = useState<IMapPin[]>(pins)
  const [filteredPins, setFilteredPins] = useState<IMapPin[] | null>(
    pins || null,
  )
  const [showMobileList, setShowMobileList] = useState<boolean>(false)

  const availableFilters = useMemo(() => {
    const pinTypes = pins.map(({ creator }) => creator?.profileType)
    const filtersNeeded = [...new Set(pinTypes)]
    return allFilters.filter(({ type }) =>
      filtersNeeded.some((filter) => filter === type),
    )
  }, [pins])

  useEffect(() => {
    if (activePinFilters.length === 0) {
      return setFilteredPins(allPinsInView)
    }
    const filteredPins = allPinsInView.filter((pin) =>
      activePinFilters.includes(pin.type),
    )

    setFilteredPins(filteredPins)
  }, [activePinFilters, allPinsInView])

  const handleLocationFilter = () => {
    if (mapRef.current) {
      const boundaries = mapRef.current.leafletElement.getBounds()
      // Map.getBounds() is wrongly typed
      const results = latLongFilter(boundaries as any, pins)
      setAllPinsInView(results)
    }
  }

  const onFilterChange = (label: string) => {
    const filter = label.toLowerCase()
    const isFilterPresent = !!activePinFilters.find(
      (pinFilter) => pinFilter === filter,
    )
    if (isFilterPresent) {
      return setActivePinFilters((pins) => pins.filter((pin) => pin !== filter))
    }
    return setActivePinFilters((pins) => [...pins, filter])
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
        }}
      >
        <MapWithListHeader
          pins={pins}
          activePinFilters={activePinFilters}
          availableFilters={availableFilters}
          onFilterChange={onFilterChange}
          filteredPins={filteredPins}
          viewport="desktop"
        />
      </Box>

      {/* Mobile/tablet list view */}
      <Box
        sx={{
          display: [mobileListDisplay, mobileListDisplay, 'none', 'none'],
          background: 'white',
          width: '100%',
          overflow: 'scroll',
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
            sx={{ position: 'sticky', marginTop: 2 }}
            onClick={() => setShowMobileList(false)}
            small
          >
            Show map view
          </Button>
        </Flex>
        <MapWithListHeader
          pins={pins}
          activePinFilters={activePinFilters}
          availableFilters={availableFilters}
          onFilterChange={onFilterChange}
          filteredPins={filteredPins}
          viewport="mobile"
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
