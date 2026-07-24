import L from 'leaflet';
import type { MapPin } from 'oa-shared';
import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import { createMarkerIcon } from './Sprites';

interface IProps {
  pins: MapPin[];
  onPinClick: (pin: MapPin) => void;
  selectedPin?: MapPin | null;
}

/**
 * Renders individual map pins without clustering.
 */
export const Markers = ({ pins, onPinClick, selectedPin }: IProps) => {
  const map = useMap();
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const onPinClickRef = useRef(onPinClick);
  onPinClickRef.current = onPinClick;

  // Update markers when pins change
  useEffect(() => {
    const currentMarkers = markersRef.current;
    const validPins = pins.filter((p) => Boolean(p.lat));
    const newPinIds = new Set(validPins.map((p) => String(p.id)));

    // Remove markers that are no longer in pins
    const toRemove: string[] = [];
    for (const [id, marker] of currentMarkers) {
      if (!newPinIds.has(id)) {
        map.removeLayer(marker);
        toRemove.push(id);
      }
    }
    for (const id of toRemove) {
      currentMarkers.delete(id);
    }

    // Add new markers
    for (const pin of validPins) {
      const id = String(pin.id);
      const isSelectedPin = pin.id === selectedPin?.id;

      if (!currentMarkers.has(id)) {
        const marker = L.marker([pin.lat, pin.lng], {
          icon: createMarkerIcon(pin, isSelectedPin),
        });
        marker.on('click', () => onPinClickRef.current(pin));
        marker.addTo(map);
        currentMarkers.set(id, marker);
      }
    }
  }, [pins, map]);

  // Cleanup on unmount only
  useEffect(() => {
    return () => {
      for (const marker of markersRef.current.values()) {
        map.removeLayer(marker);
      }
      markersRef.current.clear();
    };
  }, [map]);

  return null;
};
