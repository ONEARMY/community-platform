import { HTTPException } from 'hono/http-exception';
import { RemakeServiceServer } from 'src/services/remakeService.server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { DBProfile } from 'oa-shared';

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

const validDto = {
  images: [{ id: 'img-1', path: 'projects/1/img-1.webp', fullPath: 'projects/1/img-1.webp' }],
  description: 'updated',
};

const buildClient = () => {
  const deleteEq = vi.fn().mockResolvedValue({ error: null });
  const insertSingle = vi.fn().mockResolvedValue({ data: dbRemake, error: null });
  const updateSingle = vi.fn().mockResolvedValue({ data: dbRemake, error: null });
  const selectSingle = vi.fn().mockResolvedValue({ data: dbRemake, error: null });

  const client: any = {
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: selectSingle,
          order: vi.fn().mockResolvedValue({ data: [dbRemake], error: null }),
        }),
      }),
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
