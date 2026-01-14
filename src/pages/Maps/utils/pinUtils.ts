import type { LatLngBounds } from 'leaflet';
import type { IBoundingBox, MapPin } from 'oa-shared';

const filterByLatLong = (boundaries: IBoundingBox, pins: MapPin[]): MapPin[] => {
  return pins.filter(({ lat, lng }) => {
    const inLat = lat >= boundaries._southWest.lat && lat <= boundaries._northEast.lat;
    const inLng = lng >= boundaries._southWest.lng && lng <= boundaries._northEast.lng;
    return inLat && inLng;
  });
};

export const sortPinsByBadgeThenLastActive = (pins: MapPin[], badgeName: string): MapPin[] => {
  return [...pins].sort((a, b) => {
    const aHasBadge = a.profile?.badges?.some((badge) => badge.name === badgeName) ?? false;
    const bHasBadge = b.profile?.badges?.some((badge) => badge.name === badgeName) ?? false;

    if (aHasBadge && !bHasBadge) return -1;
    if (!aHasBadge && bHasBadge) return 1;

    const aTime = a.profile?.lastActive ? new Date(a.profile.lastActive).getTime() : 0;
    const bTime = b.profile?.lastActive ? new Date(b.profile.lastActive).getTime() : 0;
    return bTime - aTime;
  });
};

export const filterPins = (
  allPins: MapPin[],
  filters: {
    tags?: number[];
    types?: string[];
    badges?: string[];
    settings?: string[];
    boundaries?: LatLngBounds;
  },
): MapPin[] => {
  if (!allPins?.length) {
    return [];
  }
  const { tags, types, badges, settings, boundaries } = filters;

  let filteredPins = structuredClone(allPins);

  if (tags?.length) {
    filteredPins = filteredPins.filter((x) =>
      tags.every((tag) => x.profile?.tags?.some((profileTag) => profileTag.id === tag)),
    );
  }

  if (types?.length) {
    filteredPins = filteredPins.filter(
      (x) => x.profile?.type?.name && types.includes(x.profile?.type?.name),
    );
  }

  if (badges?.length) {
    filteredPins = filteredPins.filter((x) =>
      x.profile?.badges?.some((badge) => badges.includes(badge.name)),
    );
  }

  if (settings?.length) {
    // Right now visitor filter is only setting filter. This should be smarter.
    filteredPins = filteredPins.filter((x) => x.profile?.visitorPolicy?.policy === 'open');
  }

  if (boundaries) {
    filteredPins = filterByLatLong(
      {
        _northEast: boundaries.getNorthEast(),
        _southWest: boundaries.getSouthWest(),
      },
      filteredPins,
    );
  }

  return filteredPins;
};
