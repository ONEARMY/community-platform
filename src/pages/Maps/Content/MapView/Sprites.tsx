import type { MarkerCluster } from 'leaflet';
import { divIcon, point } from 'leaflet';
import type { MapPin } from 'oa-shared';
import { useEffect, useRef } from 'react';
import clusterIcon from 'src/assets/icons/map-cluster.svg';
import AwaitingModerationHighlight from 'src/assets/icons/map-unpproved-pin.svg';

import './sprites.css';

/**
 * Generate custom cluster icon, including style formatting, size, image etc.
 * @param opts - optional parameters could be passed from parent,
 * such as total pins. Currently none used, but retaining
 */
export const createClusterIcon = () => {
  const iconAsStringRef = useRef<string>('');

  useEffect(() => {
    // Resolve CSS variable to actual hex for SVG attribute replacement
    // (SVG attributes like fill="#..." don't support CSS variables)
    const resolved = getComputedStyle(document.documentElement)
      .getPropertyValue('--color-primary')
      .trim();

    fetch(clusterIcon)
      .then((response) => response.text())
      .then((data) => {
        iconAsStringRef.current = data.replaceAll(
          /#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})/g,
          resolved,
        );
      })
      .catch((fetchError) => console.error(fetchError));
  }, []);

  return (cluster: MarkerCluster) => {
    const className = ['icon'];
    let icon: any;
    let outlineSize: number = 0;
    const clusterChildCount: number = cluster.getChildCount();
    if (clusterChildCount > 1) {
      className.push('icon-cluster-many');
      icon = iconAsStringRef.current;
      // Calcute Outline CSS
      if (clusterChildCount > 49) {
        outlineSize = 24;
      } else {
        outlineSize = 4 + ((clusterChildCount - 2) / 50) * 20;
      }
    } else if (clusterChildCount === 1) {
      const childMarkers = cluster.getAllChildMarkers();
      const firstPin = childMarkers[0]?.options as any;
      icon = firstPin?.icon ? `<img src="${firstPin.icon}" />` : '';
    }
    const { fontSize, iconSize, lineHeight } = getClusterSizes(cluster);

    const borderRadius = lineHeight / 2;

    return divIcon({
      html: `${icon}<span class="icon-cluster-text" style="
        background: var(--color-primary);
        font-size: ${fontSize}px;
        line-height: ${lineHeight}px;
        border-radius: ${borderRadius}px;
        outline: ${outlineSize}px solid color-mix(in srgb, var(--color-primary) 50%, transparent);
        ">${clusterChildCount}</span>`,
      className: className.join(' '),
      iconSize: point(iconSize, iconSize, true),
    });
  };
};

export const createMarkerIcon = (pin: MapPin, draggable?: boolean) => {
  const icon =
    pin.moderation === 'accepted'
      ? pin.profile!.type?.smallImageUrl || clusterIcon
      : AwaitingModerationHighlight;
  return divIcon({
    className: `icon-marker icon-${pin.profile!.type}`,
    html: `<img data-cy="pin-${pin.profile.username}" src="${icon}" style="${draggable ? 'cursor: grab' : ''}" />`,
    iconSize: point(38, 38, true),
  });
};

/**
 * Depending on size of cluster, return range for font and icon sizes
 * to scale cluster depending on value and ensure fits in icon
 * @param cluster - MarkerCluster passed from creation function
 */
const getClusterSizes = (cluster: MarkerCluster) => {
  const count = cluster.getChildCount();
  const order = Math.round(count).toString().length;
  switch (order) {
    case 1:
      return {
        fontSize: 18,
        iconSize: 26,
        lineHeight: 22,
      };
    case 2:
      return {
        fontSize: 18,
        iconSize: 32,
        lineHeight: 28,
      };

    default:
      return {
        fontSize: 18,
        iconSize: 44,
        lineHeight: 40,
      };
  }
};
