import { useState } from 'react';
import { ZoomControl } from 'react-leaflet';
import { Box, Flex } from 'theme-ui';

import { Map } from '../Map/Map.client';
import { OsmGeocoding } from '../OsmGeocoding/OsmGeocoding';
import { MapPin } from './MapPin.client';

import type { DivIcon } from 'leaflet';
import type { Map as MapType } from 'react-leaflet';
import type { Result } from '../OsmGeocoding/types';

import 'leaflet/dist/leaflet.css';

export interface Props {
  mapRef: React.RefObject<MapType | null>;
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

export const MapWithPin = (props: Props) => {
  const [zoom, setZoom] = useState(props.zoom || 1);
  const [center, setCenter] = useState(props.center || [props.position.lat, props.position.lng]);
  const { mapRef, position, markerIcon, onClickMapPin, popup } = props;

  return (
    <Flex sx={{ flexDirection: 'column', gap: 2 }}>
      <div
        style={{
          position: 'relative',
          borderRadius: 6,
          overflow: 'hidden',
        }}
      >
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

        <Map
          ref={mapRef}
          className="markercluster-map settings-page"
          center={center}
          zoom={zoom}
          zoomControl={false}
          setZoom={setZoom}
          onclick={(e) => props.updatePosition({ lat: e.latlng.lat, lng: e.latlng.lng })}
          doubleClickZoom={false}
          style={{
            height: '360px',
            zIndex: 1,
          }}
        >
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
      </div>
    </Flex>
  );
};
