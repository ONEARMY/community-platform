import { createClient } from 'jsr:@supabase/supabase-js@2.46.1';

const MAX_AGE_MS = 24 * 60 * 60 * 1000;
const PAGE_SIZE = 1000;

const client = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

const listAll = async (bucket: string, path: string) => {
  const items = [];
  for (let offset = 0; ; offset += PAGE_SIZE) {
    const { data, error } = await client.storage
      .from(bucket)
      .list(path, { limit: PAGE_SIZE, offset });
    if (error) {
      throw error;
    }
    items.push(...data);
    if (data.length < PAGE_SIZE) {
      return items;
    }
  }
};

const cleanupBucket = async (bucket: string, cutoff: number) => {
  const stale: string[] = [];

  for (const userFolder of await listAll(bucket, 'pending')) {
    const folder = `pending/${userFolder.name}`;
    for (const file of await listAll(bucket, folder)) {
      if (file.id && Date.parse(file.created_at) < cutoff) {
        stale.push(`${folder}/${file.name}`);
      }
    }
  }

  for (let i = 0; i < stale.length; i += PAGE_SIZE) {
    const { error } = await client.storage.from(bucket).remove(stale.slice(i, i + PAGE_SIZE));
    if (error) {
      throw error;
    }
  }

  return stale.length;
};

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('not allowed', { status: 405 });
  }

  try {
    const { data: buckets, error } = await client.storage.listBuckets();
    if (error) {
      throw error;
    }

    const cutoff = Date.now() - MAX_AGE_MS;
    const removed: Record<string, number> = {};

    for (const { name } of buckets.filter((x) => x.name.endsWith('-documents'))) {
      removed[name] = await cleanupBucket(name, cutoff);
    }

    return Response.json({ removed });
  } catch (error) {
    console.error(error);
    return new Response('cleanup failed', { status: 500 });
  }
});
