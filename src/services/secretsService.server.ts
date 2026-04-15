import { createSupabaseAdminServerClient } from 'src/repository/supabaseAdmin.server';

const cache = new Map<string, string>();

export const getSecret = async (name: string): Promise<string> => {
  const tenantId = process.env.TENANT_ID;
  if (!tenantId) {
    throw new Error('TENANT_ID environment variable is not set');
  }

  const prefixedName = `${name}:${tenantId}`;
  const cached = cache.get(prefixedName);
  if (cached) return cached;

  const client = createSupabaseAdminServerClient();
  const { data } = await client.rpc('read_secret', { secret_name: prefixedName });

  if (data) {
    cache.set(prefixedName, data);
    return data;
  }

  // Fall back to environment variable (e.g. from .env.local) for local dev
  const envValue = process.env[name];
  if (envValue) {
    cache.set(prefixedName, envValue);
    return envValue;
  }

  throw new Error(`Secret "${prefixedName}" not found in vault or environment`);
};
