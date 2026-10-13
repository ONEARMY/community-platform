import { ProfileBadge } from 'oa-shared';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { ProfileBadgeServiceServer } from 'src/services/profileBadgeService.server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { action } from './api.admin.profile-badges';

vi.mock('src/repository/supabase.server');
vi.mock('src/services/profileBadgeService.server');

const existing = {
  badge: new ProfileBadge({
    id: 1,
    name: 'pro',
    displayName: 'PRO',
    imageUrl: 'https://example.com/pro.svg',
    isAudience: true,
  }),
  usage: { holders: 0, articles: 0, stripeLinked: false },
};

const setup = () => {
  (createSupabaseServerClient as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
    client: {},
    headers: new Headers(),
  });

  const service = {
    getAllWithUsage: vi.fn().mockResolvedValue([existing]),
    create: vi.fn().mockResolvedValue(existing.badge),
  };

  (ProfileBadgeServiceServer as unknown as ReturnType<typeof vi.fn>).mockImplementation(
    function () {
      return service;
    },
  );

  return service;
};

const post = (body: unknown) =>
  action({
    request: new Request('http://localhost/api/admin/profile-badges', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    }),
    params: {},
    context: {},
  } as any) as Promise<Response>;

const validBody = {
  name: 'member',
  displayName: 'Member',
  imageUrl: 'https://example.com/member.svg',
  actionUrl: '/support',
  isAudience: true,
  grantsBadgeId: null,
  availableTo: 'non_space',
  actionLabel: 'Become a member',
};

describe('create admin profile badge', () => {
  beforeEach(() => vi.clearAllMocks());

  it('creates a valid badge', async () => {
    const service = setup();

    const res = await post(validBody);

    expect(res.status).toBe(201);
    expect(service.create).toHaveBeenCalledWith(expect.objectContaining({ name: 'member' }));
  });

  it('rejects an invalid name', async () => {
    const service = setup();

    const res = await post({ ...validBody, name: 'Member Badge' });

    expect(res.status).toBe(400);
    expect(service.create).not.toHaveBeenCalled();
  });

  it('rejects a name that is already taken', async () => {
    const service = setup();

    const res = await post({ ...validBody, name: 'pro' });

    expect(res.status).toBe(409);
    expect(service.create).not.toHaveBeenCalled();
  });

  it('rejects an offer without a button label', async () => {
    const service = setup();

    const res = await post({ ...validBody, actionLabel: '' });

    expect(res.status).toBe(400);
    expect(service.create).not.toHaveBeenCalled();
  });
});
