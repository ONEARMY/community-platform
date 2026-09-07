import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createMockSupabaseClient } from '../test/utils/supabaseClientMock';
import { OrganisationApplicationsServiceServer } from './organisationApplicationsService.server';

describe('OrganisationApplicationsServiceServer', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    process.env.TENANT_ID = 'test-tenant';
  });

  describe('create', () => {
    it('inserts an application row for the auth id + current tenant', async () => {
      const { client, mocks } = createMockSupabaseClient();

      await new OrganisationApplicationsServiceServer(client).create('auth-1');

      expect(mocks.from).toHaveBeenCalledWith('organisation_applications');
      expect(mocks.insert).toHaveBeenCalledWith({
        auth_id: 'auth-1',
        tenant_id: 'test-tenant',
      });
    });
  });

  describe('existsByAuthId', () => {
    it('returns true when an application row exists', async () => {
      const { client, mocks } = createMockSupabaseClient();
      mocks.maybeSingle.mockResolvedValueOnce({ data: { id: 1 } });

      const exists = await new OrganisationApplicationsServiceServer(client).existsByAuthId(
        'auth-1',
      );

      expect(exists).toBe(true);
      expect(mocks.from).toHaveBeenCalledWith('organisation_applications');
      expect(mocks.eq).toHaveBeenCalledWith('auth_id', 'auth-1');
    });

    it('returns false when no application row exists', async () => {
      const { client, mocks } = createMockSupabaseClient();
      mocks.maybeSingle.mockResolvedValueOnce({ data: null });

      const exists = await new OrganisationApplicationsServiceServer(client).existsByAuthId(
        'auth-1',
      );

      expect(exists).toBe(false);
    });
  });

  describe('deleteByAuthId', () => {
    it('deletes the application row by auth id', async () => {
      const { client, mocks } = createMockSupabaseClient();

      await new OrganisationApplicationsServiceServer(client).deleteByAuthId('auth-1');

      expect(mocks.from).toHaveBeenCalledWith('organisation_applications');
      expect(mocks.delete).toHaveBeenCalled();
      expect(mocks.eq).toHaveBeenCalledWith('auth_id', 'auth-1');
    });
  });
});
