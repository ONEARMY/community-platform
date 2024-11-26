import { useEffect, useState } from 'react'
import { Box } from 'theme-ui'

import { allMapFilterOptions } from './Content/MapView/allMapFilterOptions'
import { MapContainer } from './Content/MapView/MapContainer'
import { mapPinService } from './map.service'

import type { IMapPin, MapFilterOptionsList } from 'oa-shared'

import './styles.css'

const STARTING_NOTIFICATION = 'Loading...'

const MapsPage = () => {
  const [allPins, setAllPins] = useState<IMapPin[] | null>(null)
  const [allToggleFilters, setAllToggleFilters] =
    useState<MapFilterOptionsList>([])
  const [notification, setNotification] = useState<string>(
    STARTING_NOTIFICATION,
  )

  useEffect(() => {
    const fetchMapPins = async () => {
      try {
        const pins = await mapPinService.getMapPins()
        setAllPins(pins)
        setNotification('')
      } catch (error) {
        setNotification(error)
      }
    }

    fetchMapPins()
  }, [])

  useEffect(() => {
    if (allPins) {
      const pinDetails = allPins.map(({ creator }) => [
        creator?.profileType,
        ...(creator?.tags ? creator.tags.map(({ _id }) => _id) : []),
      ])
      const filtersNeeded = [...new Set(pinDetails.flat())]
      const allNeededPinFilters = allMapFilterOptions.filter((validFilter) =>
        filtersNeeded.some((neededfilter) => neededfilter === validFilter._id),
      )
      setAllToggleFilters(allNeededPinFilters)
    }
  }, [allPins])

  return (
    <Box id="mapPage" sx={{ height: 'calc(100vh - 120px)', width: '100%' }}>
      <MapContainer
        allPins={allPins}
        allToggleFilters={allToggleFilters}
        notification={notification}
      />
    </Box>
  )
}

export default MapsPage
