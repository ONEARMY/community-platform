import type { ContentType, IMediaFile, MediaWithPublicUrl } from 'oa-shared';

type ImageFolder = ContentType | 'profiles';

const imageUpload = async (id: number | null, contentType: ImageFolder, imageFile: File) => {
  const body = new FormData();
  if (id) {
    body.append('id', id.toString());
  }
  body.append('contentType', contentType);
  body.append('imageFile', imageFile, getCleanFileName(imageFile.name));

  const response = await fetch(`/api/images`, {
    method: 'POST',
    body,
  });

  if (response.status !== 200 && response.status !== 201) {
    throw new Error('Error uploading image', { cause: 500 });
  }

  const data: { image } = await response.json();
  return data.image as MediaWithPublicUrl;
};

const fileUpload = async (id: number | null, contentType: ContentType, file: File) => {
  const body = new FormData();
  if (id) {
    body.append('id', id.toString());
  }
  body.append('contentType', contentType);
  body.append('file', file, getCleanFileName(file.name));

  const response = await fetch(`/api/documents`, {
    method: 'POST',
    body,
  });

  if (response.status !== 200 && response.status !== 201) {
    throw new Error('Error uploading document', { cause: 500 });
  }

  const data: { document: IMediaFile } = await response.json();
  return data.document;
};

const getCleanFileName = (fileName: string) => {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/_{2,}/g, '_'); // replace special characters with underscore
};

export const storageService = {
  imageUpload,
  fileUpload,
};
