import { describe, expect, it } from 'vitest';

import { filterPins, sortPinsByBadgeThenLastActive } from './pinUtils';

import type { MapPin, ProfileType } from 'oa-shared';

describe('filterPins', () => {
  const workspacePin: MapPin = {
    id: 1,
    moderation: 'accepted',
    lat: 0,
    lng: 0,
    name: '',
    postCode: '',
    administrative: '',
    country: '',
    countryCode: '',
    profileId: 1,
    profile: {
      id: 1,
      username: 'bob_the_builder',
      lastActive: new Date(),
      country: 'uk',
      coverImages: null,
      displayName: 'Bob the Builder',
      isContactable: false,
      visitorPolicy: null,
      about: '',
      photo: null,
      type: {
        id: 2,
        name: 'workspace',
        displayName: 'Workspace',
        description: 'teste',
      } as ProfileType,
      badges: [
        {
          id: 1,
          name: 'verified',
          displayName: 'Verified',
          imageUrl: '',
        },
      ],
      tags: [
        {
          id: 1,
          name: 'Designer',
          createdAt: new Date(),
          profileType: 'workspace',
        },
      ],
    },
  };

  const memberPin = {
    id: 2,
    moderation: 'accepted',
    lat: 0,
    lng: 0,
    name: '',
    postCode: '',
    administrative: '',
    country: '',
    countryCode: '',
    postcode: '',
    profileId: 2,
    profile: {
      id: 2,
      username: 'bob_the_member',
      lastActive: new Date(),
      countryCode: 'uk',
      coverImages: null,
      displayName: 'Bob the Member',
      isContactable: false,
      about: '',
      country: '',
      visitorPolicy: null,
      photo: null,
      openToVisitors: null,
      type: {
        id: 1,
        name: 'member',
        displayName: 'Member',
        description: 'teste',
      } as ProfileType,
      badges: [
        {
          id: 1,
          name: 'verified',
          displayName: 'Verified',
          imageUrl: '',
        },
      ],
    },
  } as MapPin;

  const taggedMemberPin = {
    id: 3,
    moderation: 'accepted',
    lat: 0,
    lng: 0,
    administrative: '',
    name: '',
    postCode: '',
    moderationFeedback: '',
    country: '',
    countryCode: '',
    postcode: '',
    profileId: 3,
    profile: {
      id: 3,
      username: 'bob_the_tagged',
      lastActive: new Date(),
      countryCode: 'uk',
      coverImages: null,
      displayName: 'Bob the Tagged',
      isContactable: false,
      about: '',
      country: '',
      photo: null,
      openToVisitors: null,
      type: {
        id: 1,
        name: 'member',
        displayName: 'Member',
        description: 'teste',
      } as ProfileType,
      visitorPolicy: null,
      badges: [
        {
          id: 1,
          name: 'verified',
          displayName: 'Verified',
          imageUrl: '',
        },
      ],
      tags: [
        {
          id: 1,
          name: 'Designer',
          createdAt: new Date(),
          profileType: 'member',
        },
      ],
    },
  } as MapPin;

  const allPinsInView: MapPin[] = [workspacePin, memberPin, taggedMemberPin];

  it('returns all pins when no filters provided', () => {
    expect(filterPins(allPinsInView, {})).toEqual(allPinsInView);
  });

  it('returns only the correct profile type pins when filter is provided', () => {
    const filtered = filterPins(allPinsInView, {
      types: ['member'],
    });
    expect(filtered.map((x) => x.id)).toEqual([memberPin.id, taggedMemberPin.id]);
  });

  it('returns only the pins when profile type and tag filters are provided', () => {
    const filtered = filterPins(allPinsInView, {
      types: ['member'],
      tags: [1],
    });
    expect(filtered.map((x) => x.id)).toEqual([taggedMemberPin.id]);
  });

  it('returns an empty arry when no pins meet the filter criteria', () => {
    const filtered = filterPins(allPinsInView, {
      tags: [55],
    });
    expect(filtered).toEqual([]);
  });
});

