import type { TransformOptions } from '@supabase/storage-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { DBMedia } from 'oa-shared';
import { Image, MediaFile } from 'oa-shared';

export class StorageServiceServer {
  constructor(private client: SupabaseClient) {}

  getPublicUrl(image: DBMedia, size?: TransformOptions): Image | null {
    try {
      const { data } = this.client.storage.from(process.env.TENANT_ID as string).getPublicUrl(
        image.path,
        size
          ? {
              transform: size,
            }
          : undefined,
      );
      return new Image({
        id: image.id,
        publicUrl: data.publicUrl,
      });
    } catch (_) {
      // Skip null images - don't add to result
    }

    return null;
  }

  getPublicUrls(images: DBMedia[], size?: TransformOptions): Image[] {
    const result: Image[] = [];

    for (const x of images || []) {
      try {
        const { data } = this.client.storage.from(process.env.TENANT_ID as string).getPublicUrl(
          x.path,
          size
            ? {
                transform: size,
              }
            : undefined,
        );
        result.push(
          new Image({
            id: x.id,
            publicUrl: data.publicUrl,
          }),
        );
      } catch (_) {
        // Skip null images - don't add to result
      }
    }

    return result;
  }

  async uploadImage(
    files: File[],
    path: string,
  ): Promise<{
    media: DBMedia[];
    errors: string[];
  }> {
    const errors: string[] = [];
    const media: DBMedia[] = [];

    for (const file of files) {
      const result = await this.client.storage
        .from(process.env.TENANT_ID as string)
        .upload(`${path}/${file.name}`, file, { upsert: true });

      if (result.data === null) {
        errors.push(`Error uploading file: ${file.name}`);
        continue;
      }

      media.push(result.data);
    }

    return { media, errors };
  }

  async uploadFile(
    files: File[],
    path: string,
  ): Promise<{
    media: MediaFile[];
    errors: string[];
  } | null> {
    if (!files || files.length === 0) {
      return null;
    }

    const errors: string[] = [];
    const media: MediaFile[] = [];

    for (const file of files) {
      // Check if file exists and determine unique filename if needed
      let fileName = file.name;
      const fileInfo = await this.client.storage
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
          uniqueFileInfo = await this.client.storage
            .from(process.env.TENANT_ID + '-documents')
            .info(`${path}/${fileName}`);
          i++;
        } while (uniqueFileInfo.data);
      }

      const result = await this.client.storage
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
  }

  async removeFiles(paths: string[]): Promise<void> {
    await this.client.storage.from(process.env.TENANT_ID + '-documents').remove(paths);
  }

  async removeImages(paths: string[]): Promise<void> {
    await this.client.storage.from(process.env.TENANT_ID as string).remove(paths);
  }

  async getPathDocuments(path: string, mapUrlPrefix: string): Promise<MediaFile[]> {
    const documentsBucket = process.env.TENANT_ID + '-documents';

    const { data, error } = await this.client.storage.from(documentsBucket).list(path);

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
  }

  async moveImage(
    sourcePath: string,
    destinationPath: string,
    fileName: string,
  ): Promise<DBMedia | null> {
    const bucket = process.env.TENANT_ID as string;
    const fullDestinationPath = `${destinationPath}/${fileName}`;

    try {
      // Copy the file to the new location
      const { data: copyData, error: copyError } = await this.client.storage
        .from(bucket)
        .copy(sourcePath, fullDestinationPath);

      if (copyError) {
        console.error('Error copying file:', copyError);
        return null;
      }

      // Delete the original file
      await this.client.storage.from(bucket).remove([sourcePath]);

      return {
        id: fullDestinationPath,
        path: copyData.path,
        fullPath: fullDestinationPath,
      };
    } catch (error) {
      console.error('Error moving image:', error);
      return null;
    }
  }
}
