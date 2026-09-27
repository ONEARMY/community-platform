import type { MiddlewareFunction } from 'react-router';
import { sessionContext } from 'src/context';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { rolesCookie } from 'src/utils/rolesCookie.server';

const mergeHeaders = (from: Headers, into: Headers) => {
  from.forEach((value, key) => {
    if (key.toLowerCase() === 'set-cookie') {
      into.append(key, value);
    } else {
      into.set(key, value);
    }
  });
};

export const sessionMiddleware: MiddlewareFunction<Response> = async (
  { request, context },
  next,
) => {
  const { client, headers } = createSupabaseServerClient(request);
  const claims = await client.auth.getClaims();
  const authId = claims.data?.claims?.sub;
  const tenantId = process.env.TENANT_ID!;

  let profileId: number | null = null;
  let username: string | null = null;
  let roles: string[] = [];
  let shouldReissueCookie = false;

  if (authId) {
    const cached = rolesCookie.verify(request, authId, tenantId);

    if (cached) {
      profileId = cached.profileId;
      username = cached.username;
      roles = cached.roles;
    } else {
      const { data } = await client
        .from('profiles')
        .select('id,username,roles')
        .eq('auth_id', authId)
        .limit(1);

      const profile = data?.at(0);
      profileId = profile?.id ?? null;
      username = profile?.username ?? null;
      roles = profile?.roles ?? [];
      shouldReissueCookie = true;
    }
  }

  context.set(sessionContext, authId ? { authId, profileId, username, roles } : null);

  const response = await next();

  mergeHeaders(headers, response.headers);

  if (shouldReissueCookie && authId) {
    response.headers.append(
      'Set-Cookie',
      rolesCookie.sign({ authId, tenantId, profileId, username, roles }),
    );
  }

  return response;
};
