import { faker } from '@faker-js/faker';

import { CardListItem } from './CardListItem';

import type { Meta, StoryFn } from '@storybook/react-vite';
import type { MapPin, Moderation, ProfileType } from 'oa-shared';

export default {
  title: 'Map/CardListItem',
  component: CardListItem,
} as Meta<typeof CardListItem>;

const onPinClick = () => undefined;
const viewport = 'desktop';

const member: ProfileType = {
  name: 'member',
  description: 'A member profile',
  displayName: 'Member',
  id: 2,
  imageUrl: faker.image.avatar(),
  mapPinName: 'Member',
  order: 1,
  smallImageUrl: faker.image.avatar(),
  isSpace: false,
};

const space: ProfileType = {
  name: 'space',
  description: 'A space profile',
  displayName: 'Space',
  id: 3,
  imageUrl: faker.image.avatar(),
  mapPinName: 'Space',
  order: 1,
  smallImageUrl: faker.image.avatar(),
  isSpace: true,
};

export const DefaultMember: StoryFn<typeof CardListItem> = () => {
  const item = {
    id: 1,
    lat: 0,
    lng: 0,
    administrative: '',
    country: 'Brazil',
    countryCode: 'BR',
    moderation: 'accepted' as Moderation,
    profile: {
      id: 1,
      photo: {
        publicUrl: faker.image.avatar(),
      },
      displayName: 'member_no1',
      isContactable: false,
      type: member,
    },
  } as MapPin;

  return (
    <div style={{ width: '500px' }}>
      <CardListItem item={item} isSelectedPin={false} onPinClick={onPinClick} viewport={viewport} />
    </div>
  );
};

export const DefaultSpace: StoryFn<typeof CardListItem> = () => {
  const item = {
    id: 1,
    lat: 0,
    lng: 0,
    administrative: '',
    country: 'United Kingdom',
    countryCode: 'UK',
    moderation: 'accepted' as Moderation,
    profile: {
      id: 1,
      photo: {
        publicUrl: faker.image.avatar(),
      },
      about:
        'Lorem ipsum odor amet, consectetuer adipiscing elit. Lorem ipsum odor amet, consectetuer adipiscing elit.',
      displayName: 'member_no1',
      isContactable: false,
      type: space,
      tags: [{ id: 1, name: 'Sheetpress' }],
    },
  } as MapPin;

  return (
    <div style={{ width: '500px' }}>
      <CardListItem item={item} isSelectedPin={false} onPinClick={onPinClick} viewport={viewport} />
    </div>
  );
};
