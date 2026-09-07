import type { DBMedia } from 'oa-shared';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createMockSupabaseClient } from '../test/utils/supabaseClientMock';
import { ProfileServiceServer } from './profileService.server';

const coverImage = (id: string) => ({ id, path: `${id}.jpg` }) as unknown as DBMedia;

const applicationValues = (coverImages: DBMedia[] | null) => ({
  authId: 'auth-1',
  username: 'the_machine_shop',
  displayName: 'The Machine Shop',
  about: 'We build machines for the local recycling network.',
  website: null,
  coverImages,
  profileTypeId: 5,
});

describe('ProfileServiceServer', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    process.env.TENANT_ID = 'test-tenant';
  });

  describe('createOrganisationProfile', () => {
    it('seeds the profile photo from the first workspace picture', async () => {
      const { client, mocks } = createMockSupabaseClient();
      const first = coverImage('img-1');
      const second = coverImage('img-2');

      await new ProfileServiceServer(client).createOrganisationProfile(
        applicationValues([first, second]),
      );

      expect(mocks.from).toHaveBeenCalledWith('profiles');
      expect(mocks.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          photo: first,
          cover_images: [first, second],
        }),
      );
    });

    it('leaves the photo null when no pictures were uploaded', async () => {
      const { client, mocks } = createMockSupabaseClient();

      await new ProfileServiceServer(client).createOrganisationProfile(applicationValues(null));

      expect(mocks.insert).toHaveBeenCalledWith(expect.objectContaining({ photo: null }));
    });

    it('creates the profile awaiting moderation for the current tenant', async () => {
      const { client, mocks } = createMockSupabaseClient();

      await new ProfileServiceServer(client).createOrganisationProfile(
        applicationValues([coverImage('img-1')]),
      );

      expect(mocks.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          auth_id: 'auth-1',
          tenant_id: 'test-tenant',
          username: 'the_machine_shop',
          profile_type: 5,
          moderation: 'awaiting-moderation',
        }),
      );
    });
  });
});
