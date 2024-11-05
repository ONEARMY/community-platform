import { useEffect, useMemo, useState } from 'react'
import { Tooltip } from 'react-tooltip'
import { Button, Map } from 'oa-components'
import { Box, Flex } from 'theme-ui'

import { filterPins } from '../../utils/filterPins'
import { allMapFilterOptions } from './allMapFilterOptions'
import { Clusters } from './Cluster.client'
import { latLongFilter } from './latLongFilter'
import { MapWithListHeader } from './MapWithListHeader'
import { Popup } from './Popup.client'

import type { LatLngExpression } from 'leaflet'
import type {
  ILatLng,
  IMapPin,
  MapFilterOption,
  MapFilterOptionsList,
} from 'oa-shared'
import type { Map as MapType } from 'react-leaflet'

interface IProps {
  activePin: IMapPin | null
  center: ILatLng
  initialZoom: number
  mapRef: React.RefObject<MapType>
  notification?: string
  onBlur: () => void
  onPinClicked: (pin: IMapPin) => void
  onLocationChange: (latlng: ILatLng) => void
  pins: IMapPin[]
  promptUserLocation: () => Promise<void>
  setZoom: (arg: number) => void
  zoom: number
}

const ZOOM_IN_TOOLTIP = 'Zoom in to your location'
const ZOOM_OUT_TOOLTIP = 'Zoom out to world view'

export const MapWithList = (props: IProps) => {
  const {
    activePin,
    center,
    initialZoom,
    mapRef,
    notification,
    onBlur,
    onLocationChange,
    onPinClicked,
    pins,
    promptUserLocation,
    setZoom,
    zoom,
  } = props

  const [activePinFilters, setActivePinFilters] =
    useState<MapFilterOptionsList>([])
  const [allPinsInView, setAllPinsInView] = useState<IMapPin[]>(pins)
  const [filteredPins, setFilteredPins] = useState<IMapPin[] | null>(
    pins || null,
  )
  const [showMobileList, setShowMobileList] = useState<boolean>(false)

  const availableFilters = useMemo(() => {
    const pinDetails = pins.map(({ creator }) => [
      creator?.profileType,
      ...(creator?.tags ? creator.tags.map(({ _id }) => _id) : []),
    ])
    const filtersNeeded = [...new Set(pinDetails.flat())]
    return allMapFilterOptions.filter((validFilter) =>
      filtersNeeded.some((neededfilter) => neededfilter === validFilter._id),
    )
  }, [pins])

  const buttonStyle = {
    backgroundColor: 'white',
    borderRadius: 99,
    padding: 4,
    ':hover': {
      backgroundColor: 'lightgray',
    },
  }

  useEffect(() => {
    const filtered = filterPins(activePinFilters, allPinsInView)
    return setFilteredPins(filtered)
  }, [activePinFilters, allPinsInView])

  const handleLocationFilter = () => {
    if (mapRef.current) {
      const boundaries = mapRef.current.leafletElement.getBounds()
      // Map.getBounds() is wrongly typed
      const results = latLongFilter(boundaries as any, pins)
      setAllPinsInView(results)
    }
  }

  const onFilterChange = (changedOption: MapFilterOption) => {
    const isFilterPresent = !!activePinFilters.find(
      (pinFilter) => pinFilter.label == changedOption.label,
    )

    if (isFilterPresent) {
      return setActivePinFilters((filter) =>
        filter.filter(
          (existingOption) => existingOption.label !== changedOption.label,
        ),
      )
    }

    return setActivePinFilters((activePinFilters) => [
      ...activePinFilters,
      changedOption,
    ])
  }

  const isViewportGreaterThanTablet = window.innerWidth > 1024
  const mapCenter: LatLngExpression = center ? [center.lat, center.lng] : [0, 0]
  const mapZoom = center ? zoom : 2

  const mobileListDisplay = showMobileList ? 'block' : 'none'

  useEffect(() => {
    if (mapRef.current) {
      ;(window as any).mapInstance = mapRef.current
    }
  }, [mapRef])

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
          onBlur={onBlur}
          onFilterChange={onFilterChange}
          onLocationChange={onLocationChange}
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
          activePinFilters={activePinFilters}
          availableFilters={availableFilters}
          filteredPins={filteredPins}
          onBlur={onBlur}
          onFilterChange={onFilterChange}
          onLocationChange={onLocationChange}
          pins={pins}
          setShowMobileList={setShowMobileList}
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
        onresize={handleLocationFilter}
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
              setZoom(initialZoom)
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

          {notification && notification !== '' && (
            <Button sx={{ zIndex: 1000 }} variant="subtle">
              {notification}
            </Button>
          )}
        </Flex>
        <Clusters pins={pins} onPinClick={onPinClicked} prefix="new" />
        {activePin && (
          <Popup
            activePin={activePin}
            mapRef={mapRef}
            onClose={onBlur}
            newMap
          />
        )}
      </Map>
    </Flex>
  )
}
