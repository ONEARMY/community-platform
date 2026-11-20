import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { NewsServiceServer } from 'src/services/newsService.server';
import { ProfileBadgeServiceServer } from 'src/services/profileBadgeService.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { action } from './api.news.$id';

vi.mock('src/repository/supabase.server');
vi.mock('src/services/newsService.server');
vi.mock('src/services/profileService.server');
vi.mock('src/services/profileBadgeService.server');

const setup = (isAudience: boolean) => {
  const from = vi.fn();

  (createSupabaseServerClient as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
    client: {
      auth: { getClaims: vi.fn().mockResolvedValue({ data: { claims: { sub: 'a1' } } }) },
      from,
    },
    headers: new Headers(),
  });

  (NewsServiceServer as unknown as ReturnType<typeof vi.fn>).mockImplementation(function () {
    return {
      getById: vi.fn().mockResolvedValue({ id: 11, slug: 'members-only', created_by: 7 }),
    };
  });

  (ProfileServiceServer as unknown as ReturnType<typeof vi.fn>).mockImplementation(function () {
    return { getByAuthId: vi.fn().mockResolvedValue({ id: 7, username: 'author', roles: [] }) };
  });

  const areAudience = vi.fn().mockResolvedValue(isAudience);

  (ProfileBadgeServiceServer as unknown as ReturnType<typeof vi.fn>).mockImplementation(
    function () {
      return { areAudience };
    },
  );

  return { from, areAudience };
};

const request = () => {
  const formData = new FormData();
  formData.append('title', 'Members only');
  formData.append('isDraft', 'true');
  formData.append('body', JSON.stringify({ type: 'doc', content: [] }));
  formData.append('profileBadges', '5');

  return new Request('http://localhost/api/news/11', { method: 'PUT', body: formData });
};

describe('update news', () => {
  beforeEach(() => vi.clearAllMocks());

  it('rejects badges that are not audience badges', async () => {
    const { from, areAudience } = setup(false);

    const res = (await action({
      request: request(),
      params: { id: '11' },
      context: {},
    } as any)) as Response;

    expect(res.status).toBe(400);
    expect(areAudience).toHaveBeenCalledWith([5]);
    expect(from).not.toHaveBeenCalled();
  });
});
