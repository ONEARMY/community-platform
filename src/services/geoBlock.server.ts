import { join } from 'node:path';
import maxmind, { type CityResponse, type Reader } from 'maxmind';
import { logger } from 'src/logger';

const BLOCKED_COUNTRIES = ['CU', 'IR', 'KP', 'SY', 'RU'];
const BLOCKED_REGIONS = ['UA-43', 'UA-40', 'UA-09', 'UA-14'];

let reader: Promise<Reader<CityResponse> | null> | undefined;

const getReader = () =>
  (reader ??= maxmind
    .open<CityResponse>(join(process.cwd(), 'geo', 'GeoLite2-City.mmdb'))
    .catch((error) => {
      if (process.env.NODE_ENV === 'production') {
        logger.error('Geo-blocking disabled, GeoLite2 database not loaded:', error);
      }
      return null;
    }));

export const isBlockedRegion = async (request: Request) => {
  const ip = request.headers.get('fly-client-ip');
  if (!ip || !maxmind.validate(ip)) {
    return false;
  }

  const geo = (await getReader())?.get(ip);
  const country = geo?.country?.iso_code;
  if (!country) {
    return false;
  }

  return (
    BLOCKED_COUNTRIES.includes(country) ||
    !!geo.subdivisions?.some((region) => BLOCKED_REGIONS.includes(`${country}-${region.iso_code}`))
  );
};
