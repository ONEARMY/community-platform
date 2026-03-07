import type { LatLngExpression, Map as LeafletMap } from 'leaflet';
// biome-ignore lint/suspicious/noShadowRestrictedNames: this is an external library import
import { Button, Map } from 'oa-components';
import { useCallback, useContext, useEffect, useRef } from 'react';
import { useMapEvents } from 'react-leaflet';
import { Box, Flex } from 'theme-ui';
import { MapContext } from '../../MapContext';
import { ButtonZoomIn } from './ButtonZoomIn.client';
import { Clusters } from './Cluster.client';
import { Popup } from './Popup.client';

// Component to handle map events
function MapEventsHandler({
  onLocationChange,
  onMapClick,
}: {
  onLocationChange: () => void;
  onMapClick: () => void;
}) {
  useMapEvents({
    dragend: onLocationChange,
    zoomend: onLocationChange,
    resize: onLocationChange,
    click: onMapClick,
  });
  return null;
}

export const MapView = () => {
  const mapState = useContext(MapContext);
  const mapRef = useRef<LeafletMap>(null);
  const clusterGroupRef = useRef<any>(null);

  // Extract stable references — useState setters and useCallback-wrapped
  // functions from the context never change identity.
  const setBoundaries = mapState?.setBoundaries;
  const selectPin = mapState?.selectPin;
  const fitBounds = mapState?.fitBounds;

  useEffect(() => {
    if (mapRef.current && mapState) {
      mapState.setMapRef(mapRef.current);
    }
  }, [mapRef.current, mapState]);

  useEffect(() => {
    if (clusterGroupRef.current && mapState) {
      mapState.setClusterGroupRef(clusterGroupRef.current);
    }
  }, [clusterGroupRef.current, mapState]);

  // All hooks must be declared before any early return (Rules of Hooks).
  const handleLocationChange = useCallback(() => {
    if (mapRef.current && setBoundaries) {
      setBoundaries(mapRef.current.getBounds());
    }
  }, [setBoundaries]);

  const handleMapClick = useCallback(() => {
    selectPin?.(null);
  }, [selectPin]);

  const handleClusterClick = useCallback(
    (cluster: any) => {
      fitBounds?.(cluster.getBounds());
    },
    [fitBounds],
  );

  const handlePinClose = useCallback(() => {
    selectPin?.(null);
  }, [selectPin]);

  if (!mapState) {
    return null;
  }

  const isViewportGreaterThanTablet = window.innerWidth > 1024;
  const mapCenter: LatLngExpression = mapState.location
    ? [mapState.location.lat, mapState.location.lng]
    : [0, 0];

  return (
    <Box className="markercluster-map" sx={{ flex: 1 }}>
      <Map
        ref={mapRef}
        center={mapCenter}
        zoom={mapState.zoom}
        setZoom={mapState.setZoom}
        maxZoom={18}
        style={{ flex: 1, backgroundColor: '#AAD3DF', height: '100%', width: '100%' }}
        zoomControl={isViewportGreaterThanTablet}
      >
        <MapEventsHandler onLocationChange={handleLocationChange} onMapClick={handleMapClick} />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            padding: 4,
            zIndex: 1001,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <ButtonZoomIn
            setCenter={(value) => mapState.setLocation(value)}
            setZoom={mapState.setZoom}
          />
        </Box>

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
            onClick={() => mapState.setIsMobile(true)}
            small
          >
            Show list view
          </Button>
        </Flex>
        {mapState.mapPins && mapState.mapPins.length > 0 && (
          <Clusters
            pins={mapState.mapPins}
            onPinClick={mapState.selectPinWithClusterCheck}
            onClusterClick={handleClusterClick}
            clusterGroupRef={clusterGroupRef}
          />
        )}
        {mapState.selectedPin && (
          <Popup activePin={mapState.selectedPin} mapRef={mapRef} onClose={handlePinClose} />
        )}
      </Map>
    </Box>
  );
};
