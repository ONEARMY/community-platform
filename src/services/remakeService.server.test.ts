import { createClient } from '@supabase/supabase-js';
import { HTTPException } from 'hono/http-exception';
import { RemakeServiceServer } from 'src/services/remakeService.server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { DBAdminRemake, DBProfile } from 'oa-shared';

const owner = { id: 1, roles: [] } as unknown as DBProfile;
const stranger = { id: 99, roles: [] } as unknown as DBProfile;
const admin = { id: 50, roles: ['admin'] } as unknown as DBProfile;
const editor = { id: 60, roles: ['editor'] } as unknown as DBProfile;

const dbRemake = {
  id: 7,
  created_at: '2026-07-11T10:00:00Z',
  modified_at: null,
  project_id: 1,
  created_by: owner.id,
  description: 'original',
  images: [{ id: 'img-1', path: 'projects/1/img-1.webp', fullPath: 'projects/1/img-1.webp' }],
  profile: { id: owner.id, username: 'owner', display_name: 'Owner', country: '', photo: null },
};

const dbAdminRemake = {
  id: 8,
  created_at: '2026-08-20T10:00:00Z',
  description: 'Made this at our local workshop.',
  images: [{ id: 'img-1', path: 'projects/1/img-1.webp', fullPath: 'projects/1/img-1.webp' }],
  project: { slug: 'plastic-bench', title: 'Plastic bench', deleted: null },
  profile: { username: 'owner', display_name: 'Owner' },
};

const validDto = {
  images: [{ id: 'img-1', path: 'projects/1/img-1.webp', fullPath: 'projects/1/img-1.webp' }],
  description: 'updated',
};

const buildClient = () => {
  const deleteEq = vi.fn().mockResolvedValue({ error: null });
  const insertSingle = vi.fn().mockResolvedValue({ data: dbRemake, error: null });
  const updateSingle = vi.fn().mockResolvedValue({ data: dbRemake, error: null });
  const selectSingle = vi.fn().mockResolvedValue({ data: dbRemake, error: null });

  const select = vi.fn().mockReturnValue({
    eq: vi.fn().mockReturnValue({
      single: selectSingle,
      order: vi.fn().mockResolvedValue({ data: [dbRemake], error: null }),
    }),
  });

  const client: any = {
    from: vi.fn().mockReturnValue({
      select,
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({ single: insertSingle }),
      }),
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({ single: updateSingle }),
        }),
      }),
      delete: vi.fn().mockReturnValue({ eq: deleteEq }),
    }),
    storage: {
      from: vi.fn().mockReturnValue({
        getPublicUrl: vi
          .fn()
          .mockReturnValue({ data: { publicUrl: 'http://localhost/img-1.webp' } }),
      }),
    },
  };

  return { client, deleteEq, insertSingle, updateSingle };
};

