import styled from '@emotion/styled';
import { ImageInput, ImageInputDeleteImage, ImageInputWrapper } from 'oa-components';
import type { Image } from 'oa-shared';
import { useState } from 'react';
import { useForm, useFormState } from 'react-final-form';
import { FieldContainer } from 'src/common/Form/FieldContainer';
import { FormFieldWrapper } from 'src/pages/common/FormFields';
import { fields } from 'src/pages/Question/labels';
import { storageService } from 'src/services/storageService';
import { Image as ImageComponent, Spinner, Text } from 'theme-ui';

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
  const state = useFormState<{ images: Image[] }>();
  const form = useForm<{ images: Image[] }>();
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const images = state.values.images || [];

  const handleImageSelect = async (fileMeta: any, imageIndex: number) => {
    // If user is clearing the image
    if (!fileMeta || !fileMeta.photoData) {
      return;
    }

    setUploadingIndex(imageIndex);
    setUploadError(null);

    try {
      const uploadedImage = await storageService.imageUpload(
        contentId,
        contentType,
        fileMeta.photoData,
      );

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

  const renderImageSlot = (index: number) => {
    const isUploading = uploadingIndex === index;

    // Show existing image
    if (index < images.length && !isUploading) {
      const image = images[index];
      return (
        <ImageInputFieldWrapper key={`existing-image-${index}`} data-cy={`existing-image-${index}`}>
          <FieldContainer
            style={{
              height: '100%',
              width: '100%',
              overflow: 'hidden',
            }}
          >
            <ImageInputWrapper hasUploadedImg={true}>
              <ImageComponent src={image.publicUrl} />
              <ImageInputDeleteImage onClick={() => handleDeleteImage(index)} />
            </ImageInputWrapper>
          </FieldContainer>
        </ImageInputFieldWrapper>
      );
    }

    // Show upload field or spinner for the next available slot
    if (index === images.length) {
      return (
        <ImageInputFieldWrapper key={`image-upload-${index}`} data-cy={`image-upload-${index}`}>
          {isUploading ? (
            <FieldContainer
              style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Spinner size={20} />
            </FieldContainer>
          ) : (
            <FieldContainer
              style={{
                height: '100%',
                width: '100%',
                overflow: 'hidden',
              }}
            >
              <ImageInput
                hasText={false}
                value={undefined}
                onFilesChange={(fileMeta) => handleImageSelect(fileMeta, index)}
              />
            </FieldContainer>
          )}
        </ImageInputFieldWrapper>
      );
    }

    return null;
  };

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
      {[...Array(Math.min(images.length + 1, maxImages))].map((_, i) => renderImageSlot(i))}
    </FormFieldWrapper>
  );
};
