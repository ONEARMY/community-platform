export const SUPPORTED_IMAGE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'image/bmp',
];

export function validateImage(image: File | null) {
  const error =
    image?.type && !SUPPORTED_IMAGE_TYPES.includes(image.type)
      ? new Error(`Unsupported image extension: ${image.type}`)
      : null;
  const valid: boolean = !error;

  return { valid, error };
}

export function validateImages(images: File[]) {
  const errors: Error[] = [];
  for (const image of images) {
    const { error } = validateImage(image);
    if (error) {
      errors.push(error);
    }
    continue;
  }

  return { valid: errors.length === 0, errors };
}

export function getCleanFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/_{2,}/g, '_'); // replace special characters with underscore
}
