import L from 'leaflet';
import { type MarkerCluster, MarkerClusterGroup } from 'leaflet.markercluster';
import type { MapPin } from 'oa-shared';
import { type RefObject, useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import { createClusterIcon, createMarkerIcon } from './Sprites';

interface IProps {
  pins: MapPin[];
  onPinClick: (pin: MapPin) => void;
  onClusterClick: (cluster: MarkerCluster) => void;
  clusterGroupRef?: RefObject<any>;
}

/**
 * Manages map pin clusters using Leaflet's MarkerClusterGroup directly.
 * Markers are added/removed differentially to avoid the full clear+re-add
 * cycle that causes visible blinking.
 *
 * @see https://github.com/Leaflet/Leaflet.markercluster#clusters-methods
 */
export const Clusters = ({ pins, onPinClick, onClusterClick, clusterGroupRef }: IProps) => {
  const map = useMap();
  const groupRef = useRef<MarkerClusterGroup | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  // Keep callbacks in refs so the cluster group and markers always invoke the
  // latest version without needing to tear down and recreate Leaflet objects.
  const onPinClickRef = useRef(onPinClick);
  const onClusterClickRef = useRef(onClusterClick);
  onPinClickRef.current = onPinClick;
  onClusterClickRef.current = onClusterClick;

  const iconCreateFn = createClusterIcon();
  const iconCreateFnRef = useRef(iconCreateFn);
  iconCreateFnRef.current = iconCreateFn;

  // Create the MarkerClusterGroup once and attach it to the map.
  useEffect(() => {
    const group = MarkerClusterGroup({
      iconCreateFunction: (cluster) => iconCreateFnRef.current(cluster),
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      maxClusterRadius: 54,
    });

    group.on('clusterclick', (e: any) => {
      onClusterClickRef.current(e.layer);
    });

    map.addLayer(group);
    groupRef.current = group;

    if (clusterGroupRef) {
      (clusterGroupRef as React.MutableRefObject<any>).current = group;
    }

    return () => {
      map.removeLayer(group);
      markersRef.current.clear();
      groupRef.current = null;
      if (clusterGroupRef) {
        (clusterGroupRef as React.MutableRefObject<any>).current = null;
      }
    };
  }, [map, clusterGroupRef]);

  // Differential marker updates — only add/remove changed pins.
  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;

    const currentMarkers = markersRef.current;
    const validPins = pins.filter((p) => Boolean(p.lat));
    const newPinIds = new Set(validPins.map((p) => String(p.id)));

    // Collect markers to remove
    const toRemove: L.Marker[] = [];
    for (const [id, marker] of currentMarkers) {
      if (!newPinIds.has(id)) {
        toRemove.push(marker);
        currentMarkers.delete(id);
      }
    }

    // Collect markers to add
    const toAdd: L.Marker[] = [];
    for (const pin of validPins) {
      const id = String(pin.id);
      if (!currentMarkers.has(id)) {
        const marker = L.marker([pin.lat, pin.lng], {
          icon: createMarkerIcon(pin),
        });
        marker.on('click', () => onPinClickRef.current(pin));
        currentMarkers.set(id, marker);
        toAdd.push(marker);
      }
    }

    if (toRemove.length) group.removeLayers(toRemove);
    if (toAdd.length) group.addLayers(toAdd);
  }, [pins]);

  // No React children — markers are managed imperatively above.
  return null;
};
