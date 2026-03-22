import styled from '@emotion/styled';
import { ImageInputV2 } from 'oa-components';
import type { MediaWithPublicUrl } from 'oa-shared';
import { commonStyles } from 'oa-themes';
import { useState } from 'react';
import { useForm, useFormState } from 'react-final-form';
import { steps } from 'src/pages/Library/labels';
import { storageService } from 'src/services/storageService';
import { Spinner, Text } from 'theme-ui';
import { FormFieldWrapper } from './FormFieldWrapper';

const ImageInputFieldWrapper = styled.div`
  width: 150px;
  height: 100px;
  margin-right: 10px;
`;

const MAX_IMAGES = 10;

interface StepImagesFieldProps {
  stepIndex: number;
  contentType: 'projects' | 'research' | 'questions' | 'news';
  contentId?: number | null;
  images: MediaWithPublicUrl[];
  fieldName: string;
  onImageUploaded?: () => void;
}

export const StepImagesField = ({
  stepIndex,
  contentType,
  contentId,
  images,
  fieldName,
  onImageUploaded,
}: StepImagesFieldProps) => {
  const state = useFormState();
  const form = useForm();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const imagesFieldName = `steps[${stepIndex}].images`;

  const handleImageSelect = async (file: File | undefined) => {
    if (!file) {
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

  const removeImage = (imageIndex: number) => {
    const updatedImages = (images || []).filter((_, i) => i !== imageIndex);
    form.change(imagesFieldName, updatedImages);
  };

  return (
    <FormFieldWrapper
      htmlFor={fieldName}
      text={steps.images.title}
      flexDirection="row"
      flexWrap="wrap"
    >
      {uploadError && (
        <Text sx={{ color: 'error', fontSize: 1, mb: 2, width: '100%' }}>{uploadError}</Text>
      )}

      {images?.map((image, i) => (
        <ImageInputFieldWrapper key={`image-${i}`} data-cy={`image-${i}`}>
          <ImageInputV2
            image={image}
            onFilesChange={(file) => {
              if (!file) {
                removeImage(i);
              }
            }}
            onError={setUploadError}
          />
        </ImageInputFieldWrapper>
      ))}

      {images.length < MAX_IMAGES && (
        <ImageInputFieldWrapper data-cy="new-image-upload">
          {isUploading ? (
            <Spinner size={20} sx={{ color: commonStyles.colors.darkGrey }} />
          ) : (
            <ImageInputV2
              onFilesChange={(file) => handleImageSelect(file)}
              onError={setUploadError}
            />
          )}
        </ImageInputFieldWrapper>
      )}
    </FormFieldWrapper>
  );
};
