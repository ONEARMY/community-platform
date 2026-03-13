import styled from '@emotion/styled';
import { ImageInputV2 } from 'oa-components';
import type { MediaWithPublicUrl } from 'oa-shared';
import { useState } from 'react';
import { useForm, useFormState } from 'react-final-form';
import { storageService } from 'src/services/storageService';
import { Spinner, Text } from 'theme-ui';

const ImageInputFieldWrapper = styled.div`
  width: 150px;
  height: 100px;
  margin-right: 10px;
`;

interface StepImageFieldProps {
  stepIndex: number;
  imageIndex: number;
  contentType: 'projects' | 'research' | 'questions' | 'news';
  contentId?: number | null;
  images: MediaWithPublicUrl[];
  onImageUploaded?: () => void;
}

export const StepImageField = ({
  stepIndex,
  imageIndex,
  contentType,
  contentId,
  images,
  onImageUploaded,
}: StepImageFieldProps) => {
  const state = useFormState();
  const form = useForm();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const imagesFieldName = `steps[${stepIndex}].images`;

  const handleImageSelect = async (file: File | undefined, index: number) => {
    // If user is clearing the image
    if (!file) {
      const updatedImages = (images || []).filter((_, i) => i !== index);
      form.change(imagesFieldName, updatedImages);
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const uploadedImage = await storageService.imageUpload(contentId ?? null, contentType, file);

      const currentImages = state.values.steps?.[stepIndex]?.images || [];
      // Add new image and deduplicate by id
      const allImages = [...currentImages, uploadedImage];
      const uniqueImagesMap = new Map(allImages.map((img) => [img.id, img]));
      const uniqueImages = Array.from(uniqueImagesMap.values());
      form.change(imagesFieldName, uniqueImages);

      onImageUploaded?.();
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : 'Failed to upload image. Please try again.',
      );
    } finally {
      setIsUploading(false);
    }
  };

  // Show existing images in the first slot
  if (imageIndex < images.length) {
    const image = images[imageIndex];
    return (
      <ImageInputFieldWrapper data-cy={`image-${imageIndex}`}>
        <ImageInputV2
          image={image}
          onFilesChange={(file) => {
            if (file) {
              handleImageSelect(file, imageIndex);
            } else {
              const updatedImages = (images || []).filter((_, i) => i !== imageIndex);
              form.change(imagesFieldName, updatedImages);
            }
          }}
          onError={setUploadError}
        />
      </ImageInputFieldWrapper>
    );
  }

  // Show upload field or spinner
  return (
    <ImageInputFieldWrapper data-cy={`image-upload-${imageIndex}`}>
      {uploadError && <Text sx={{ color: 'error', fontSize: 0, mb: 1 }}>{uploadError}</Text>}
      {isUploading ? (
        <Spinner size={20} />
      ) : (
        <ImageInputV2
          onFilesChange={(file) => file && handleImageSelect(file, imageIndex)}
          onError={setUploadError}
        />
      )}
    </ImageInputFieldWrapper>
  );
};