const buildListClient = (
  rows: DBAdminRemake[] = [dbAdminRemake],
  maxRows = 1000,
  failOnRequest = 0,
) => {
  const requests: URL[] = [];
  const client = createClient('https://supabase.example', 'test-key', {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: async (input) => {
        const url = new URL(String(input));
        requests.push(url);

        if (requests.length === failOnRequest) {
          return new Response(JSON.stringify({ code: '42501', message: 'permission denied' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        expect(requests.length).toBeLessThan(20);
        expect(url.pathname).toBe('/rest/v1/remakes');
        expect(url.searchParams.get('order')).toBe('created_at.desc,id.desc');

        let visibleRows = [...rows].sort(
          (a, b) => b.created_at.localeCompare(a.created_at) || b.id - a.id,
        );
        const filter = url.searchParams.get('or');

        if (filter) {
          const match = filter.match(
            /^\(created_at\.lt\.([^,]+),and\(created_at\.eq\.([^,]+),id\.lt\.(\d+)\)\)$/,
          );
          expect(match).not.toBeNull();
          const [, before, equal, id] = match!;
          expect(before).toBe(equal);
          visibleRows = visibleRows.filter(
            (row) => row.created_at < before || (row.created_at === equal && row.id < Number(id)),
          );
        }

        const limit = Number(url.searchParams.get('limit') ?? maxRows);
        const batch = visibleRows.slice(0, Math.min(maxRows, limit));

        return new Response(JSON.stringify(batch), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      },
    },
  });

  return { client, requests };
};

describe('RemakeServiceServer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.TENANT_ID = 'test-tenant';
  });

  describe('validation', () => {
    it('rejects a remake without images', async () => {
      const { client } = buildClient();
      const service = new RemakeServiceServer(client);

      await expect(service.create(1, owner, { images: [], description: null })).rejects.toThrow(
        HTTPException,
      );
      expect(client.from).not.toHaveBeenCalled();
    });

    it('rejects a remake with more than 10 images', async () => {
      const { client } = buildClient();
      const service = new RemakeServiceServer(client);
      const images = Array.from({ length: 11 }, (_, i) => ({
        id: `img-${i}`,
        path: `projects/1/img-${i}.webp`,
        fullPath: `projects/1/img-${i}.webp`,
      }));

      await expect(service.create(1, owner, { images, description: null })).rejects.toThrow(
        HTTPException,
      );
      expect(client.from).not.toHaveBeenCalled();
    });

    it('rejects images with non-string fields', async () => {
      const { client } = buildClient();
      const service = new RemakeServiceServer(client);
      const images = [
        { id: 'img-1', path: 'projects/1/img-1.webp', fullPath: { nested: 'payload' } },
      ] as never;

      await expect(service.create(1, owner, { images, description: null })).rejects.toThrow(
        HTTPException,
      );
      expect(client.from).not.toHaveBeenCalled();
    });

    it('rejects a non-string description', async () => {
      const { client } = buildClient();
      const service = new RemakeServiceServer(client);

      await expect(
        service.create(1, owner, { images: validDto.images, description: ['not', 'a', 'string'] as never }),
      ).rejects.toThrow(HTTPException);
      expect(client.from).not.toHaveBeenCalled();
    });

    it('rejects a description over 1000 characters', async () => {
      const { client } = buildClient();
      const service = new RemakeServiceServer(client);

      await expect(
        service.create(1, owner, { images: validDto.images, description: 'x'.repeat(1001) }),
      ).rejects.toThrow(HTTPException);
      expect(client.from).not.toHaveBeenCalled();
    });
  });

  describe('getAll', () => {
    it('lists every remake newest first with its project, creator and first image', async () => {
      const { client, requests } = buildListClient();
      const service = new RemakeServiceServer(client);

      const result = await service.getAll();

      expect(requests[0].searchParams.get('select')).toMatch(
        /project:projects\(slug,title,deleted\)[\s\S]*profile:profiles\(username,display_name\)/,
      );
      expect(requests).toHaveLength(2);
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: 8,
        createdAt: new Date('2026-08-20T10:00:00Z'),
        description: 'Made this at our local workshop.',
        imageUrl: 'https://supabase.example/storage/v1/object/public/test-tenant/projects/1/img-1.webp',
        project: { slug: 'plastic-bench', title: 'Plastic bench', deleted: false },
        author: { username: 'owner', displayName: 'Owner' },
      });
    });

    it('leaves the image url empty when a remake has no images', async () => {
      const { client } = buildListClient([{ ...dbAdminRemake, images: [] }]);
      const service = new RemakeServiceServer(client);

      const result = await service.getAll();

      expect(result[0].imageUrl).toBeNull();
    });

    it('returns every row above the API cap, including tied timestamps across batches', async () => {
      const rows = Array.from({ length: 1001 }, (_, index) => ({
        ...dbAdminRemake,
        id: index + 1,
        created_at: '2026-08-20T10:00:00.123456Z',
      }));
      const { client, requests } = buildListClient(rows);
      const service = new RemakeServiceServer(client);

      const result = await service.getAll();

      expect(result.map((row) => row.id)).toEqual(
        Array.from({ length: 1001 }, (_, index) => 1001 - index),
      );
      expect(requests).toHaveLength(3);
      expect(requests[1].searchParams.get('or')).toContain('2026-08-20T10:00:00.123456Z');
    });

    it('continues after a short capped response and orders by timestamp before id', async () => {
      const { client, requests } = buildListClient(
        [
          { ...dbAdminRemake, id: 10, created_at: '2026-08-19T10:00:00Z' },
          { ...dbAdminRemake, id: 2 },
          { ...dbAdminRemake, id: 1 },
        ],
        2,
      );

      const result = await new RemakeServiceServer(client).getAll();

      expect(result.map((row) => row.id)).toEqual([2, 1, 10]);
      expect(requests).toHaveLength(3);
    });

    it('returns an empty list when there are no visible remakes', async () => {
      const { client, requests } = buildListClient([]);

      await expect(new RemakeServiceServer(client).getAll()).resolves.toEqual([]);
      expect(requests).toHaveLength(1);
    });

    it.each([1, 2])(
      'throws on request %i failure instead of returning a partial list',
      async (request) => {
        const { client } = buildListClient([dbAdminRemake], 1000, request);

        await expect(new RemakeServiceServer(client).getAll()).rejects.toMatchObject({
          code: '42501',
          message: 'permission denied',
        });
      },
    );

    it('preserves remakes with unavailable joined projects or profiles', async () => {
      const { client } = buildListClient([
        { ...dbAdminRemake, id: 3, project: null },
        { ...dbAdminRemake, id: 2, profile: null },
        { ...dbAdminRemake, id: 1, project: null, profile: null },
      ]);

      const result = await new RemakeServiceServer(client).getAll();

      expect(result).toHaveLength(3);
      expect(result[0]).toMatchObject({ id: 3, project: null, author: { username: 'owner' } });
      expect(result[1]).toMatchObject({ id: 2, project: { slug: 'plastic-bench' }, author: null });
      expect(result[2]).toMatchObject({ id: 1, project: null, author: null });
    });
  });

  describe('authorization', () => {
    it('forbids a non-owner from updating', async () => {
      const { client } = buildClient();
      const service = new RemakeServiceServer(client);

      await expect(service.update(7, 1, stranger, validDto)).rejects.toThrow(HTTPException);
    });

    it('forbids a non-owner from deleting', async () => {
      const { client, deleteEq } = buildClient();
      const service = new RemakeServiceServer(client);

      await expect(service.remove(7, 1, stranger)).rejects.toThrow(HTTPException);
      expect(deleteEq).not.toHaveBeenCalled();
    });

    it('allows the owner to delete', async () => {
      const { client, deleteEq } = buildClient();
      const service = new RemakeServiceServer(client);

      await service.remove(7, 1, owner);
      expect(deleteEq).toHaveBeenCalledWith('id', 7);
    });

    it('allows an admin to delete', async () => {
      const { client, deleteEq } = buildClient();
      const service = new RemakeServiceServer(client);

      await service.remove(7, 1, admin);
      expect(deleteEq).toHaveBeenCalledWith('id', 7);
    });

    it('allows an editor to update', async () => {
      const { client } = buildClient();
      const service = new RemakeServiceServer(client);

      const result = await service.update(7, 1, editor, validDto);
      expect(result.id).toBe(dbRemake.id);
    });

    it('rejects a remake id that belongs to another project', async () => {
      const { client, deleteEq } = buildClient();
      const service = new RemakeServiceServer(client);

      await expect(service.remove(7, 2, owner)).rejects.toThrow(HTTPException);
      expect(deleteEq).not.toHaveBeenCalled();
    });
  });

  describe('persistence', () => {
    it('throws when the insert returns no record and no error', async () => {
      const { client, insertSingle } = buildClient();
      insertSingle.mockResolvedValue({ data: null, error: null });
      const service = new RemakeServiceServer(client);

      await expect(service.create(1, owner, validDto)).rejects.toThrow(
        'Remake creation returned no record',
      );
    });

    it('throws when the update returns no record and no error', async () => {
      const { client, updateSingle } = buildClient();
      updateSingle.mockResolvedValue({ data: null, error: null });
      const service = new RemakeServiceServer(client);

      await expect(service.update(7, 1, owner, validDto)).rejects.toThrow(
        'Remake update returned no record',
      );
    });
  });
});
