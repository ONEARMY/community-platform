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
  type: { display_name: 'Workspace' },
  moderation: 'improvements-needed',
  moderation_feedback: 'Add a cover photo',
  created_at: '2026-10-12T10:00:00Z',
};

const organisationsClient = (result: { data: DBAdminOrganisation[]; count: number | null }) => {
  const query: Record<string, ReturnType<typeof vi.fn>> = {};
  for (const method of ['select', 'not', 'eq', 'or', 'order']) {
    query[method] = vi.fn(() => query);
  }
  query.range = vi.fn().mockResolvedValue({ ...result, error: null });

  return { client: { from: vi.fn(() => query) } as any, query };
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
      const { client, query } = organisationsClient({ data: [dbOrganisation], count: 41 });

      const { organisations, totalCount } = await new ProfileServiceServer(
        client,
      ).getOrganisationsForModeration({
        moderation: 'improvements-needed',
        search: 'acme',
        page: 3,
        pageSize: 20,
      });

      expect(client.from).toHaveBeenCalledWith('profiles');
      expect(query.not).toHaveBeenCalledWith('moderation', 'is', null);
      expect(query.eq).toHaveBeenCalledWith('moderation', 'improvements-needed');
      expect(query.or).toHaveBeenCalledWith('username.ilike."%acme%",display_name.ilike."%acme%"');
      expect(query.range).toHaveBeenCalledWith(40, 59);
      expect(totalCount).toBe(41);
      expect(organisations[0]).toMatchObject({
        displayName: 'Acme Lab',
        typeName: 'Workspace',
        moderation: 'improvements-needed',
        moderationFeedback: 'Add a cover photo',
      });
      expect(organisations[0].createdAt).toEqual(new Date('2026-10-12T10:00:00Z'));
    });

    it('omits the status and search when not filtering', async () => {
      const { client, query } = organisationsClient({ data: [], count: null });

      const { totalCount } = await new ProfileServiceServer(client).getOrganisationsForModeration({
        moderation: null,
        search: null,
        page: 1,
        pageSize: 20,
      });

      expect(query.eq).not.toHaveBeenCalled();
      expect(query.or).not.toHaveBeenCalled();
      expect(query.range).toHaveBeenCalledWith(0, 19);
      expect(totalCount).toBe(0);
    });

    it('quotes the search so it cannot add filters', async () => {
      const { client, query } = organisationsClient({ data: [], count: 0 });

      await new ProfileServiceServer(client).getOrganisationsForModeration({
        moderation: null,
        search: 'zz,roles.cs.{admin}"',
        page: 1,
        pageSize: 20,
      });

      expect(query.or).toHaveBeenCalledWith(
        'username.ilike."%zz,roles.cs.{admin}\\"%",display_name.ilike."%zz,roles.cs.{admin}\\"%"',
      );
    });
  });
});
