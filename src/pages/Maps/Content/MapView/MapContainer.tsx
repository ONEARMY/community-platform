import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Flex } from 'theme-ui'

import { filterPins } from '../../utils/filterPins'
import { setDefaultPinFilters } from '../../utils/setDefaultPinFilters'
import { latLongFilter } from './latLongFilter'
import { MapList } from './MapList'
import { MapView } from './MapView'

import type { ILatLng, IMapPin, MapFilterOptionsList } from 'oa-shared'
import type { Map as MapType } from 'react-leaflet'
import type { ClustersRef } from './Cluster.client'

interface IProps {
  allPins: IMapPin[] | null
  allToggleFilters: MapFilterOptionsList
  notification: string
}

export const INITIAL_CENTER = { lat: 30.0, lng: 19.0 }
export const INITIAL_ZOOM = 2
export const INTERACTED_ZOOM = 6

export const MapContainer = (props: IProps) => {
  const { allPins, allToggleFilters, notification } = props

  const [selectedPin, setSelectedPin] = useState<IMapPin | undefined>()
  const [activePinFilters, setActivePinFilters] =
    useState<MapFilterOptionsList>([])
  const [boundaries, setBoundaries] = useState(null)
  const [center, setCenter] = useState<ILatLng>(INITIAL_CENTER)
  const [filteredPins, setFilteredPins] = useState<IMapPin[] | null>(null)
  const [showMobileList, setShowMobileList] = useState<boolean>(false)
  const [zoom, setZoom] = useState<number>(INITIAL_ZOOM)

  const navigate = useNavigate()
  const location = useLocation()
  const mapRef = useRef<MapType>(null)
  const clustersRef = useRef<ClustersRef>(null)

  useEffect(() => {
    if (allPins) {
      setFilteredPins(allPins)
    }
  }, [allPins])

  useEffect(() => {
    if (allToggleFilters) {
      const defaultSetFilteringOptions = setDefaultPinFilters(allToggleFilters)
      setActivePinFilters(defaultSetFilteringOptions)
    }
  }, [allToggleFilters])

  useEffect(() => {
    if (allPins) {
      const filteredByLocation = boundaries
        ? latLongFilter(boundaries, allPins)
        : allPins
      const newFiltered = filterPins(activePinFilters, filteredByLocation)
      return setFilteredPins(newFiltered)
    }
  }, [activePinFilters, boundaries])

  useEffect(() => {
    const pinId = location.hash.slice(1)
    selectPinByUserId(pinId.length > 0 ? pinId : undefined)
  }, [location.hash, allPins])

  const findMarkerById = (markerId: string) => {
    if (!clustersRef.current?.markerClusterGroup) return null

    let targetMarker = null
    clustersRef.current.markerClusterGroup.eachLayer((layer) => {
      if (layer.options?.properties?.pinId === markerId) {
        targetMarker = layer
      }
    })

    return targetMarker
  }

  // Check if a marker is currently visible (not part of a cluster)
  const isMarkerVisible = (marker) => {
    if (!marker || !clustersRef.current?.markerClusterGroup) return false

    const visibleParent =
      clustersRef.current.markerClusterGroup.getVisibleParent(marker)
    return visibleParent === marker
  }

  const zoomToClusteredMarker = (marker) => {
    if (!marker || !clustersRef.current?.markerClusterGroup) return

    clustersRef.current.markerClusterGroup.zoomToShowLayer(marker)
  }

  const zoomToVisibleMarker = (location: ILatLng) => {
    setCenter(location)
    if (zoom < INTERACTED_ZOOM) setZoom(INTERACTED_ZOOM)
  }

  const selectPinByUserId = async (userId: string | undefined) => {
    if (!allPins || !userId) {
      setSelectedPin(undefined)
      return
    }

    const foundPin = allPins.find((pin) => pin._id === userId)
    if (!foundPin) {
      setSelectedPin(undefined)
      return
    }

    setCenter(foundPin.location)

    const targetMarker = findMarkerById(userId)

    if (targetMarker) {
      if (isMarkerVisible(targetMarker)) {
        // Zoom to some minimum level
        zoomToVisibleMarker(foundPin.location)
      } else {
        zoomToClusteredMarker(targetMarker)
      }
    } else {
      // Initial page load will end up here.
      // Since we need clusterRef to zoom the correct amount
      // and the Clusters component has not rendered yet,
      // we cannot zoom to a marker-specific level.
      setZoom(14)
    }

    setSelectedPin(foundPin)
  }

  const onBlur = () => {
    navigate(`/map`, { replace: true })
    setZoom(INTERACTED_ZOOM)
  }

  const onPinClick = (pin) => {
    navigate(`/map#${pin._id}`, { replace: true })
  }

  const onLocationChange = (latlng) => setCenter(latlng)
  const mapZoom = center ? zoom : 2

  return (
    <Flex
      sx={{
        flexDirection: 'row',
        height: '100%',
      }}
    >
      <MapList
        allToggleFilters={allToggleFilters}
        activePinFilters={activePinFilters}
        notification={notification}
        onBlur={onBlur}
        onLocationChange={onLocationChange}
        onPinClick={onPinClick}
        pins={filteredPins}
        selectedPin={selectedPin}
        setActivePinFilters={setActivePinFilters}
        setShowMobileList={setShowMobileList}
        showMobileList={showMobileList}
      />

      <MapView
        allPins={filteredPins}
        center={center}
        mapRef={mapRef}
        clustersRef={clustersRef}
        setBoundaries={setBoundaries}
        setZoom={setZoom}
        onBlur={onBlur}
        onPinClick={onPinClick}
        setCenter={setCenter}
        selectedPin={selectedPin}
        setShowMobileList={setShowMobileList}
        zoom={mapZoom}
      />
    </Flex>
  )
}
