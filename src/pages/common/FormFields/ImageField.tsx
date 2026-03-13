import styled from '@emotion/styled';
import { ImageInputV2 } from 'oa-components';
import type { MediaWithPublicUrl } from 'oa-shared';
import { useState } from 'react';
import { useForm, useFormState } from 'react-final-form';
import { FieldContainer } from 'src/common/Form/FieldContainer';
import { FormFieldWrapper } from 'src/pages/common/FormFields';
import { storageService } from 'src/services/storageService';
import { Spinner, Text } from 'theme-ui';

const ImageInputFieldWrapper = styled.div`
  height: 200px;
  width: 370px;
  max-width: 100%;
  margin-bottom: 6px;
`;

type ImageFieldProps = {
  title: string;
  contentType: 'projects' | 'research' | 'questions' | 'news';
  contentId?: number | null;
};

export const ImageField = (props: ImageFieldProps) => {
  const { title, contentType, contentId = null } = props;
  const state = useFormState<{ image: MediaWithPublicUrl | null }>();
  const form = useForm<{ image: MediaWithPublicUrl | null }>();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleImageSelect = async (file: File | undefined) => {
    // If user is clearing the image
    if (!file) {
      form.change('image', null);
      setUploadError(null);
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      // Upload the image first
      const uploadedImage = await storageService.imageUpload(contentId, contentType, file);

      // Only then set the form state with the uploaded metadata
      form.change('image', uploadedImage);
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError('Failed to upload image. Please try again.');
      form.change('image', null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <FormFieldWrapper htmlFor="image" text={title} required>
      {uploadError && <Text sx={{ color: 'error', fontSize: 1, mb: 2 }}>{uploadError}</Text>}

      <ImageInputFieldWrapper data-cy={isUploading ? 'image-uploading' : 'image-input'}>
        <FieldContainer
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isUploading ? (
            <>
              <Spinner />
              <Text sx={{ ml: 2 }}>Uploading image...</Text>
            </>
          ) : (
            <ImageInputV2
              onFilesChange={handleImageSelect}
              onError={setUploadError}
              image={state.values.image || undefined}
            />
          )}
        </FieldContainer>
      </ImageInputFieldWrapper>
    </FormFieldWrapper>
  );
};
