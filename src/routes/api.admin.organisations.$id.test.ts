import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { MapServiceServer } from 'src/services/mapService.server';
import { sendModerationEmail } from 'src/services/moderationEmailService.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { action } from './api.admin.organisations.$id';

vi.mock('src/repository/supabase.server');
vi.mock('src/services/profileService.server');
vi.mock('src/services/mapService.server');
vi.mock('src/services/moderationEmailService.server');

const setup = (profile: object | null = {}) => {
  (createSupabaseServerClient as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
    client: {},
    headers: new Headers(),
  });

  const updateModeration = vi.fn().mockResolvedValue(true);
  const updateModerationByProfileId = vi.fn().mockResolvedValue(undefined);

  (ProfileServiceServer as unknown as ReturnType<typeof vi.fn>).mockImplementation(function () {
    return {
      getById: vi.fn().mockResolvedValue(
        profile && {
          id: 7,
          auth_id: 'auth-7',
          username: 'acme-lab',
          moderation: 'awaiting-moderation',
          moderation_feedback: null,
          ...profile,
        },
      ),
      updateModeration,
    };
  });

  (MapServiceServer as unknown as ReturnType<typeof vi.fn>).mockImplementation(function () {
    return {
      updateModerationByProfileId,
    };
  });

  return { updateModeration, updateModerationByProfileId };
};

const put = (body: object, id = '7') =>
  action({
    request: new Request(`http://localhost/api/admin/organisations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
    params: { id },
    context: {},
  } as any) as Promise<Response>;

describe('admin organisation moderation', () => {
  beforeEach(() => vi.clearAllMocks());

  it('rejects an unknown status', async () => {
    const { updateModeration } = setup();

    const res = await put({ moderation: 'banned' });

    expect(res.status).toBe(400);
    expect(updateModeration).not.toHaveBeenCalled();
  });

  it.each(['improvements-needed', 'rejected'])('requires feedback for %s', async (moderation) => {
    const { updateModeration } = setup();

    const res = await put({ moderation, feedback: '  ' });

    expect(res.status).toBe(400);
    expect(updateModeration).not.toHaveBeenCalled();
  });

  it('rejects a body that is not JSON', async () => {
    const { updateModeration } = setup();

    const res = (await action({
      request: new Request('http://localhost/api/admin/organisations/7', {
        method: 'PUT',
        body: 'not json',
      }),
      params: { id: '7' },
      context: {},
    } as any)) as Response;

    expect(res.status).toBe(400);
    expect(updateModeration).not.toHaveBeenCalled();
  });

  it('rejects feedback that is not text', async () => {
    const { updateModeration } = setup();

    const res = await put({ moderation: 'rejected', feedback: 42 });

    expect(res.status).toBe(400);
    expect(updateModeration).not.toHaveBeenCalled();
  });

  it('leaves the profile unchanged when the map pin update fails', async () => {
    const { updateModeration, updateModerationByProfileId } = setup();
    updateModerationByProfileId.mockRejectedValue(new Error('db down'));

    const res = await put({ moderation: 'accepted' });

    expect(res.status).toBe(500);
    expect(updateModeration).not.toHaveBeenCalled();
    expect(sendModerationEmail).not.toHaveBeenCalled();
  });

  it('returns 404 for a profile with no status, even with a map pin', async () => {
    const { updateModeration, updateModerationByProfileId } = setup({
      moderation: null,
      type: { is_space: true },
    });

    const res = await put({ moderation: 'accepted' });

    expect(res.status).toBe(404);
    expect(updateModeration).not.toHaveBeenCalled();
    expect(updateModerationByProfileId).not.toHaveBeenCalled();
    expect(sendModerationEmail).not.toHaveBeenCalled();
  });

  it('updates the profile and its map pin, then emails the organisation', async () => {
    const { updateModeration, updateModerationByProfileId } = setup();

    const res = await put({ moderation: 'rejected', feedback: ' Not a workspace ' });

    expect(res.status).toBe(200);
    expect(updateModeration).toHaveBeenCalledWith(7, 'rejected', 'Not a workspace');
    expect(updateModerationByProfileId).toHaveBeenCalledWith(7, 'rejected', 'Not a workspace');
    expect(sendModerationEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        authId: 'auth-7',
        username: 'acme-lab',
        moderation: 'rejected',
        feedback: 'Not a workspace',
      }),
    );
  });

  it('does not email when nothing changed', async () => {
    const { updateModeration } = setup({ moderation: 'accepted' });

    const res = await put({ moderation: 'accepted', feedback: '' });

    expect(res.status).toBe(200);
    expect(updateModeration).toHaveBeenCalledWith(7, 'accepted', null);
    expect(sendModerationEmail).not.toHaveBeenCalled();
  });

  it('does not email when moved back to awaiting moderation', async () => {
    setup({ moderation: 'accepted' });

    const res = await put({ moderation: 'awaiting-moderation' });

    expect(res.status).toBe(200);
    expect(sendModerationEmail).not.toHaveBeenCalled();
  });
});
