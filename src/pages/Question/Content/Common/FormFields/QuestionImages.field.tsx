import styled from '@emotion/styled';
import { ImageInputV2 } from 'oa-components';
import type { MediaWithPublicUrl } from 'oa-shared';
import { useState } from 'react';
import { useForm, useFormState } from 'react-final-form';
import { FormFieldWrapper } from 'src/pages/common/FormFields';
import { fields } from 'src/pages/Question/labels';
import { storageService } from 'src/services/storageService';
import { Spinner, Text } from 'theme-ui';

const ImageInputFieldWrapper = styled.div`
  width: 150px;
  height: 100px;
  margin-right: 10px;
  margin-bottom: 6px;
`;

interface IProps {
  contentType: 'questions';
  contentId: number | null;
  maxImages: number;
}

export const QuestionImagesField = (props: IProps) => {
  const { contentType, contentId, maxImages } = props;
  const state = useFormState();
  const form = useForm();
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const images = (state.values.images as MediaWithPublicUrl[]) || [];

  const handleImageSelect = async (file: File | undefined, imageIndex: number) => {
    if (!file) {
      handleDeleteImage(imageIndex);
      return;
    }

    setUploadingIndex(imageIndex);
    setUploadError(null);

    try {
      const uploadedImage = await storageService.imageUpload(contentId, contentType, file);

      // Add new image and deduplicate by id
      const allImages = [...images, uploadedImage];
      const uniqueImagesMap = new Map(allImages.map((img) => [img.id, img]));
      const uniqueImages = Array.from(uniqueImagesMap.values());
      form.change('images', uniqueImages);
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError('Failed to upload image. Please try again.');
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleDeleteImage = (imageIndex: number) => {
    const updatedImages = images.filter((_, i) => i !== imageIndex);
    form.change('images', updatedImages);
  };

  const numberOfUploadSlotsAvailable = Math.min(images.length + 1, maxImages);

  return (
    <FormFieldWrapper
      htmlFor="images"
      text={fields.images.title}
      flexDirection="row"
      flexWrap="wrap"
    >
      {uploadError && (
        <Text sx={{ color: 'error', fontSize: 1, mb: 2, width: '100%' }}>{uploadError}</Text>
      )}

      {[...Array(numberOfUploadSlotsAvailable)].map((_, index) => {
        const isUploading = uploadingIndex === index;
        const hasImage = images[index];

        if (hasImage && !isUploading) {
          return null;
        }

        return (
          <ImageInputFieldWrapper key={`image-upload-${index}`} data-cy={`image-upload-${index}`}>
            {isUploading ? (
              <Spinner size={20} />
            ) : (
              <ImageInputV2 onFilesChange={(file) => handleImageSelect(file, index)} />
            )}
          </ImageInputFieldWrapper>
        );
      })}

      {images.map((image, index) => (
        <ImageInputFieldWrapper key={`existing-image-${index}`} data-cy={`existing-image-${index}`}>
          <ImageInputV2
            image={image}
            onFilesChange={(fileMeta) => {
              if (!fileMeta) {
                handleDeleteImage(index);
              }
            }}
          />
        </ImageInputFieldWrapper>
      ))}
    </FormFieldWrapper>
  );
};
