import type { DBAdminOrganisation, DBMedia } from 'oa-shared';
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

const dbOrganisation: DBAdminOrganisation = {
  id: 7,
  username: 'acme-lab',
  display_name: 'Acme Lab',
  about: 'We shred plastic',
  type_name: 'Workspace',
  moderation: 'improvements-needed',
  moderation_feedback: 'Add a cover photo',
  created_at: '2026-10-12T10:00:00Z',
  is_map_pin: true,
  total_count: 41,
};

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

  describe('getOrganisationsForModeration', () => {
    it('requests the page and status, and maps rows with the total count', async () => {
      const { client, mocks } = createMockSupabaseClient();
      mocks.rpc.mockResolvedValue({ data: [dbOrganisation], error: null });

      const { organisations, totalCount } = await new ProfileServiceServer(
        client,
      ).getOrganisationsForModeration('improvements-needed', 3, 20);

      expect(mocks.rpc).toHaveBeenCalledWith('get_admin_organisations', {
        p_limit: 20,
        p_offset: 40,
        p_moderation: 'improvements-needed',
      });
      expect(totalCount).toBe(41);
      expect(organisations[0]).toMatchObject({
        displayName: 'Acme Lab',
        typeName: 'Workspace',
        moderationFeedback: 'Add a cover photo',
        isMapPin: true,
      });
      expect(organisations[0].createdAt).toEqual(new Date('2026-10-12T10:00:00Z'));
    });

    it('omits the status for all organisations', async () => {
      const { client, mocks } = createMockSupabaseClient();
      mocks.rpc.mockResolvedValue({ data: [], error: null });

      const { totalCount } = await new ProfileServiceServer(client).getOrganisationsForModeration(
        null,
        1,
        20,
      );

      expect(mocks.rpc).toHaveBeenCalledWith('get_admin_organisations', {
        p_limit: 20,
        p_offset: 0,
        p_moderation: undefined,
      });
      expect(totalCount).toBe(0);
    });
  });
});
