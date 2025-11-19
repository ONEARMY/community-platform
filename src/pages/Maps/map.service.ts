import { createContext } from 'react';
import { logger } from 'src/logger';

import type { FilterResponse, MapPin } from 'oa-shared';

export interface IMapPinService {
  getMapPins: () => Promise<MapPin[]>;
  getMapPinById: (id: number) => Promise<MapPin | null>;
  getCurrentUserMapPin: () => Promise<MapPin | null>;
  getMapFilters: () => Promise<FilterResponse | null>;
}

const getMapPins = async () => {
  try {
    const response = await fetch('/api/map-pins');
    const { mapPins } = await response.json();

    return mapPins;
  } catch (error) {
    logger.error('Failed to fetch map pins', { error });
    return [];
  }
};

const getMapPinById = async (id: number) => {
  try {
    const response = await fetch('/api/map-pins/' + id);
    const { mapPin } = await response.json();

    return mapPin as MapPin;
  } catch (error) {
    logger.error('Failed to fetch map pin by user id', { id, error });
    return null;
  }
};

const getCurrentUserMapPin = async () => {
  try {
    const response = await fetch('/api/map-pin');
    const { mapPin } = await response.json();

    return mapPin as MapPin;
  } catch (error) {
    logger.error('Failed to fetch current user map pinprofile-website', {
      error,
    });
    return null;
  }
};

const getMapFilters = async () => {
  try {
    const response = await fetch('/api/map-filters');
    const result = await response.json();

    return result as FilterResponse;
  } catch (error) {
    logger.error('Failed to fetch map filters', {
      error,
    });
    return null;
  }
};

export const MapPinServiceContext = createContext<IMapPinService | null>(null);

export const mapPinService: IMapPinService = {
  getMapPins,
  getMapPinById,
  getCurrentUserMapPin,
  getMapFilters,
};
