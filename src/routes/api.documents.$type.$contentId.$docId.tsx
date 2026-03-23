import type { FileObject } from '@supabase/storage-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { IDBDownloadable } from 'oa-shared';
import type { LoaderFunctionArgs, Params } from 'react-router';
import { redirect } from 'react-router';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { resolveType } from 'src/utils/contentType.utils';

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request);

  const claims = await client.auth.getClaims();

  if (!claims.data?.claims) {
    return Response.json({}, { status: 401, headers });
  }

  const result = await resolveUrl(params, client, headers);

  if (result.status === 302) {
    // 302 status means the file is returned
    await incrementDownloadCount(params.type!, +params.contentId!, client);
  }

  return result;
}

async function resolveUrl(params: Params<string>, client: SupabaseClient, headers: Headers) {
  const tableName = resolveType(params.type!);
  const contentId = +params.contentId!;
  const docId = params.docId!;

  if (!tableName) {
    return Response.json({}, { status: 400, headers });
  }

  if (docId === 'link') {
    return await resolveFileLink(tableName, contentId, client, headers);
  }

  const bucket = `${process.env.TENANT_ID}-documents`;

  // Query storage.objects table to get the actual file path
  const fileMetadata = await resolveFileFromStorage(docId, bucket, client);

  if (!fileMetadata) {
    return Response.json({}, { status: 404, headers });
  }

  const result = await client.storage.from(bucket).createSignedUrl(fileMetadata.fullPath, 3600, {
    download: true,
  });

  if (!result.data?.signedUrl) {
    console.error(result.error);
    return Response.json({}, { status: 500, headers });
  }

  return redirect(result.data?.signedUrl);
}

async function resolveFileLink(
  tableName: string,
  id: number,
  client: SupabaseClient,
  headers: Headers,
) {
  const { data, error } = await client.from(tableName).select('id,file_link').eq('id', id).single();

  if (!data) {
    console.error(error);
    return Response.json({}, { status: 500, headers });
  }

  return redirect(data.file_link);
}

async function resolveFileFromStorage(
  docId: string,
  bucket: string,
  client: SupabaseClient,
): Promise<{ fullPath: string; name: string } | null> {
  // Use RPC function to query storage.objects table (which is in storage schema)
  const { data, error } = await client
    .rpc('get_storage_object_path', {
      object_id: docId,
      bucket_name: bucket,
    })
    .single<FileObject>();

  if (!data || error) {
    console.error('Failed to resolve file from storage.objects:', error);
    return null;
  }

  // The name field contains the full path in storage
  const fullPath = data.name;

  return { fullPath, name: data.name };
}

async function incrementDownloadCount(type: string, contentId: number, client: SupabaseClient) {
  const tableName = resolveType(type)!;

  const { data } = await client
    .from(tableName)
    .select('id,file_download_count')
    .eq('id', +contentId)
    .single();
  const downloadableDoc = data as Partial<IDBDownloadable>;

  await client
    .from(tableName)
    .update({
      file_download_count: (downloadableDoc.file_download_count || 0) + 1,
    })
    .eq('id', +contentId);
}
