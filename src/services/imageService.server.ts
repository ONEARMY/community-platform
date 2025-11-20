import { Image, MediaFile } from 'oa-shared';

import type { TransformOptions } from '@supabase/storage-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { DBMedia } from 'oa-shared';

export class ImageServiceServer {
  constructor(private client: SupabaseClient) {}

  getPublicUrl(image: DBMedia | null, size?: TransformOptions): Image | undefined {
    if (!image) {
      return undefined;
    }

    try {
      const { data } = this.client.storage.from(process.env.TENANT_ID as string).getPublicUrl(
        image.path,
        size
          ? {
              transform: size,
            }
          : undefined,
      );

      if (!data?.publicUrl) {
        return undefined;
      }

      return new Image({ id: image.id, publicUrl: data.publicUrl });
    } catch (error) {
      return undefined;
    }
  }

  getPublicUrls(images: DBMedia[], size?: TransformOptions): Image[] {
    const result: Image[] = [];

    for (const x of images) {
      const img = this.getPublicUrl(x, size);
      if (img) {
        result.push(img);
      }
    }

    return result;
  }

  async uploadImage(files: File[], path: string) {
    if (!files || files.length === 0) {
      return null;
    }

    const errors: string[] = [];
    const media: DBMedia[] = [];

    for (const file of files) {
      const result = await this.client.storage
        .from(process.env.TENANT_ID as string)
        .upload(`${path}/${file.name}`, file, { upsert: true });

      if (result.data === null) {
        errors.push(`Error uploading file: ${file.name}`);
        errors.push(`${result.error?.message} ${result.error?.cause}`);
        continue;
      }

      media.push(result.data);
    }

    return { media, errors };
  }

  async uploadFile(files: File[], path: string) {
    if (!files || files.length === 0) {
      return null;
    }

    const errors: string[] = [];
    const media: MediaFile[] = [];

    for (const file of files) {
      const result = await this.client.storage
        .from(process.env.TENANT_ID + '-documents')
        .upload(`${path}/${file.name}`, file);

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

  async removeFiles(paths: string[]) {
    await this.client.storage.from(process.env.TENANT_ID + '-documents').remove(paths);
  }

  async removeImages(paths: string[]) {
    await this.client.storage.from(process.env.TENANT_ID as string).remove(paths);
  }

  async getPathDocuments(path: string, mapUrlPrefix: string) {
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
}
