import type { ProfileType } from 'oa-shared';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createMockSupabaseClient } from '../test/utils/supabaseClientMock';
import { validateRequest } from './api.organisation-application';

const spaceType = { id: 5, name: 'machine-builder', isSpace: true } as unknown as ProfileType;
const memberType = { id: 1, name: 'member', isSpace: false } as unknown as ProfileType;
const profileTypes = [memberType, spaceType];

const validData = {
  type: 'machine-builder',
  username: 'valid_org',
  displayName: 'The Machine Shop',
  about: 'We build machines for the local recycling network.',
  website: null,
  // biome-ignore lint/suspicious/noExplicitAny: minimal cover-image stub for validation only
  coverImages: [{ id: 'img-1' }] as any,
};

describe('validateRequest (organisation application)', () => {
  // biome-ignore lint/suspicious/noExplicitAny: mock supabase client
  let client: any;
  // biome-ignore lint/suspicious/noExplicitAny: mock supabase client handles
  let mocks: any;

  beforeEach(() => {
    vi.restoreAllMocks();
    ({ client, mocks } = createMockSupabaseClient());
    // username available unless a test overrides it
    mocks.rpc.mockResolvedValue({ data: true });
  });

  it('returns the selected space profile type for a valid request', async () => {
    const result = await validateRequest(client, { ...validData }, profileTypes);

    expect(result).toBe(spaceType);
    expect(mocks.rpc).toHaveBeenCalledWith('is_username_available', { username: 'valid_org' });
  });

  it('rejects a non-space / unknown profile type', async () => {
    await expect(
      validateRequest(client, { ...validData, type: 'member' }, profileTypes),
    ).rejects.toThrow('A valid organisation type is required');
  });

  it('rejects a missing username', async () => {
    await expect(
      validateRequest(client, { ...validData, username: '' }, profileTypes),
    ).rejects.toThrow('Username is required');
  });

  it('rejects a username with invalid characters', async () => {
    await expect(
      validateRequest(client, { ...validData, username: 'bad name!' }, profileTypes),
    ).rejects.toThrow('Username contains invalid characters');
  });

  it('rejects a username that is already taken', async () => {
    mocks.rpc.mockResolvedValueOnce({ data: false });

    await expect(validateRequest(client, { ...validData }, profileTypes)).rejects.toThrow(
      'Username is already taken',
    );
  });

  it('rejects a missing display name', async () => {
    await expect(
      validateRequest(client, { ...validData, displayName: '' }, profileTypes),
    ).rejects.toThrow('displayName is required');
  });

  it('rejects a missing about', async () => {
    await expect(
      validateRequest(client, { ...validData, about: '' }, profileTypes),
    ).rejects.toThrow('about is required');
  });

  it('rejects an about that exceeds the max length', async () => {
    await expect(
      validateRequest(client, { ...validData, about: 'a'.repeat(501) }, profileTypes),
    ).rejects.toThrow('about must be at most 500 characters');
  });

  it('rejects when no cover images are provided', async () => {
    await expect(
      validateRequest(client, { ...validData, coverImages: [] }, profileTypes),
    ).rejects.toThrow('At least one picture is required');
  });

  it('rejects when too many cover images are provided', async () => {
    // biome-ignore lint/suspicious/noExplicitAny: minimal cover-image stubs
    const tooMany = Array.from({ length: 5 }, (_, i) => ({ id: `img-${i}` })) as any;

    await expect(
      validateRequest(client, { ...validData, coverImages: tooMany }, profileTypes),
    ).rejects.toThrow('At most 4 pictures are allowed');
  });
});
