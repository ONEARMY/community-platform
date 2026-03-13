import styled from '@emotion/styled';
import { ImageInputV2 } from 'oa-components';
import { DBMedia, MediaWithPublicUrl, ResearchUpdateFormData } from 'oa-shared';
import { useState } from 'react';
import { useForm, useFormState } from 'react-final-form';
import { FormFieldWrapper } from 'src/pages/common/FormFields';
import { storageService } from 'src/services/storageService';
import { Spinner, Text } from 'theme-ui';

const ImageInputFieldWrapper = styled.div`
  width: 150px;
  height: 100px;
  margin-right: 10px;
  margin-bottom: 6px;
`;

interface IProps {
  contentId: number;
}

export const ResearchImagesField = (props: IProps) => {
  const form = useForm();
  const state = useFormState<ResearchUpdateFormData>();
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleImageSelect = async (file: File | undefined, index: number) => {
    if (!file) {
      return;
    }

    setUploadingIndex(index);
    setUploadError(null);

    try {
      const uploadedImage = await storageService.imageUpload(props.contentId, 'research', file);

      // Set the image at the specific index
      const currentImages = state.values.images || [];
      const updatedImages = [...currentImages];
      updatedImages[index] = uploadedImage;
      form.change('images', updatedImages);
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : 'Failed to upload image. Please try again.',
      );
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleImageError = (error: string) => {
    setUploadError(error);
  };

  const currentImages: DBMedia[] = state.values.images || [];

  const numberOfImageInputsAvailable = currentImages
    ? Math.min(currentImages.filter((x) => !!x).length + 1, 10)
    : 1;

  const removeImage = (index: number) => {
    form.change(
      'images',
      state.values.images?.slice(0, index).concat(state.values.images?.slice(index + 1)),
    );
  };

  return (
    <FormFieldWrapper htmlFor="images" text="Images" flexDirection="row" flexWrap="wrap">
      {uploadError && (
        <Text sx={{ color: 'error', fontSize: 1, mb: 2, width: '100%' }}>{uploadError}</Text>
      )}

      {[...Array(numberOfImageInputsAvailable)].map((_, i) => {
        const isUploading = uploadingIndex === i;
        const hasImage = currentImages[i];

        if (hasImage && !isUploading) {
          return null; // Don't show upload slot if already uploaded
        }

        return (
          <ImageInputFieldWrapper key={`image-upload-${i}`} data-cy={`image-upload-${i}`}>
            {isUploading ? (
              <Spinner size={20} />
            ) : (
              <ImageInputV2
                onFilesChange={(file) => handleImageSelect(file, i)}
                onError={handleImageError}
              />
            )}
          </ImageInputFieldWrapper>
        );
      })}

      {state.values.images?.map((image: MediaWithPublicUrl, i: number) => (
        <ImageInputFieldWrapper key={`existing-image-${i}`} data-cy={`existing-image-${i}`}>
          <ImageInputV2
            image={image}
            onFilesChange={(file) => {
              if (!file) {
                removeImage(i);
              }
            }}
          />
        </ImageInputFieldWrapper>
      ))}
    </FormFieldWrapper>
  );
};
