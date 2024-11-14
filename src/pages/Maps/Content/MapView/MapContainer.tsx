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
  allPins: IMapPin[]
  allToggleFilters: MapFilterOptionsList
}

const INITIAL_CENTER = { lat: 51.0, lng: 19.0 }
const INITIAL_ZOOM = 3

export const MapContainer = (props: IProps) => {
  const { allPins, allToggleFilters } = props
  const [center, setCenter] = useState<ILatLng>(INITIAL_CENTER)
  const [boundaries, setBoundaries] = useState(null)
  const [activePin, setActivePin] = useState<IMapPin | null>(null)
  const [zoom, setZoom] = useState<number>(INITIAL_ZOOM)
  const [showMobileList, setShowMobileList] = useState<boolean>(false)
  const [activePinFilters, setActivePinFilters] =
    useState<MapFilterOptionsList>([])
  const [filteredPins, setFilteredPins] = useState<IMapPin[]>(allPins)

  const navigate = useNavigate()
  const location = useLocation()
  const mapRef = useRef<MapType>(null)

  useEffect(() => {
    const filteredByLocation = boundaries
      ? latLongFilter(boundaries, allPins)
      : allPins
    const newFiltered = filterPins(activePinFilters, filteredByLocation)
    return setFilteredPins(newFiltered)
  }, [activePinFilters, boundaries])

  useEffect(() => {
    const pinId = location.hash.slice(1)
    if (pinId.length > 0) {
      if (activePin) {
        setActivePin(null)
      } else {
        selectPinByUserId(pinId)
      }
    } else {
      setActivePin(null)
    }
  }, [location.hash])

  const selectPinByUserId = async (userId: string) => {
    // First check the mapPins to see if the pin is already
    // partially loaded
    const preLoadedPin = allPins.find((pin) => pin._id === userId)
    if (preLoadedPin) {
      setCenter(preLoadedPin.location)
      setActivePin(preLoadedPin)
    }
  }

  const onBlur = () => {
    setActivePin(null)
    navigate('/map')
  }

  const onLocationChange = (latlng) => setCenter(latlng)
  const mapZoom = center ? zoom : 2
  const onPinClick = (pin) => {
    selectPinByUserId(pin._id)
    navigate(`/map#${pin._id}`)
  }

  return (
    <Flex
      sx={{
        flexDirection: 'row',
        height: '100%',
      }}
    >
      <MapList
        pins={filteredPins}
        allToggleFilters={allToggleFilters}
        activePinFilters={activePinFilters}
        setActivePinFilters={setActivePinFilters}
        setShowMobileList={setShowMobileList}
        showMobileList={showMobileList}
        onBlur={onBlur}
        onLocationChange={onLocationChange}
      />

      <MapView
        allPins={allPins}
        center={center}
        setCenter={setCenter}
        mapRef={mapRef}
        zoom={mapZoom}
        setBoundaries={setBoundaries}
        setZoom={setZoom}
        onPinClick={onPinClick}
        onBlur={onBlur}
        setShowMobileList={setShowMobileList}
      />
    </Flex>
  )
}
