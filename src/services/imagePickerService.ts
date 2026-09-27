import type { Image } from 'oa-shared';
import type { ImagePickerPath } from 'src/config/imagePickerPaths';

const list = async (path: ImagePickerPath): Promise<Image[]> => {
  const response = await fetch(`/api/admin/images/${path}`);

  if (!response.ok) {
    throw new Error('Error loading images');
  }

  const data: { images: Image[] } = await response.json();
  return data.images;
};

const upload = async (path: ImagePickerPath, file: File): Promise<Image> => {
  const body = new FormData();
  body.append('imageFile', file);

  const response = await fetch(`/api/admin/images/${path}`, {
    method: 'POST',
    body,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Error uploading image' }));
    throw new Error(errorData.error || 'Error uploading image');
  }

  const data: { image: Image } = await response.json();
  return data.image;
};

export const imagePickerService = { list, upload };
