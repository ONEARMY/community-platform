import { MarkerCluster } from 'leaflet';
import 'leaflet.markercluster';
import type { MapPin } from 'oa-shared';
import type { RefObject } from 'react';
import { Marker } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { createClusterIcon, createMarkerIcon } from './Sprites';

// import 'react-leaflet-markercluster/dist/styles.min.css';

interface IProps {
  pins: MapPin[];
  onPinClick: (pin: MapPin) => void;
  onClusterClick: (cluster: MarkerCluster) => void;
  clusterGroupRef?: RefObject<any>;
}

export const Clusters = ({ pins, onPinClick, onClusterClick, clusterGroupRef }: IProps) => {
  /**
   * Documentation of Leaflet Clusters for better understanding
   * https://github.com/Leaflet/Leaflet.markercluster#clusters-methods
   *
   */
  return (
    <MarkerClusterGroup
      ref={clusterGroupRef}
      iconCreateFunction={createClusterIcon()}
      showCoverageOnHover={false}
      spiderfyOnMaxZoom={true}
      // Pin Icon size is always 37x37 px
      // This means max overlay of pins is 5px when not clustered
      maxClusterRadius={54}
      eventHandlers={{
        clusterclick: (e: { layer: MarkerCluster }) => onClusterClick(e.layer),
      }}
    >
      {pins
        .filter(({ lat }) => Boolean(lat))
        .map((pin) => (
          <Marker
            key={pin.id}
            position={[pin.lat, pin.lng]}
            icon={createMarkerIcon(pin)}
            eventHandlers={{
              click: () => onPinClick(pin),
            }}
          />
        ))}
    </MarkerClusterGroup>
  );
};
