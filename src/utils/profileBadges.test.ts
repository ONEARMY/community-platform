import { ProfileBadge } from 'oa-shared';
import { describe, expect, it } from 'vitest';

import type { AdminProfileBadge, ProfileBadgeInput } from './profileBadges';
import {
  canGrant,
  getProfileBadgeDeleteError,
  getProfileBadgeError,
  getProfileBadgeErrors,
  grantsClosure,
  normalizeProfileBadgeInput,
} from './profileBadges';

const badge = (id: number, opts: { grants?: number; isAudience?: boolean } = {}) =>
  new ProfileBadge({
    id,
    name: `badge-${id}`,
    displayName: `Badge ${id}`,
    imageUrl: '',
    isAudience: opts.isAudience ?? true,
    grantsBadgeId: opts.grants,
  });

const adminBadge = (
  value: ProfileBadge,
  usage: Partial<AdminProfileBadge['usage']> = {},
): AdminProfileBadge => ({
  badge: value,
  usage: { holders: 0, articles: 0, stripeLinked: false, ...usage },
});

const validInput: ProfileBadgeInput = {
  name: 'member',
  displayName: 'Member',
  imageUrl: 'https://example.com/member.svg',
  actionUrl: '/support',
  isAudience: true,
  grantsBadgeId: null,
  availableTo: 'non_space',
  actionLabel: 'Become a member',
};

describe('grantsClosure', () => {
  it('includes the held badges', () => {
    expect(grantsClosure([1, 2], [badge(1), badge(2)])).toEqual(new Set([1, 2]));
  });

  it('adds directly granted badges', () => {
    expect(grantsClosure([3], [badge(1), badge(3, { grants: 1 })])).toEqual(new Set([3, 1]));
  });

  it('follows chained grants', () => {
    const badges = [badge(1), badge(2, { grants: 1 }), badge(3, { grants: 2 })];

    expect(grantsClosure([3], badges)).toEqual(new Set([3, 2, 1]));
  });

  it('stops on cycles', () => {
    const badges = [badge(1, { grants: 2 }), badge(2, { grants: 1 })];

    expect(grantsClosure([1], badges)).toEqual(new Set([1, 2]));
  });

  it('keeps ids of unknown badges', () => {
    expect(grantsClosure([9], [badge(1)])).toEqual(new Set([9]));
  });
});

describe('canGrant', () => {
  const badges = [
    badge(1),
    badge(2, { grants: 1 }),
    badge(3, { grants: 2 }),
    badge(4, { isAudience: false }),
  ];

  it('allows granting an audience badge', () => {
    expect(canGrant(badges, 4, 1)).toBe(true);
  });

  it('allows granting from a badge that does not exist yet', () => {
    expect(canGrant(badges, undefined, 1)).toBe(true);
  });

  it('rejects granting itself', () => {
    expect(canGrant(badges, 1, 1)).toBe(false);
  });

  it('rejects a target that is not an audience badge', () => {
    expect(canGrant(badges, 1, 4)).toBe(false);
  });

  it('rejects a missing target', () => {
    expect(canGrant(badges, 1, 99)).toBe(false);
  });

  it('rejects a target that already grants the badge, directly or chained', () => {
    expect(canGrant(badges, 1, 2)).toBe(false);
    expect(canGrant(badges, 1, 3)).toBe(false);
  });
});

describe('normalizeProfileBadgeInput', () => {
  it('trims text and converts empty values to null', () => {
    expect(
      normalizeProfileBadgeInput({
        name: ' member ',
        displayName: ' Member ',
        imageUrl: ' https://example.com/member.svg ',
        actionUrl: ' ',
        isAudience: true,
        grantsBadgeId: '',
        availableTo: '',
        actionLabel: 'Ignored',
      }),
    ).toEqual({
      name: 'member',
      displayName: 'Member',
      imageUrl: 'https://example.com/member.svg',
      actionUrl: null,
      isAudience: true,
      grantsBadgeId: null,
      availableTo: null,
      actionLabel: null,
    });
  });

  it('clears the offer when the badge is not an audience badge', () => {
    const result = normalizeProfileBadgeInput({ ...validInput, isAudience: false });

    expect(result.availableTo).toBeNull();
    expect(result.actionLabel).toBeNull();
  });

  it('reads the grants id as a number', () => {
    expect(normalizeProfileBadgeInput({ ...validInput, grantsBadgeId: '4' }).grantsBadgeId).toBe(4);
  });
});

