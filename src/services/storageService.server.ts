import type { TransformOptions } from '@supabase/storage-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { DBMedia, FullMedia } from 'oa-shared';
import { MediaFile } from 'oa-shared';

const getPublicUrls = (
  client: SupabaseClient,
  images: DBMedia[],
  size?: TransformOptions,
): FullMedia[] => {
  const result: FullMedia[] = [];

  for (const x of images || []) {
    try {
      const { data } = client.storage.from(process.env.TENANT_ID as string).getPublicUrl(
        x.path,
        size
          ? {
              transform: size,
            }
          : undefined,
      );
      result.push({
        id: x.id,
        publicUrl: data.publicUrl,
        path: x.path,
        fullPath: x.fullPath,
      } as FullMedia);
    } catch (_) {
      // Skip null images - don't add to result
    }
  }

  return result;
};

const uploadImage = async (files: File[], path: string, client: SupabaseClient) => {
  const errors: string[] = [];
  const media: DBMedia[] = [];

  for (const file of files) {
    const result = await client.storage
      .from(process.env.TENANT_ID as string)
      .upload(`${path}/${file.name}`, file, { upsert: true });

    if (result.data === null) {
      errors.push(`Error uploading file: ${file.name}`);
      continue;
    }

    media.push(result.data);
  }

  return { media, errors };
};

const uploadFile = async (files: File[], path: string, client: SupabaseClient) => {
  if (!files || files.length === 0) {
    return null;
  }

  const errors: string[] = [];
  const media: MediaFile[] = [];

  for (const file of files) {
    // Check if file exists and determine unique filename if needed
    let fileName = file.name;
    const fileInfo = await client.storage
      .from(process.env.TENANT_ID + '-documents')
      .info(`${path}/${fileName}`);

    if (fileInfo.data) {
      // File exists, find a unique name
      const lastDotIndex = file.name.lastIndexOf('.');
      const nameWithoutExt = lastDotIndex > 0 ? file.name.substring(0, lastDotIndex) : file.name;
      const extension = lastDotIndex > 0 ? file.name.substring(lastDotIndex) : '';
      let i = 1;
      let uniqueFileInfo;

      do {
        fileName = `${nameWithoutExt}-${i}${extension}`;
        uniqueFileInfo = await client.storage
          .from(process.env.TENANT_ID + '-documents')
          .info(`${path}/${fileName}`);
        i++;
      } while (uniqueFileInfo.data);
    }

    const result = await client.storage
      .from(process.env.TENANT_ID + '-documents')
      .upload(`${path}/${fileName}`, file);

    if (result.data === null) {
      errors.push(`Error uploading file: ${file.name}`);
      continue;
    }

    media.push({
      id: result.data.id,
      name: result.data.path.split('/').at(-1)!,
      size: file.size,
    });
  }

  return { media, errors };
};

const removeFiles = async (paths: string[], client: SupabaseClient) => {
  await client.storage.from(process.env.TENANT_ID + '-documents').remove(paths);
};

const removeImages = async (paths: string[], client: SupabaseClient) => {
  await client.storage.from(process.env.TENANT_ID as string).remove(paths);
};

const getPathDocuments = async (path: string, mapUrlPrefix: string, client: SupabaseClient) => {
  const documentsBucket = process.env.TENANT_ID + '-documents';

  const { data, error } = await client.storage.from(documentsBucket).list(path);

  if (!data || error) {
    return [];
  }

  return data?.map(
    (x) =>
      new MediaFile({
        id: x.id,
        name: x.name,
        size: x.metadata.size,
        url: `${mapUrlPrefix}/${x.id}`,
      }),
  );
};

const moveImage = async (
  sourcePath: string,
  destinationPath: string,
  fileName: string,
  client: SupabaseClient,
): Promise<DBMedia | null> => {
  const bucket = process.env.TENANT_ID as string;
  const fullDestinationPath = `${destinationPath}/${fileName}`;

  try {
    // Copy the file to the new location
    const { data: copyData, error: copyError } = await client.storage
      .from(bucket)
      .copy(sourcePath, fullDestinationPath);

    if (copyError) {
      console.error('Error copying file:', copyError);
      return null;
    }

    // Delete the original file
    await client.storage.from(bucket).remove([sourcePath]);

    return {
      id: fullDestinationPath,
      path: copyData.path,
      fullPath: fullDestinationPath,
    };
  } catch (error) {
    console.error('Error moving image:', error);
    return null;
  }
};

const getById = async (id: string, client: SupabaseClient) => {
  return await client.from('storage.objects').select('*').eq('id', id);
};

export const storageServiceServer = {
  getPublicUrls,
  uploadImage,
  uploadFile,
  removeFiles,
  removeImages,
  getPathDocuments,
  moveImage,
  getById,
};
