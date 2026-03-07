import type { LatLngBounds, Map as LeafletMap, Marker } from 'leaflet';
import type { ILatLng, MapPin, ProfileBadge, ProfileTag, ProfileType } from 'oa-shared';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Box, Flex } from 'theme-ui';
import { MapList } from './Content/MapView/MapList';
import { MapView } from './Content/MapView/MapView';
import { MapContext } from './MapContext';
import { mapPinService } from './map.service';
import { filterPins, sortPinsByBadgeThenLastActive } from './utils/pinUtils';

import './styles.css';

const MapsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [boundaries, setBoundaries] = useState<LatLngBounds | null>(null);
  const [allPins, setAllPins] = useState<MapPin[] | null>(null);
  const [allProfileTypes, setAllProfileTypes] = useState<ProfileType[]>([]);
  const [allBadges, setAllBadges] = useState<ProfileBadge[]>([]);
  const [allTags, setAllTags] = useState<ProfileTag[]>([]);
  const [allProfileSettings, setAllProfileSettings] = useState<string[]>([]);
  const [activeBadgeFilters, setActiveBadges] = useState<string[]>([]);
  const [activeProfileSettingFilters, setActiveSettings] = useState<string[]>([]);
  const [activeProfileTypeFilters, setActiveTypes] = useState<string[]>([]);
  const [activeTagFilters, setActiveTags] = useState<number[]>([]);
  const [pinLocation, setPinLocation] = useState<ILatLng>({
    lat: 30.0,
    lng: 19.0,
  });
  const [selectedPin, selectPin] = useState<MapPin | null | undefined>(undefined);
  const [loadingMessage, setLoadingMessage] = useState<string>('Loading...');
  const [isMobile, setIsMobile] = useState(false);
  const [zoom, setZoom] = useState<number>(2);
  const [mapRef, setMapRef] = useState<LeafletMap | null>(null);
  const [clusterGroupRef, setClusterGroupRef] = useState<any>(null);

  const updateMapView = useCallback(
    (location: ILatLng, zoomLevel: number) => {
      if (mapRef) {
        mapRef.setView([location.lat, location.lng], zoomLevel);
      }
      setPinLocation(location);
      setZoom(zoomLevel);
    },
    [mapRef],
  );

  const panMapTo = useCallback(
    (location: ILatLng) => {
      if (mapRef) {
        mapRef.panTo([location.lat, location.lng]);
      }
    },
    [mapRef],
  );

  const fitMapBounds = useCallback(
    (bounds: LatLngBounds) => {
      if (mapRef) {
        mapRef.fitBounds(bounds);
      }
    },
    [mapRef],
  );

  const selectPinAndHandleCluster = useCallback(
    (pin: MapPin) => {
      selectPin(pin);

      const clusterGroup = clusterGroupRef;

      if (clusterGroup?.getLayers && mapRef) {
        const allMarkers = clusterGroup.getLayers();
        const marker = allMarkers.find((m: Marker) => {
          const pos = m.getLatLng();
          return pos.lat === Number(pin.lat) && pos.lng === Number(pin.lng);
        });

        if (marker) {
          const visibleParent = clusterGroup.getVisibleParent(marker);
          if (visibleParent !== marker && visibleParent.getBounds) {
            fitMapBounds(visibleParent.getBounds());
            return;
          }
        }
      }

      panMapTo({ lat: pin.lat, lng: pin.lng });
    },
    [clusterGroupRef, mapRef, fitMapBounds, panMapTo],
  );

  // Pins filtered by tags/types/badges/settings only (no boundary filter).
  // Used by the map clusters — Leaflet handles viewport clipping internally.
  const mapPins = useMemo<MapPin[]>(() => {
    return filterPins(allPins || [], {
      settings: activeProfileSettingFilters,
      badges: activeBadgeFilters,
      types: activeProfileTypeFilters,
      tags: activeTagFilters,
    });
  }, [
    allPins,
    activeProfileSettingFilters,
    activeBadgeFilters,
    activeProfileTypeFilters,
    activeTagFilters,
  ]);

  // Pins filtered by everything including boundaries — used by the list view.
  const filteredPins = useMemo<MapPin[]>(() => {
    return filterPins(allPins || [], {
      settings: activeProfileSettingFilters,
      badges: activeBadgeFilters,
      types: activeProfileTypeFilters,
      tags: activeTagFilters,
      boundaries: boundaries ?? undefined,
    });
  }, [
    allPins,
    activeProfileSettingFilters,
    activeBadgeFilters,
    activeProfileTypeFilters,
    activeTagFilters,
    boundaries,
  ]);

  useEffect(() => {
    if (selectedPin && allPins && allPins.length > 0 && boundaries) {
      const isPinStillVisible = filteredPins.some((pin) => pin.id === selectedPin.id);
      if (!isPinStillVisible) {
        selectPin(null);
      }
    }
  }, [filteredPins, selectedPin, allPins, boundaries]);

  useEffect(() => {
    const init = async () => {
      try {
        const [pins, filters, userPin] = await Promise.all([
          mapPinService.getMapPins(),
          mapPinService.getMapFilters(),
          mapPinService.getCurrentUserMapPin(),
        ]);
        let pinsToSet: MapPin[] = [];
        if (pins) {
          pinsToSet = pins;
        }

        // might be missing because it's not approved
        const existingPinIndex = pinsToSet.findIndex((x) => x.id === userPin?.id);

        if (userPin) {
          if (existingPinIndex >= 0) {
            pinsToSet[existingPinIndex] = userPin;
          } else {
            pinsToSet.push(userPin);
          }
        }

        setAllPins(sortPinsByBadgeThenLastActive(pinsToSet, 'pro'));

        if (filters?.filters) {
          const sortedTypes = (filters.filters.types || [])
            .slice()
            .sort((a, b) => a.order - b.order);
          setAllProfileTypes(sortedTypes);
          setAllBadges(filters.filters.badges || []);
          setAllTags(filters.filters.tags || []);
          setAllProfileSettings(filters.filters.settings || []);
        }
        if (filters?.defaultFilters?.types) {
          setActiveTypes(filters.defaultFilters.types);
        }

        setLoadingMessage('');
      } catch (error) {
        setLoadingMessage(error);
      }
    };
    init();
  }, []);

  const toggleActiveBadgeFilter = useCallback((value: string) => {
    setActiveBadges((prev) =>
      prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value],
    );
  }, []);
  const toggleActiveProfileSettingFilter = useCallback((value: string) => {
    setActiveSettings((prev) =>
      prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value],
    );
  }, []);
  const toggleActiveProfileTypeFilter = useCallback((value: string) => {
    setActiveTypes((prev) =>
      prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value],
    );
  }, []);
  const toggleActiveTagFilter = useCallback((value: number) => {
    setActiveTags((prev) =>
      prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value],
    );
  }, []);

  useEffect(() => {
    if (selectedPin) {
      navigate(`/map#${selectedPin.profile!.username}`, { replace: true });
    } else if (selectedPin === null) {
      navigate('/map', { replace: true });
    }
  }, [selectedPin]);

  useEffect(() => {
    const pinId = location.hash.slice(1);
    const username = pinId.length > 0 ? pinId : undefined;

    if (allPins && username) {
      const foundPin = allPins.find((pin) => pin.profile!.username === username);
      if (foundPin) {
        const isPinVisible = filteredPins.some((pin) => pin.id === foundPin.id);
        if (isPinVisible && selectedPin?.profile?.username !== username) {
          selectPinAndHandleCluster(foundPin);
        }
      } else {
        selectPin(foundPin);
      }
    }
  }, [location.hash, allPins, filteredPins]);

  const contextValue = useMemo(
    () => ({
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
      mapPins,
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
    }),
    [
      allPins,
      allProfileTypes,
      allProfileSettings,
      allBadges,
      allTags,
      pinLocation,
      loadingMessage,
      selectedPin,
      selectPinAndHandleCluster,
      mapPins,
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
      boundaries,
      zoom,
      updateMapView,
      panMapTo,
      fitMapBounds,
    ],
  );

  return (
    <MapContext.Provider value={contextValue}>
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
  );
};

export default MapsPage;
