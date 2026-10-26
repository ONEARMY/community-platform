import type { Profile } from 'oa-shared';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createMockSupabaseClient } from '../test/utils/supabaseClientMock';
import { MapServiceServer } from './mapService.server';

const pin = {
  profile_id: 7,
  name: 'The Machine Shop',
  country: 'Netherlands',
  country_code: 'nl',
  administrative: '',
  post_code: '1011',
  lat: 52.37,
  lng: 4.9,
};

const profileOf = (overrides: Partial<Profile>) =>
  ({
    id: 7,
    type: { name: 'workspace', isSpace: true },
    ...overrides,
  }) as unknown as Profile;

const insertedModeration = (mocks: { insert: ReturnType<typeof vi.fn> }) =>
  mocks.insert.mock.calls[0][0].moderation;

describe('MapServiceServer pin moderation', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    process.env.TENANT_ID = 'test-tenant';
  });

  it('accepts the pin of an approved organisation without a second review', async () => {
    const { client, mocks } = createMockSupabaseClient();

    await new MapServiceServer(client).upsert(pin, profileOf({ moderation: 'accepted' }));

    expect(insertedModeration(mocks)).toBe('accepted');
  });

  it('holds the pin of an organisation still awaiting review', async () => {
    const { client, mocks } = createMockSupabaseClient();

    await new MapServiceServer(client).upsert(pin, profileOf({ moderation: 'awaiting-moderation' }));

    expect(insertedModeration(mocks)).toBe('awaiting-moderation');
  });

  it('mirrors a rejection onto the pin rather than re-queueing it for map moderators', async () => {
    const { client, mocks } = createMockSupabaseClient();

    await new MapServiceServer(client).upsert(pin, profileOf({ moderation: 'rejected' }));

    expect(insertedModeration(mocks)).toBe('rejected');
  });

  it('keeps the accepted pin of an organisation from before the signup flow', async () => {
    const { client, mocks } = createMockSupabaseClient();
    mocks.eq.mockReturnValueOnce({ data: [{ id: 3, moderation: 'accepted' }] });

    await new MapServiceServer(client).upsert(pin, profileOf({ moderation: null }));

    expect(mocks.update.mock.calls[0][0].moderation).toBe('accepted');
  });

  it('sends a changed pin of an organisation from before the signup flow back for review', async () => {
    const { client, mocks } = createMockSupabaseClient();
    mocks.eq.mockReturnValueOnce({ data: [{ id: 3, moderation: 'improvements-needed' }] });

    await new MapServiceServer(client).upsert(pin, profileOf({ moderation: null }));

    expect(mocks.update.mock.calls[0][0].moderation).toBe('awaiting-moderation');
  });

  it('holds a new pin of an organisation from before the signup flow for review', async () => {
    const { client, mocks } = createMockSupabaseClient();

    await new MapServiceServer(client).upsert(pin, profileOf({ moderation: null }));

    expect(insertedModeration(mocks)).toBe('awaiting-moderation');
  });

  it('leaves member pins auto-accepted as before', async () => {
    const { client, mocks } = createMockSupabaseClient();

    await new MapServiceServer(client).upsert(
      pin,
      profileOf({ type: { name: 'member', isSpace: false } as Profile['type'], moderation: null }),
    );

    expect(insertedModeration(mocks)).toBe('accepted');
  });

  it('auto-accepts pins of any non-space profile type', async () => {
    const { client, mocks } = createMockSupabaseClient();

    await new MapServiceServer(client).upsert(
      pin,
      profileOf({ type: { name: 'maker', isSpace: false } as Profile['type'], moderation: null }),
    );

    expect(insertedModeration(mocks)).toBe('accepted');
  });
});
