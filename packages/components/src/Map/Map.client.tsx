import type { Ref, RefObject } from 'react';
import { forwardRef } from 'react';
import type { MapProps, Viewport } from 'react-leaflet';
import { Map as LeafletMap, TileLayer } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import './index.css';

export interface IProps extends MapProps {
  setZoom: (arg: number) => void;
  children?: React.ReactNode | React.ReactNode[];
  ref?: RefObject<LeafletMap> | undefined;
}

// biome-ignore lint/suspicious/noShadowRestrictedNames: this is an external library import
export const Map = forwardRef((props: IProps, ref: Ref<LeafletMap>) => {
  const onViewportChanged = (viewport: Viewport) => {
    if (viewport.zoom) {
      props.setZoom(viewport.zoom);
    }
  };

  return (
    <LeafletMap ref={ref} onViewportChanged={onViewportChanged} {...props}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />

      {props.children}
    </LeafletMap>
  );
});

Map.displayName = 'Map'; // Is this needed?
