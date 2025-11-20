import { faker } from '@faker-js/faker';

import type { MapPin, Moderation } from 'oa-shared';

export const FactoryMapPin = (userOverloads: Partial<MapPin> = {}): Partial<MapPin> => ({
  id: faker.number.int(),
  moderation: faker.helpers.arrayElement<Moderation>([
    'awaiting-moderation',
    'improvements-needed',
    'rejected',
    'accepted',
  ]),
  lng: faker.location.longitude(),
  lat: faker.location.latitude(),
  ...userOverloads,
});
