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

  if (response.status === 413) {
    throw new Error('The image is too large, the maximum allowed is 10MB', {
      cause: response.status,
    });
  }

  if (response.status !== 200 && response.status !== 201) {
    const errorData = await response.json().catch(() => ({ error: 'Error saving image' }));
    const errorMessage = errorData.error || errorData.message || 'Error saving image';
    throw new Error(errorMessage, { cause: response.status });
  }

  const data: { image } = await response.json();
  return data.image as MediaWithPublicUrl;
};

const fileUpload = async (id: number | null, contentType: ContentType, file: File) => {
  const uploadResponse = await fetch(`/api/documents`, {
    method: 'POST',
    body: JSON.stringify({ size: file.size }),
  });
  await throwOnFileError(uploadResponse);
  const { uploadId, uploadUrl }: { uploadId: string; uploadUrl: string } =
    await uploadResponse.json();

  const body = new FormData();
  body.append('cacheControl', '3600');
  body.append('', file);

  const storageResponse = await fetch(uploadUrl, { method: 'PUT', body });
  await throwOnFileError(storageResponse);

  const confirmResponse = await fetch(`/api/documents/confirm`, {
    method: 'POST',
    body: JSON.stringify({ uploadId, id, contentType, fileName: getCleanFileName(file.name) }),
  });
  await throwOnFileError(confirmResponse);

  const data: { document: IMediaFile } = await confirmResponse.json();
  return data.document;
};

const throwOnFileError = async (response: Response) => {
  if (response.status === 413) {
    throw new Error('The file is too large', {
      cause: response.status,
    });
  }

  if (response.status !== 200 && response.status !== 201) {
    const errorData = await response.json().catch(() => ({ error: 'Error saving file' }));
    const errorMessage = errorData.error || errorData.message || 'Error saving file';
    throw new Error(errorMessage, { cause: response.status });
  }
};

const getCleanFileName = (fileName: string) => {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/_{2,}/g, '_'); // replace special characters with underscore
};

export const storageService = {
  imageUpload,
  fileUpload,
};
