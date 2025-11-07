import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from '@remix-run/react'
import { Box, Flex } from 'theme-ui'

import { MapList } from './Content/MapView/MapList'
import { MapView } from './Content/MapView/MapView'
import { filterPins } from './utils/filterPins'
import { mapPinService } from './map.service'
import { MapContext } from './MapContext'

import type { LatLngBounds, Marker } from 'leaflet'
import type {
  ILatLng,
  MapPin,
  ProfileBadge,
  ProfileTag,
  ProfileType,
} from 'oa-shared'
import type { Map as MapType } from 'react-leaflet'

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
  const [zoom, setZoom] = useState<number>(2)
  const [mapRef, setMapRef] = useState<MapType | null>(null)
  const [clusterGroupRef, setClusterGroupRef] = useState<any>(null)

  const updateMapView = (location: ILatLng, zoomLevel: number) => {
    if (mapRef?.leafletElement) {
      mapRef.leafletElement.setView([location.lat, location.lng], zoomLevel)
    }
    setPinLocation(location)
    setZoom(zoomLevel)
  }

  const panMapTo = (location: ILatLng) => {
    if (mapRef?.leafletElement) {
      mapRef.leafletElement.panTo([location.lat, location.lng])
    }
  }

  const fitMapBounds = (bounds: LatLngBounds) => {
    if (mapRef?.leafletElement) {
      mapRef.leafletElement.fitBounds(bounds)
    }
  }

  const selectPinAndHandleCluster = (pin: MapPin) => {
    selectPin(pin)

    const clusterGroup = clusterGroupRef?.leafletElement

    if (clusterGroup?.getLayers && mapRef) {
      const allMarkers = clusterGroup.getLayers()
      const marker = allMarkers.find((m: Marker) => {
        const pos = m.getLatLng()
        return pos.lat === Number(pin.lat) && pos.lng === Number(pin.lng)
      })

      if (marker) {
        const visibleParent = clusterGroup.getVisibleParent(marker)
        if (visibleParent !== marker && visibleParent.getBounds) {
          fitMapBounds(visibleParent.getBounds())
          return
        }
      }
    }

    panMapTo({ lat: pin.lat, lng: pin.lng })
  }

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
    if (selectedPin) {
      const isPinStillVisible = filteredPins.some(
        (pin) => pin.id === selectedPin.id,
      )
      if (!isPinStillVisible) {
        selectPin(null)
      }
    }
  }, [filteredPins, selectedPin])

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

        setAllPins(
          pinsToSet.sort((x) =>
            x.profile.lastActive
              ? -new Date(x.profile.lastActive).getTime()
              : 0,
          ),
        )

        if (filters?.filters) {
          const sortedTypes = (filters.filters.types || [])
            .slice()
            .sort((a, b) => a.order - b.order)
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
        if (selectedPin?.profile?.username !== username) {
          selectPinAndHandleCluster(foundPin)
        }
      } else {
        selectPin(foundPin)
      }
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
        selectPinWithClusterCheck: selectPinAndHandleCluster,
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
        zoom,
        setZoom,
        setView: updateMapView,
        panTo: panMapTo,
        fitBounds: fitMapBounds,
        setMapRef,
        setClusterGroupRef,
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