describe('getProfileBadgeError', () => {
  const badges = [
    adminBadge(badge(1), { articles: 2 }),
    adminBadge(badge(2, { grants: 1 })),
    adminBadge(badge(3, { isAudience: false })),
    adminBadge(badge(4)),
  ];

  it('accepts a valid new badge', () => {
    expect(getProfileBadgeError(validInput, badges)).toBeNull();
  });

  it.each(['Member', 'member badge', 'mémber', ''])('rejects the name "%s"', (name) => {
    expect(getProfileBadgeError({ ...validInput, name }, badges)?.field).toBe('name');
  });

  it('rejects a name that is already taken as a conflict', () => {
    const error = getProfileBadgeError({ ...validInput, name: 'badge-1' }, badges);

    expect(error?.field).toBe('name');
    expect(error?.conflict).toBe(true);
  });

  it('ignores the name when editing', () => {
    expect(getProfileBadgeError({ ...validInput, name: 'Anything' }, badges, 4)).toBeNull();
  });

  it('requires a display name', () => {
    expect(getProfileBadgeError({ ...validInput, displayName: '' }, badges)?.field).toBe(
      'displayName',
    );
  });

  it('requires an image', () => {
    expect(getProfileBadgeError({ ...validInput, imageUrl: '' }, badges)?.field).toBe('imageUrl');
  });

  it('rejects granting a badge that is not an audience badge', () => {
    expect(getProfileBadgeError({ ...validInput, grantsBadgeId: 3 }, badges)?.field).toBe(
      'grantsBadgeId',
    );
  });

  it('rejects a grant that would create a cycle', () => {
    expect(getProfileBadgeError({ ...validInput, grantsBadgeId: 2 }, badges, 1)?.field).toBe(
      'grantsBadgeId',
    );
  });

  it('rejects an unknown availability', () => {
    expect(
      getProfileBadgeError({ ...validInput, availableTo: 'everyone' as any }, badges)?.field,
    ).toBe('availableTo');
  });

  it('requires a button label when the badge is offered', () => {
    expect(getProfileBadgeError({ ...validInput, actionLabel: null }, badges)?.field).toBe(
      'actionLabel',
    );
  });

  it('requires a link when the badge is offered', () => {
    expect(getProfileBadgeError({ ...validInput, actionUrl: null }, badges)?.field).toBe(
      'actionUrl',
    );
  });

  it('keeps a badge used on articles as an audience badge', () => {
    const input = normalizeProfileBadgeInput({ ...validInput, isAudience: false });

    expect(getProfileBadgeError(input, badges, 1)?.field).toBe('isAudience');
  });

  it('keeps a badge granted by another badge as an audience badge', () => {
    const input = normalizeProfileBadgeInput({ ...validInput, isAudience: false });
    const unusedButGranted = [adminBadge(badge(1)), adminBadge(badge(2, { grants: 1 }))];

    expect(getProfileBadgeError(input, unusedButGranted, 1)?.field).toBe('isAudience');
  });

  it('allows switching off an unused audience badge', () => {
    const input = normalizeProfileBadgeInput({ ...validInput, isAudience: false });

    expect(getProfileBadgeError(input, badges, 4)).toBeNull();
  });
});

describe('getProfileBadgeErrors', () => {
  it('returns every error in field order', () => {
    const input = { ...validInput, name: 'Bad Name', displayName: '', actionLabel: null };

    expect(getProfileBadgeErrors(input, []).map((error) => error.field)).toEqual([
      'name',
      'displayName',
      'actionLabel',
    ]);
  });
});

describe('getProfileBadgeDeleteError', () => {
  it('allows deleting an unused badge', () => {
    expect(getProfileBadgeDeleteError(1, [adminBadge(badge(1))])).toBeNull();
  });

  it.each([
    [{ holders: 2 }, 'held by 2 profiles'],
    [{ articles: 1 }, 'used on 1 news articles'],
    [{ stripeLinked: true }, 'linked to Stripe'],
  ])('blocks deleting a badge in use (%o)', (usage, reason) => {
    expect(getProfileBadgeDeleteError(1, [adminBadge(badge(1), usage)])).toContain(reason);
  });

  it('blocks deleting a badge granted by another badge', () => {
    const badges = [adminBadge(badge(1)), adminBadge(badge(2, { grants: 1 }))];

    expect(getProfileBadgeDeleteError(1, badges)).toContain('granted by Badge 2');
  });
});
