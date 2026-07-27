import { ImageInputV2 } from 'oa-components';
import type { MediaWithPublicUrl } from 'oa-shared';
import { commonStyles } from 'oa-themes';
import { useState } from 'react';
import { useForm, useFormState } from 'react-final-form';
import { FormFieldWrapper } from 'src/pages/common/FormFields';
import { ImageInputFieldWrapper } from 'src/pages/common/FormFields/ImageInputFieldWrapper';
import { fields } from 'src/pages/Question/labels';
import { storageService } from 'src/services/storageService';
import { Flex, Spinner, Text } from 'theme-ui';

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
      setUploadError(
        error instanceof Error ? error.message : 'Failed to upload image. Please try again.',
      );
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleDeleteImage = (imageIndex: number) => {
    const updatedImages = images.filter((_, i) => i !== imageIndex);
    form.change('images', updatedImages);
  };

  return (
    <FormFieldWrapper htmlFor="images" text={fields.images.title}>
      {uploadError && (
        <Text sx={{ color: 'error', fontSize: 1, mb: 2, width: '100%' }}>{uploadError}</Text>
      )}

      <Flex sx={{ gap: 2, flexWrap: 'wrap' }}>
        {/* Show existing images in order */}
        {images.map((image, index) => (
          <ImageInputFieldWrapper key={`image-upload-${index}`} data-cy={`image-upload-${index}`}>
            <ImageInputV2
              image={image}
              onFilesChange={(file) => handleImageSelect(file, index)}
              onError={setUploadError}
            />
          </ImageInputFieldWrapper>
        ))}

        {/* Show upload slot at the end if under the limit */}
        {images.length < maxImages && (
          <ImageInputFieldWrapper data-cy="new-image-upload">
            {uploadingIndex === images.length ? (
              <Spinner size={20} sx={{ color: commonStyles.colors.darkGrey }} />
            ) : (
              <ImageInputV2
                onFilesChange={(file) => handleImageSelect(file, images.length)}
                onError={setUploadError}
              />
            )}
          </ImageInputFieldWrapper>
        )}
      </Flex>
    </FormFieldWrapper>
  );
};
