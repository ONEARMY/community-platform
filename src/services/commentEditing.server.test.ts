import { beforeEach, describe, expect, it, vi } from 'vitest';
import { action } from 'src/routes/api.discussions.$sourceId.comments.$id';

const state = vi.hoisted(() => ({
  claims: true,
  profile: { id: 2, auth_id: 'user-auth', username: 'admin', roles: ['admin'] },
  comment: { id: 41, source_id: 7, created_by: 3 },
  missing: false,
  update: vi.fn(),
  filters: [] as [string, unknown][],
}));
vi.mock('src/services/profileService.server', () => ({
  ProfileServiceServer: class {
    updateUserActivity = vi.fn();
  },
}));
vi.mock('src/repository/supabase.server', () => ({
  createSupabaseServerClient: () => ({
    headers: new Headers(),
    client: {
      auth: {
        getClaims: async () => ({ data: state.claims ? { claims: { sub: 'user-auth' } } : null }),
      },
      from: (table: string) => {
        const filters: [string, unknown][] = [];
        const query = {
          select: () => query,
          eq: (key: string, value: unknown) => {
            state.filters.push([key, value]);
            filters.push([key, value]);
            return query;
          },
          limit: async () => ({ data: [state.profile], error: null }),
          single: async () => ({
            data:
              state.missing ||
              filters.some(([key, value]) =>
                String(state.comment[key as keyof typeof state.comment]) !== String(value),
              )
                ? null
                : state.comment,
            error: null,
          }),
          update: (payload: unknown) => ({ eq: async () => state.update(payload) }),
        };
        return query;
      },
    },
  }),
}));
const request = (body: string, method = 'PUT', sourceId = '7') =>
  action({
    request: new Request('http://localhost/api/discussions/7/comments/41', {
      method,
      body: method === 'DELETE' ? undefined : body,
    }),
    params: { sourceId, id: '41' },
  } as never);
const status = (result: Awaited<ReturnType<typeof action>>) =>
  result instanceof Response ? result.status : result.init?.status;
beforeEach(() => {
  state.claims = true;
  state.profile.roles = ['admin'];
  state.comment.created_by = 3;
  state.missing = false;
  state.filters = [];
  state.update.mockReset().mockResolvedValue({ error: null });
});

describe('comment delete boundary', () => {
  it('requires authentication before deleting', async () => {
    state.claims = false;
    expect(status(await request('', 'DELETE'))).toBe(401);
    expect(state.update).not.toHaveBeenCalled();
  });

  it('blocks an unrelated member', async () => {
    state.profile.roles = [];
    expect(status(await request('', 'DELETE'))).toBe(403);
    expect(state.update).not.toHaveBeenCalled();
  });

  it('allows the owner to soft-delete their comment', async () => {
    state.profile.roles = [];
    state.comment.created_by = state.profile.id;
    expect(status(await request('', 'DELETE'))).toBe(204);
    expect(state.update).toHaveBeenCalledTimes(1);
    expect(state.update).toHaveBeenCalledWith({ deleted: true });
  });

  it('allows an admin to soft-delete another member comment', async () => {
    expect(status(await request('', 'DELETE'))).toBe(204);
    expect(state.filters).toContainEqual(['id', '41']);
    expect(state.filters).toContainEqual(['source_id', '7']);
    expect(state.update).toHaveBeenCalledWith({ deleted: true });
  });

  it('does not delete an existing comment through another source', async () => {
    expect(status(await request('', 'DELETE', '8'))).toBe(404);
    expect(state.update).not.toHaveBeenCalled();
  });

  it('does not claim success after a returned database error', async () => {
    state.update.mockResolvedValue({ error: new Error('write failed') });
    expect(status(await request('', 'DELETE'))).toBe(500);
  });

  it('handles an asynchronous deletion rejection in the action', async () => {
    state.update.mockRejectedValue(new Error('connection lost'));
    expect(status(await request('', 'DELETE'))).toBe(500);
  });
});
describe('comment edit boundary', () => {
  it('requires authentication', async () => {
    state.claims = false;
    expect(status(await request('{"comment":"edited"}'))).toBe(401);
    expect(state.update).not.toHaveBeenCalled();
  });
  it('blocks another member from editing', async () => {
    state.profile.roles = [];
    expect(status(await request('{"comment":"edited"}'))).toBe(403);
    expect(state.update).not.toHaveBeenCalled();
  });
  it.each([
    '{',
    '{}',
    '{"comment":[]}',
    '{"comment":"   "}',
  ])('rejects malformed/empty text %s', async (body) => {
    expect(status(await request(body))).toBe(400);
    expect(state.update).not.toHaveBeenCalled();
  });
  it('allows an admin while selecting the requested source and persisting only text', async () => {
    expect(status(await request('{"comment":"edited","deleted":true,"created_by":2}'))).toBe(204);
    expect(state.filters).toContainEqual(['source_id', '7']);
    expect(state.update).toHaveBeenCalledWith({ comment: 'edited' });
  });
  it('rejects a source/ID combination with no matching row', async () => {
    state.missing = true;
    expect(status(await request('{"comment":"edited"}'))).toBe(404);
    expect(state.update).not.toHaveBeenCalled();
  });
  it('returns failure rather than success when the update throws', async () => {
    state.update.mockRejectedValue(new Error('connection lost'));
    expect(status(await request('{"comment":"edited"}'))).toBe(500);
  });
});
