import { UserRole } from 'oa-shared';
import type { Session } from 'src/context';
import { sessionContext } from 'src/context';
import { ForbiddenPage } from 'src/pages/Forbidden/labels';
import { describe, expect, it, vi } from 'vitest';
import { RouterContextProvider } from 'react-router';
import { requireAnyRole, requireRole } from './requireRole.server';

const runMiddleware = async (
  middleware: ReturnType<typeof requireRole>,
  session: Session,
  path = '/admin/users',
) => {
  const context = new RouterContextProvider();
  context.set(sessionContext, session);
  const next = vi.fn();
  const result = await middleware(
    {
      request: new Request(`http://localhost${path}`),
      context,
      params: {},
      unstable_pattern: path,
    } as unknown as Parameters<typeof middleware>[0],
    next,
  );
  return { result, next };
};

const catchThrown = async (promise: Promise<unknown>) => {
  try {
    await promise;
  } catch (thrown) {
    return thrown as Response;
  }
  throw new Error('Expected middleware to throw');
};

const session = (roles: string[]): Session => ({
  authId: 'auth-id',
  profileId: 1,
  username: 'user',
  roles,
});

describe('requireRole', () => {
  const adminOnly = requireRole(UserRole.ADMIN, ForbiddenPage.ADMIN);

  it('redirects anonymous users to sign-in with a return url', async () => {
    const response = await catchThrown(runMiddleware(adminOnly, null, '/admin'));

    expect(response.status).toBe(302);
    expect(response.headers.get('Location')).toBe('/sign-in?returnUrl=%2Fadmin');
  });

  it('redirects users without the role to the forbidden page', async () => {
    const response = await catchThrown(runMiddleware(adminOnly, session([])));

    expect(response.status).toBe(302);
    expect(response.headers.get('Location')).toBe('/forbidden?page=admin');
  });

  it('lets users with the role through', async () => {
    const { result } = await runMiddleware(adminOnly, session([UserRole.ADMIN]));

    expect(result).toBeUndefined();
  });
});

describe('requireAnyRole', () => {
  const creators = requireAnyRole(
    [UserRole.ADMIN, UserRole.RESEARCH_CREATOR],
    ForbiddenPage.RESEARCH_CREATE,
  );

  it('redirects anonymous users to sign-in', async () => {
    const response = await catchThrown(runMiddleware(creators, null, '/research/create'));

    expect(response.headers.get('Location')).toBe('/sign-in?returnUrl=%2Fresearch%2Fcreate');
  });

  it('redirects users with none of the roles to the forbidden page', async () => {
    const response = await catchThrown(runMiddleware(creators, session([UserRole.BETA_TESTER])));

    expect(response.headers.get('Location')).toBe('/forbidden?page=research-create');
  });

  it('lets users with any of the roles through', async () => {
    const { result } = await runMiddleware(creators, session([UserRole.RESEARCH_CREATOR]));

    expect(result).toBeUndefined();
  });
});
