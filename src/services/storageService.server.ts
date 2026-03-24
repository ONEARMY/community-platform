import type { TransformOptions } from '@supabase/storage-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { DBMedia } from 'oa-shared';
import { Image, MediaFile } from 'oa-shared';
import sharp from 'sharp';

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
      try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Determine format and dimensions
        const metadata = await sharp(buffer).metadata();

        // Check if image needs processing
        // Always process JPEG/PNG for WebP conversion
        // Process other formats if: dimensions too large OR file size > 1MB
        const isJpegOrPng =
          metadata.format === 'jpeg' || metadata.format === 'jpg' || metadata.format === 'png';
        const needsProcessing =
          isJpegOrPng ||
          (metadata.width &&
            metadata.height &&
            (metadata.width > 2048 || metadata.height > 2048)) ||
          buffer.length > 1024 * 1024; // 1MB in bytes

        let finalBuffer: Buffer;
        let finalContentType = file.type;
        let finalFileName = file.name;

        if (needsProcessing) {
          let processedImage = sharp(buffer);

          // Only resize if dimensions exceed limits
          const needsResize =
            metadata.width && metadata.height && (metadata.width > 2048 || metadata.height > 2048);

          if (needsResize) {
            processedImage = processedImage.resize(2048, 2048, {
              fit: 'inside',
              withoutEnlargement: true,
              kernel: 'lanczos3', // High-quality resizing
            });
          }

          switch (metadata.format) {
            case 'jpeg':
            case 'jpg':
              // Convert JPEG to WebP for better compression (25-35% smaller)
              processedImage = processedImage.webp({
                quality: 82, // Slightly higher quality for JPEG conversions
                alphaQuality: 100,
                effort: 6,
                smartSubsample: true,
              });
              finalContentType = 'image/webp';
              // Update filename extension from .jpg/.jpeg to .webp
              finalFileName = file.name.replace(/\.(jpg|jpeg)$/i, '.webp');
              break;
            case 'png':
              // Convert PNG to WebP for better compression (25-35% smaller)
              processedImage = processedImage.webp({
                quality: 85, // Slightly higher quality for PNG conversions
                alphaQuality: 100, // Preserve transparency quality
                effort: 6, // Maximum compression effort
                smartSubsample: true,
              });
              finalContentType = 'image/webp';
              // Update filename extension from .png to .webp
              finalFileName = file.name.replace(/\.png$/i, '.webp');
              break;
            case 'webp':
              processedImage = processedImage.webp({
                quality: 80, // WebP is efficient, 80 provides excellent quality
                alphaQuality: 100, // Preserve transparency quality
                effort: 6, // Maximum compression effort (0-6)
                smartSubsample: true, // Better quality/size balance
              });
              finalContentType = 'image/webp';
              break;
            case 'gif':
              // Keep GIF format to preserve animations and transparency
              processedImage = processedImage.gif();
              finalContentType = 'image/gif';
              break;
            case 'tiff':
              processedImage = processedImage.tiff({
                compression: 'lzw', // Lossless compression
                quality: 85,
              });
              finalContentType = 'image/tiff';
              break;
            case 'avif':
              processedImage = processedImage.avif({
                quality: 80,
                effort: 6,
              });
              finalContentType = 'image/avif';
              break;
            default:
              // Keep original format for other types (preserves transparency, animations, etc.)
              processedImage = processedImage.toFormat(metadata.format as any);
          }

          const processedBuffer = await processedImage.toBuffer();

          // Use processed version only if it's smaller, otherwise keep original
          if (processedBuffer.length < buffer.length) {
            finalBuffer = processedBuffer;
          } else {
            finalBuffer = buffer;
            finalContentType = file.type; // Keep original content type
            finalFileName = file.name; // Keep original filename
          }
        } else {
          // Non-JPEG/PNG image already optimized (dimensions ≤ 2048x2048 and size ≤ 1MB)
          finalBuffer = buffer;
        }

        const result = await this.client.storage
          .from(process.env.TENANT_ID as string)
          .upload(`${path}/${finalFileName}`, finalBuffer, {
            upsert: true,
            contentType: finalContentType,
          });

        if (result.data === null) {
          errors.push(file.name + ': ' + result.error?.message);
          continue;
        }

        media.push(result.data);
      } catch (error) {
        errors.push(file.name + ': ' + (error instanceof Error ? error.message : 'Unknown error'));
      }
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
        errors.push(result.error.message);
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
