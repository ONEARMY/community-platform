import { forwardRef } from 'react';
import type { MapContainerProps } from 'react-leaflet';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import './index.css';

export interface IProps {
  setZoom: (arg: number) => void;
  children?: React.ReactNode | React.ReactNode[];
  center?: MapContainerProps['center'];
  zoom?: MapContainerProps['zoom'];
  maxZoom?: MapContainerProps['maxZoom'];
  zoomControl?: MapContainerProps['zoomControl'];
  style?: React.CSSProperties;
  doubleClickZoom?: MapContainerProps['doubleClickZoom'];
}

// Component to handle map events
function MapEventHandler({ setZoom }: { setZoom: (zoom: number) => void }) {
  useMapEvents({
    zoomend: (e) => {
      setZoom(e.target.getZoom());
    },
  });
  return null;
}

// biome-ignore lint/suspicious/noShadowRestrictedNames: this is an external library import
export const Map = forwardRef<L.Map, IProps>((props, ref) => {
  const { setZoom, children, ...mapProps } = props;

  return (
    <MapContainer ref={ref} {...mapProps}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <MapEventHandler setZoom={setZoom} />
      {children}
    </MapContainer>
  );
});

Map.displayName = 'Map';
