import type { DivIcon, LatLng, Marker as LeafletMarker } from 'leaflet';
import L from 'leaflet';
import { useRef } from 'react';
import { Marker } from 'react-leaflet';
import customMarkerIcon from '../../assets/icons/map-marker.png';

const customMarker = L.icon({
  iconUrl: customMarkerIcon,
  iconSize: [20, 28],
  iconAnchor: [10, 28],
});

export interface IProps {
  position: {
    lat: number;
    lng: number;
  };
  onDrag(latlng: LatLng): void;
  markerIcon?: DivIcon;
  onClick?: () => void;
}

export const MapPin = (props: IProps) => {
  const markerRef = useRef<LeafletMarker>(null);

  const handleDrag = () => {
    const marker = markerRef.current;

    if (!marker) {
      return;
    }

    const markerLatLng = marker.getLatLng();
    if (props.onDrag) {
      props.onDrag(markerLatLng);
    }
  };

  return (
    <Marker
      draggable
      eventHandlers={{
        drag: handleDrag,
        click: props.onClick,
      }}
      position={[props.position.lat, props.position.lng]}
      ref={markerRef}
      icon={props.markerIcon || customMarker}
    />
  );
};