describe('sortPinsByBadgeThenLastActive', () => {
  const createPin = (
    id: number,
    lastActive: Date,
    badges: { id: number; name: string; displayName: string; imageUrl: string }[] = [],
  ): MapPin => ({
    id,
    moderation: 'accepted',
    lat: 0,
    lng: 0,
    name: '',
    postCode: '',
    administrative: '',
    country: '',
    countryCode: '',
    profileId: id,
    profile: {
      id,
      username: `user_${id}`,
      lastActive,
      country: 'uk',
      coverImages: null,
      displayName: `User ${id}`,
      isContactable: false,
      visitorPolicy: null,
      about: '',
      photo: null,
      type: {
        id: 1,
        name: 'member',
        displayName: 'Member',
        description: 'test',
      } as ProfileType,
      badges,
      tags: [],
    },
  });

  const proBadge = { id: 1, name: 'pro', displayName: 'PRO', imageUrl: '' };
  const supporterBadge = { id: 2, name: 'supporter', displayName: 'Supporter', imageUrl: '' };

  const oldDate = new Date('2024-01-01');
  const midDate = new Date('2024-06-01');
  const newDate = new Date('2024-12-01');

  it('sorts pins with matching badge first', () => {
    const proPin = createPin(1, oldDate, [proBadge]);
    const regularPin = createPin(2, newDate, []);

    const sorted = sortPinsByBadgeThenLastActive([regularPin, proPin], 'pro');

    expect(sorted.map((p) => p.id)).toEqual([1, 2]);
  });

  it('sorts pins by lastActive within badge group', () => {
    const proOld = createPin(1, oldDate, [proBadge]);
    const proNew = createPin(2, newDate, [proBadge]);

    const sorted = sortPinsByBadgeThenLastActive([proOld, proNew], 'pro');

    expect(sorted.map((p) => p.id)).toEqual([2, 1]);
  });

  it('sorts pins by lastActive within non-badge group', () => {
    const regularOld = createPin(1, oldDate, []);
    const regularNew = createPin(2, newDate, []);

    const sorted = sortPinsByBadgeThenLastActive([regularOld, regularNew], 'pro');

    expect(sorted.map((p) => p.id)).toEqual([2, 1]);
  });

  it('sorts mixed pins correctly: badge first by lastActive, then non-badge by lastActive', () => {
    const proOld = createPin(1, oldDate, [proBadge]);
    const proNew = createPin(2, newDate, [proBadge]);
    const regularMid = createPin(3, midDate, []);
    const regularNew = createPin(4, newDate, []);

    const sorted = sortPinsByBadgeThenLastActive([regularMid, proOld, regularNew, proNew], 'pro');

    expect(sorted.map((p) => p.id)).toEqual([2, 1, 4, 3]);
  });

  it('works with different badge names', () => {
    const supporterPin = createPin(1, oldDate, [supporterBadge]);
    const regularPin = createPin(2, newDate, []);

    const sorted = sortPinsByBadgeThenLastActive([regularPin, supporterPin], 'supporter');

    expect(sorted.map((p) => p.id)).toEqual([1, 2]);
  });

  it('does not mutate the original array', () => {
    const pin1 = createPin(1, oldDate, []);
    const pin2 = createPin(2, newDate, [proBadge]);
    const original = [pin1, pin2];

    sortPinsByBadgeThenLastActive(original, 'pro');

    expect(original.map((p) => p.id)).toEqual([1, 2]);
  });

  it('handles empty array', () => {
    const sorted = sortPinsByBadgeThenLastActive([], 'pro');
    expect(sorted).toEqual([]);
  });

  it('handles pins with no badges array', () => {
    const pinWithNoBadges = createPin(1, newDate, []);
    pinWithNoBadges.profile!.badges = undefined as any;
    const proPin = createPin(2, oldDate, [proBadge]);

    const sorted = sortPinsByBadgeThenLastActive([pinWithNoBadges, proPin], 'pro');

    expect(sorted.map((p) => p.id)).toEqual([2, 1]);
  });

  it('handles pins with null lastActive', () => {
    const pinWithNullDate = createPin(1, null as any, [proBadge]);
    const proPin = createPin(2, newDate, [proBadge]);

    const sorted = sortPinsByBadgeThenLastActive([pinWithNullDate, proPin], 'pro');

    expect(sorted.map((p) => p.id)).toEqual([2, 1]);
  });
});
