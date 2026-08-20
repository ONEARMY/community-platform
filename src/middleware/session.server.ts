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

  let roles: string[] = [];
  let shouldReissueCookie = false;

  if (authId) {
    const cachedRoles = rolesCookie.verify(request, authId, tenantId);

    if (cachedRoles) {
      roles = cachedRoles;
    } else {
      const { data } = await client.from('profiles').select('roles').eq('auth_id', authId).limit(1);

      roles = data?.at(0)?.roles ?? [];
      shouldReissueCookie = true;
    }
  }

  context.set(sessionContext, authId ? { authId, roles } : null);

  const response = await next();

  mergeHeaders(headers, response.headers);

  if (shouldReissueCookie && authId) {
    response.headers.append('Set-Cookie', rolesCookie.sign({ authId, tenantId, roles }));
  }

  return response;
};
