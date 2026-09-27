import { parseCookieHeader, serializeCookieHeader } from '@supabase/ssr';
import pkg from 'jsonwebtoken';

const COOKIE_NAME = 'oa_roles';
const TTL_SECONDS = 10 * 60;
const key = process.env.TOKEN_SECRET as string;

type RolesPayload = {
  authId: string;
  tenantId: string;
  profileId: number | null;
  username: string | null;
  roles: string[];
};

const sign = (payload: RolesPayload) => {
  const token = pkg.sign(payload, key, { expiresIn: TTL_SECONDS });

  return serializeCookieHeader(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: TTL_SECONDS,
  });
};

// authId/tenantId are the current, trusted values (from the just-verified Supabase claims),
// so a cookie minted for a different user or tenant is rejected rather than trusted.
const verify = (
  request: Request,
  authId: string,
  tenantId: string,
): Pick<RolesPayload, 'profileId' | 'username' | 'roles'> | null => {
  const token = parseCookieHeader(request.headers.get('Cookie') ?? '').find(
    (cookie) => cookie.name === COOKIE_NAME,
  )?.value;

  if (!token) {
    return null;
  }

  try {
    const payload = pkg.verify(token, key) as RolesPayload;

    if (payload.authId !== authId || payload.tenantId !== tenantId) {
      return null;
    }

    return { profileId: payload.profileId, username: payload.username, roles: payload.roles };
  } catch {
    return null;
  }
};

export const rolesCookie = { sign, verify };
