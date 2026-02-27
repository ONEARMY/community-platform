import type { DivIcon, Map as LeafletMap } from 'leaflet';
import { useState } from 'react';
import { useMapEvents, ZoomControl } from 'react-leaflet';
import { Box, Flex } from 'theme-ui';
// biome-ignore lint/suspicious/noShadowRestrictedNames: this is an external library import
import { Map } from '../Map/Map.client';
import { OsmGeocoding } from '../OsmGeocoding/OsmGeocoding';
import type { Result } from '../OsmGeocoding/types';
import { MapPin } from './MapPin.client';

import 'leaflet/dist/leaflet.css';

export interface Props {
  mapRef: React.RefObject<LeafletMap | null>;
  position: {
    lat: number;
    lng: number;
  };
  markerIcon?: DivIcon;
  updatePosition: (position: { lat: number; lng: number }) => void;
  center?: any;
  zoom?: number;
  onClickMapPin?: () => void;
  popup?: React.ReactNode;
}

// Component to handle map click events
function MapClickHandler({
  updatePosition,
}: {
  updatePosition: (position: { lat: number; lng: number }) => void;
}) {
  useMapEvents({
    click: (e) => {
      updatePosition({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export const MapWithPin = (props: Props) => {
  const [zoom, setZoom] = useState(props.zoom || 1);
  const [center, setCenter] = useState(props.center || [props.position.lat, props.position.lng]);
  const { mapRef, position, markerIcon, onClickMapPin, popup } = props;

  return (
    <Flex sx={{ flexDirection: 'column', gap: 2 }}>
      <Box
        sx={{
          position: 'absolute',
          zIndex: 2,
          padding: 4,
          top: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Flex style={{ width: '280px' }}>
          <OsmGeocoding
            placeholder="Type your address"
            callback={(data: Result) => {
              if (data.lat && data.lon) {
                props.updatePosition({
                  lat: Number(data.lat),
                  lng: Number(data.lon),
                });
                setCenter([data.lat, data.lon]);
                setZoom(15);
              }
            }}
            acceptLanguage="en"
          />
        </Flex>
      </Box>

      <Box
        className="markercluster-map settings-page"
        sx={{ borderRadius: 6, overflow: 'hidden', position: 'relative' }}
      >
        <Map
          ref={mapRef}
          center={center}
          zoom={zoom}
          zoomControl={false}
          setZoom={setZoom}
          doubleClickZoom={false}
          style={{
            height: '360px',
            zIndex: 1,
          }}
        >
          <MapClickHandler updatePosition={props.updatePosition} />
          <ZoomControl position="topleft" />
          <>
            {popup}
            {position?.lat && position.lng && (
              <MapPin
                position={position}
                markerIcon={markerIcon}
                onClick={onClickMapPin}
                onDrag={(evt: any) => {
                  if (evt.lat && evt.lng)
                    props.updatePosition({
                      lat: evt.lat,
                      lng: evt.lng,
                    });
                }}
              />
            )}
          </>
        </Map>
      </Box>
    </Flex>
  );
};
