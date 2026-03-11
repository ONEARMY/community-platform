import styled from '@emotion/styled';
import { ImageInput, ImageInputDeleteImage, ImageInputWrapper } from 'oa-components';
import type { Image } from 'oa-shared';
import { useState } from 'react';
import { useForm, useFormState } from 'react-final-form';
import { FieldContainer } from 'src/common/Form/FieldContainer';
import { storageService } from 'src/services/storageService';
import { Image as ImageComponent, Spinner, Text } from 'theme-ui';

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
  images: Image[];
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

  const handleImageSelect = async (fileMeta: any) => {
    // If user is clearing the image
    if (!fileMeta || !fileMeta.photoData) {
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const uploadedImage = await storageService.imageUpload(
        contentId ?? null,
        contentType,
        fileMeta.photoData,
      );

      const currentImages = state.values.steps?.[stepIndex]?.images || [];
      // Add new image and deduplicate by id
      const allImages = [...currentImages, uploadedImage];
      const uniqueImagesMap = new Map(allImages.map((img) => [img.id, img]));
      const uniqueImages = Array.from(uniqueImagesMap.values());
      form.change(imagesFieldName, uniqueImages);

      onImageUploaded?.();
    } catch (error) {
      console.error('Error uploading step image:', error);
      setUploadError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Show existing images in the first slot
  if (imageIndex < images.length) {
    const image = images[imageIndex];
    return (
      <ImageInputFieldWrapper data-cy={`existing-image-${imageIndex}`}>
        <FieldContainer
          style={{
            height: '100%',
            width: '100%',
            overflow: 'hidden',
          }}
        >
          <ImageInputWrapper hasUploadedImg={true}>
            <ImageComponent src={image.publicUrl} />
            <ImageInputDeleteImage
              onClick={() => {
                const updatedImages = (images || []).filter((_, i) => i !== imageIndex);
                form.change(imagesFieldName, updatedImages);
              }}
            />
          </ImageInputWrapper>
        </FieldContainer>
      </ImageInputFieldWrapper>
    );
  }

  // Show upload field or spinner
  return (
    <ImageInputFieldWrapper data-cy={`image-upload-${imageIndex}`}>
      {uploadError && <Text sx={{ color: 'error', fontSize: 0, mb: 1 }}>{uploadError}</Text>}
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
          <ImageInput hasText={false} value={undefined} onFilesChange={handleImageSelect} />
        </FieldContainer>
      )}
    </ImageInputFieldWrapper>
  );
};
