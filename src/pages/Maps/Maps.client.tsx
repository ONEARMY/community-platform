import { useEffect, useMemo, useState } from 'react'
import { Box } from 'theme-ui'

import { allMapFilterOptions } from './Content/MapView/allMapFilterOptions'
import { MapContainer } from './Content/MapView/MapContainer'
import { mapPinService } from './map.service'

import type { IMapPin, MapFilterOptionsList } from 'oa-shared'

import './styles.css'

const STARTING_NOTIFICATION = 'Loading...'

const MapsPage = () => {
  const [allPins, setAllPins] = useState<IMapPin[] | null>(null)
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

  const allToggleFilters: MapFilterOptionsList = useMemo(() => {
    if (!allPins) {
      return []
    }

    const pinDetails = allPins.map(({ creator }) => [
      creator?.profileType,
      // Hiding member tags for the moment
      ...(creator?.tags && creator?.profileType !== 'member'
        ? creator.tags.map(({ _id }) => _id)
        : []),
      ...(creator?.badges
        ? Object.keys(creator?.badges).filter((key) => key)
        : []),
    ])

    const filtersNeeded = [...new Set(pinDetails.flat())]

    return allMapFilterOptions.filter((validFilter) =>
      filtersNeeded.some((neededfilter) => neededfilter === validFilter._id),
    )
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
