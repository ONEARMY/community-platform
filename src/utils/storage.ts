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
