import { useEffect, useMemo, useState } from 'react'
import { Button, Map } from 'oa-components'
import { Box, Flex } from 'theme-ui'

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
  mapRef: React.RefObject<MapType>
  notification?: string
  onBlur: () => void
  onPinClicked: (pin: IMapPin) => void
  onLocationChange: (latlng: ILatLng) => void
  pins: IMapPin[]
  setZoom: (arg: number) => void
  zoom: number
}

export const MapWithList = (props: IProps) => {
  const {
    activePin,
    center,
    mapRef,
    notification,
    onBlur,
    onLocationChange,
    onPinClicked,
    pins,
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
      creator?.workspaceType,
    ])
    const filtersNeeded = [...new Set(pinDetails.flat())]

    return allMapFilterOptions.filter((validFilter) =>
      filtersNeeded.some((neededfilter) => neededfilter === validFilter._id),
    )
  }, [pins])

  useEffect(() => {
    const workspaceTypeFilters = activePinFilters
      .filter(({ filterType }) => filterType === 'workspaceType')
      .map(({ _id }) => _id)

    if (workspaceTypeFilters.length > 0) {
      const workspaceFilteredList = allPinsInView.filter(
        ({ creator }) =>
          creator?.workspaceType &&
          workspaceTypeFilters.includes(creator.workspaceType),
      )
      return setFilteredPins(workspaceFilteredList)
    }

    const profileTypeFilters = activePinFilters
      .filter(({ filterType }) => filterType === 'profileType')
      .map(({ _id }) => _id)

    if (profileTypeFilters.length > 0) {
      const profileTypeFilteredList = allPinsInView.filter(
        ({ creator }) =>
          creator?.profileType &&
          profileTypeFilters.includes(creator?.profileType),
      )
      return setFilteredPins(profileTypeFilteredList)
    }

    setFilteredPins(allPinsInView)
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

    const addingWorkspaceTypeFilter =
      changedOption.filterType === 'workspaceType'

    if (addingWorkspaceTypeFilter) {
      const existingWorkspaceTypeFilters = activePinFilters.filter(
        ({ filterType }) => filterType === 'workspaceType',
      )

      return setActivePinFilters([
        {
          _id: 'workspace',
          filterType: 'profileType',
          label: 'Workspace',
        },
        ...existingWorkspaceTypeFilters,
        changedOption,
      ])
    }

    const existingProfileTypeFilters = activePinFilters.filter(
      ({ filterType }) => filterType === 'profileType',
    )
    return setActivePinFilters([...existingProfileTypeFilters, changedOption])
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
