import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Flex } from 'theme-ui'

import { filterPins } from '../../utils/filterPins'
import { latLongFilter } from './latLongFilter'
import { MapList } from './MapList'
import { MapView } from './MapView'

import type { ILatLng, IMapPin, MapFilterOptionsList } from 'oa-shared'
import type { Map as MapType } from 'react-leaflet'

interface IProps {
  allPins: IMapPin[] | null
  allToggleFilters: MapFilterOptionsList
  notification: string
}

export const INITIAL_CENTER = { lat: 30.0, lng: 19.0 }
export const INITIAL_ZOOM = 2

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

  useEffect(() => {
    if (allPins) {
      setFilteredPins(allPins)
    }
  }, [allPins])

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
  }, [location.hash])

  const selectPinByUserId = async (userId: string | undefined) => {
    if (allPins) {
      const preLoadedPin = allPins.find((pin) => pin._id === userId)
      preLoadedPin && setCenter(preLoadedPin.location)
      setSelectedPin(preLoadedPin)
    }
  }

  const onBlur = () => {
    navigate(`/map`, { replace: true })
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
        initialCenter={INITIAL_CENTER}
        initialZoom={INITIAL_ZOOM}
        mapRef={mapRef}
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
