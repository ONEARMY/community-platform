import { useEffect, useMemo, useState } from 'react'
import { Box } from 'theme-ui'

import { allMapFilterOptions } from './Content/MapView/allMapFilterOptions'
import { MapContainer } from './Content/MapView/MapContainer'
import { mapPinService } from './map.service'

import type { MapFilterOption, MapPin } from 'oa-shared'

import './styles.css'

const STARTING_NOTIFICATION = 'Loading...'

const MapsPage = () => {
  const [allPins, setAllPins] = useState<MapPin[] | null>(null)
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

  const allToggleFilters = useMemo<MapFilterOption[]>(() => {
    if (!allPins) {
      return []
    }

    const pinDetails = allPins.map(({ profile }) => {
      return [
        profile?.type,
        // Hiding member tags for the moment
        ...(profile?.type && profile?.type !== 'member'
          ? profile.tags?.map(({ name }) => name) || []
          : []),
        ...(profile?.isVerified ? ['verified'] : []),
        ...(profile?.isSupporter ? ['supporter'] : []),
        ...(profile?.openToVisitors ? ['visitors'] : []),
      ]
    })

    const filtersNeeded = [...new Set(pinDetails.flat())]

    return allMapFilterOptions.filter((validFilter) =>
      filtersNeeded.some((neededfilter) => neededfilter === validFilter._id),
    )
  }, [allPins])

  return (
    <Box id="mapPage" sx={{ height: 'calc(100vh - 80px)', width: '100%' }}>
      <MapContainer
        allPins={allPins}
        allToggleFilters={allToggleFilters}
        notification={notification}
      />
    </Box>
  )
}

export default MapsPage
