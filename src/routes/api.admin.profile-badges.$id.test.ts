import { ProfileBadge } from 'oa-shared';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { ProfileBadgeServiceServer } from 'src/services/profileBadgeService.server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { action } from './api.admin.profile-badges.$id';

vi.mock('src/repository/supabase.server');
vi.mock('src/services/profileBadgeService.server');

const adminBadge = (
  id: number,
  usage: { holders?: number; articles?: number } = {},
  grantsBadgeId?: number,
) => ({
  badge: new ProfileBadge({
    id,
    name: `badge-${id}`,
    displayName: `Badge ${id}`,
    imageUrl: 'https://example.com/badge.svg',
    isAudience: true,
    grantsBadgeId,
  }),
  usage: { holders: 0, articles: 0, stripeLinked: false, ...usage },
});

const setup = (badges: ReturnType<typeof adminBadge>[]) => {
  (createSupabaseServerClient as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
    client: {},
    headers: new Headers(),
  });

  const service = {
    getAllWithUsage: vi.fn().mockResolvedValue(badges),
    update: vi.fn().mockResolvedValue(badges[0]?.badge),
    delete: vi.fn().mockResolvedValue(undefined),
  };

  (ProfileBadgeServiceServer as unknown as ReturnType<typeof vi.fn>).mockImplementation(
    function () {
      return service;
    },
  );

  return service;
};

const call = (method: string, id: number, body?: unknown) =>
  action({
    request: new Request(`http://localhost/api/admin/profile-badges/${id}`, {
      method,
      body: body ? JSON.stringify(body) : undefined,
      headers: { 'Content-Type': 'application/json' },
    }),
    params: { id: String(id) },
    context: {},
  } as any) as Promise<Response>;

const validBody = {
  name: 'badge-1',
  displayName: 'Badge 1',
  imageUrl: 'https://example.com/badge.svg',
  actionUrl: null,
  isAudience: true,
  grantsBadgeId: null,
  availableTo: null,
  actionLabel: null,
};

describe('admin profile badge by id', () => {
  beforeEach(() => vi.clearAllMocks());

  it('deletes an unused badge', async () => {
    const service = setup([adminBadge(1)]);

    const res = await call('DELETE', 1);

    expect(res.status).toBe(200);
    expect(service.delete).toHaveBeenCalledWith(1);
  });

  it('refuses to delete a badge in use', async () => {
    const service = setup([adminBadge(1, { holders: 3 })]);

    const res = await call('DELETE', 1);

    expect(res.status).toBe(409);
    expect((await res.json()).error).toContain('held by 3 profiles');
    expect(service.delete).not.toHaveBeenCalled();
  });

  it('refuses to delete a badge granted by another badge', async () => {
    const service = setup([adminBadge(1), adminBadge(2, {}, 1)]);

    const res = await call('DELETE', 1);

    expect(res.status).toBe(409);
    expect(service.delete).not.toHaveBeenCalled();
  });

  it('returns 404 for an unknown badge', async () => {
    setup([adminBadge(1)]);

    const res = await call('DELETE', 2);

    expect(res.status).toBe(404);
  });

  it('updates a badge', async () => {
    const service = setup([adminBadge(1)]);

    const res = await call('PUT', 1, { ...validBody, displayName: 'Renamed' });

    expect(res.status).toBe(200);
    expect(service.update).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ displayName: 'Renamed' }),
    );
  });

  it('refuses to switch off the audience flag while the badge is used on articles', async () => {
    const service = setup([adminBadge(1, { articles: 2 })]);

    const res = await call('PUT', 1, { ...validBody, isAudience: false });

    expect(res.status).toBe(400);
    expect(service.update).not.toHaveBeenCalled();
  });
});
