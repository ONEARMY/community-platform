import styled from '@emotion/styled';
import { ImageInputV2 } from 'oa-components';
import type { MediaWithPublicUrl } from 'oa-shared';
import { commonStyles } from 'oa-themes';
import { useState } from 'react';
import { useForm } from 'react-final-form';
import { FormFieldWrapper } from 'src/pages/common/FormFields';
import { fields } from 'src/pages/News/labels';
import { storageService } from 'src/services/storageService';
import { Spinner, Text } from 'theme-ui';

const ImageInputFieldWrapper = styled.div`
  width: 620px;
  max-width: 100%;
  height: 310px;
`;

interface IProps {
  image: MediaWithPublicUrl | null;
  removeImage: () => void;
  contentId: number | null;
}

export const NewsImageField = (props: IProps) => {
  const { image, removeImage, contentId } = props;
  const form = useForm();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleImageSelect = async (file: File | undefined) => {
    if (!file) {
      form.change('heroImage', null);
      setUploadError(null);
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const uploadedImage = await storageService.imageUpload(contentId, 'news', file);
      form.change('heroImage', uploadedImage);
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : 'Failed to upload image. Please try again.',
      );
      form.change('heroImage', null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageError = (error: string) => {
    setUploadError(error);
  };

  return (
    <FormFieldWrapper
      description={fields.heroImage.description}
      htmlFor="images"
      text={fields.heroImage.title}
      required
    >
      {uploadError && (
        <Text sx={{ color: 'error', fontSize: 1, mb: 2, width: '100%' }}>{uploadError}</Text>
      )}

      {!image && !isUploading && (
        <ImageInputFieldWrapper data-cy="heroImage-upload">
          <ImageInputV2 onFilesChange={handleImageSelect} onError={handleImageError} />
        </ImageInputFieldWrapper>
      )}

      {isUploading && (
        <ImageInputFieldWrapper data-cy="heroImage-uploading">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <Spinner sx={{ color: commonStyles.colors.darkGrey }} />
            <Text sx={{ ml: 2 }}>Uploading image...</Text>
          </div>
        </ImageInputFieldWrapper>
      )}

      {image && !isUploading && (
        <ImageInputFieldWrapper key="existingHeroImage" data-cy="existingHeroImage">
          <ImageInputV2
            image={image}
            onFilesChange={(file) => {
              if (!file) {
                removeImage();
              }
            }}
            onError={setUploadError}
          />
        </ImageInputFieldWrapper>
      )}
    </FormFieldWrapper>
  );
};
