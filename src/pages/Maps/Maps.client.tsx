import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from '@remix-run/react'
import { Box, Flex } from 'theme-ui'

import { MapList } from './Content/MapView/MapList'
import { MapView } from './Content/MapView/MapView'
import { filterPins } from './utils/filterPins'
import { mapPinService } from './map.service'
import { MapContext } from './MapContext'

import type { LatLngBounds } from 'leaflet'
import type {
  ILatLng,
  MapPin,
  ProfileBadge,
  ProfileTag,
  ProfileType,
} from 'oa-shared'

import './styles.css'

const MapsPage = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [boundaries, setBoundaries] = useState<LatLngBounds | null>(null)
  const [allPins, setAllPins] = useState<MapPin[] | null>(null)
  const [allProfileTypes, setAllProfileTypes] = useState<ProfileType[]>([])
  const [allBadges, setAllBadges] = useState<ProfileBadge[]>([])
  const [allTags, setAllTags] = useState<ProfileTag[]>([])
  const [allProfileSettings, setAllProfileSettings] = useState<string[]>([])
  const [activeBadgeFilters, setActiveBadges] = useState<string[]>([])
  const [activeProfileSettingFilters, setActiveSettings] = useState<string[]>(
    [],
  )
  const [activeProfileTypeFilters, setActiveTypes] = useState<string[]>([])
  const [activeTagFilters, setActiveTags] = useState<number[]>([])
  const [pinLocation, setPinLocation] = useState<ILatLng>({
    lat: 30.0,
    lng: 19.0,
  })
  const [selectedPin, selectPin] = useState<MapPin | null | undefined>(
    undefined,
  )
  const [loadingMessage, setLoadingMessage] = useState<string>('Loading...')
  const [isMobile, setIsMobile] = useState(false)

  const filteredPins = useMemo<MapPin[]>(() => {
    return filterPins(allPins || [], {
      settings: activeProfileSettingFilters,
      badges: activeBadgeFilters,
      types: activeProfileTypeFilters,
      tags: activeTagFilters,
      boundaries: boundaries ?? undefined,
    })
  }, [
    allPins,
    activeProfileSettingFilters,
    activeBadgeFilters,
    activeProfileTypeFilters,
    activeTagFilters,
    boundaries,
  ])

  useEffect(() => {
    const init = async () => {
      try {
        const [pins, filters, userPin] = await Promise.all([
          mapPinService.getMapPins(),
          mapPinService.getMapFilters(),
          mapPinService.getCurrentUserMapPin(),
        ])
        let pinsToSet: MapPin[] = []
        if (pins) {
          pinsToSet = pins
        }

        // might be missing because it's not approved
        const existingPinIndex = pinsToSet.findIndex(
          (x) => x.id === userPin?.id,
        )

        if (userPin) {
          if (existingPinIndex >= 0) {
            pinsToSet[existingPinIndex] = userPin
          } else {
            pinsToSet.push(userPin)
          }
        }

        setAllPins(pinsToSet)

        if (filters?.filters) {
          const sortedTypes = (filters.filters.types || []).toSorted(
            (a, b) => a.order - b.order,
          )
          setAllProfileTypes(sortedTypes)
          setAllBadges(filters.filters.badges || [])
          setAllTags(filters.filters.tags || [])
          setAllProfileSettings(filters.filters.settings || [])
        }
        if (filters?.defaultFilters?.types) {
          setActiveTypes(filters.defaultFilters.types)
        }

        setLoadingMessage('')
      } catch (error) {
        setLoadingMessage(error)
      }
    }
    init()
  }, [])

  const toggleActiveBadgeFilter = (value: string) => {
    if (activeBadgeFilters.includes(value)) {
      setActiveBadges(activeBadgeFilters.filter((x) => x !== value))
    } else {
      setActiveBadges((values) => [...values, value])
    }
  }
  const toggleActiveProfileSettingFilter = (value: string) => {
    if (activeProfileSettingFilters.includes(value)) {
      setActiveSettings(activeProfileSettingFilters.filter((x) => x !== value))
    } else {
      setActiveSettings((values) => [...values, value])
    }
  }
  const toggleActiveProfileTypeFilter = (value: string) => {
    if (activeProfileTypeFilters.includes(value)) {
      setActiveTypes(activeProfileTypeFilters.filter((x) => x !== value))
    } else {
      setActiveTypes((values) => [...values, value])
    }
  }
  const toggleActiveTagFilter = (value: number) => {
    if (activeTagFilters.includes(value)) {
      setActiveTags(activeTagFilters.filter((x) => x !== value))
    } else {
      setActiveTags((values) => [...values, value])
    }
  }

  useEffect(() => {
    if (selectedPin) {
      navigate(`/map#${selectedPin.profile!.username}`, { replace: true })
    } else if (selectedPin === null) {
      navigate('/map', { replace: true })
    }
  }, [selectedPin])

  useEffect(() => {
    const pinId = location.hash.slice(1)
    const username = pinId.length > 0 ? pinId : undefined

    if (allPins && username) {
      const foundPin = allPins.find((pin) => pin.profile!.username === username)
      if (foundPin) {
        selectPin(foundPin)
        setPinLocation({ lat: foundPin.lat, lng: foundPin.lng })
      }
      selectPin(foundPin)
    }
  }, [location.hash, allPins])

  return (
    <MapContext.Provider
      value={{
        allPins,
        allProfileTypes,
        allProfileSettings,
        allBadges,
        allTags,
        location: pinLocation,
        setLocation: setPinLocation,
        loadingMessage,
        selectedPin,
        selectPin,
        filteredPins,
        activeBadgeFilters,
        activeProfileSettingFilters,
        activeProfileTypeFilters,
        activeTagFilters,
        toggleActiveBadgeFilter,
        toggleActiveProfileSettingFilter,
        toggleActiveProfileTypeFilter,
        toggleActiveTagFilter,
        isMobile,
        setIsMobile,
        boundaries,
        setBoundaries,
      }}
    >
      <Box id="mapPage" sx={{ height: 'calc(100vh - 80px)', width: '100%' }}>
        <Flex
          sx={{
            flexDirection: 'row',
            height: '100%',
          }}
        >
          <MapList />

          <MapView />
        </Flex>
      </Box>
    </MapContext.Provider>
  )
}

export default MapsPage
